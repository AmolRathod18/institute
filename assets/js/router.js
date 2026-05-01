/**
 * Reszolute SPA Router
 * Intercepts internal navigation clicks and swaps <main> content
 * via fetch(), uses history.pushState() for URL management.
 * No full-page refreshes — instant navigation with fade transition.
 */

(function () {
    'use strict';

    // ─── Config ───────────────────────────────────────────────────────────────
    const TRANSITION_MS = 220;   // fade duration (ms)
    const DYNAMIC_HEAD_STYLE_ID = 'router-dynamic-head-styles';
    const IGNORED_SCRIPT_PATTERNS = [
        /bootstrap(\.bundle)?(\.min)?\.js/i,
        /assets\/js\/components\.js$/i,
        /assets\/js\/main\.js$/i,
        /assets\/js\/router\.js$/i
    ];
    const CURRENT_SCRIPT_SET = new Set(
        Array.from(document.querySelectorAll('script[src]'))
            .map(s => {
                try { return new URL(s.getAttribute('src'), location.href).href; }
                catch { return null; }
            })
            .filter(Boolean)
    );

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /** Resolve a raw href to a fully-qualified URL string for comparison */
    function resolveUrl(href) {
        try { return new URL(href, location.href).href; }
        catch { return null; }
    }

    /** True if the URL belongs to this origin and is an HTML page */
    function isInternal(url) {
        if (!url) return false;
        try {
            const u = new URL(url);
            if (u.origin !== location.origin) return false;
            // skip anchors-only links, mailto, tel, download links
            const path = u.pathname;
            // only handle .html pages or bare directory roots
            return /\.(html)$/i.test(path) || path.endsWith('/');
        } catch { return false; }
    }

    /** Determine the "root-relative" pathname for a URL */
    function getPathname(url) {
        try { return new URL(url).pathname; }
        catch { return url; }
    }

    /** Identify which nav data-page value matches the given pathname */
    function resolvePageId(pathname) {
        const seg = pathname.split('/').filter(Boolean);
        const file = seg[seg.length - 1] || '';
        if (!file || file === 'index.html') return 'home';
        if (file === 'about.html')    return 'about';
        if (file === 'careers.html')  return 'careers';
        if (file === 'contact.html')  return 'contact';
        if (file === 'services.html') return 'services';
        if (seg.includes('services')) return 'services';
        return '';
    }

    // ─── Page cache & fetch ───────────────────────────────────────────────────

    /**
     * Fetch a page and extract its <main> innerHTML + <title>.
     * Returns { title, mainHTML, headStyles, pageScripts } or null on error.
     */
    async function fetchPage(url) {
        try {
            const res = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();

            const parser  = new DOMParser();
            const doc     = parser.parseFromString(text, 'text/html');
            const main    = doc.querySelector('main');
            const title   = doc.querySelector('title')?.textContent || document.title;
            const headStyles = Array.from(doc.head?.querySelectorAll('style') || [])
                .map(styleEl => styleEl.textContent || '')
                .join('\n');

            const targetScripts = Array.from(doc.querySelectorAll('script[src]'))
                .map(s => {
                    try { return new URL(s.getAttribute('src'), url).href; }
                    catch { return null; }
                })
                .filter(Boolean);
            const pageScripts = targetScripts.filter(src =>
                !IGNORED_SCRIPT_PATTERNS.some(pattern => pattern.test(src))
            );

            if (!main) throw new Error('No <main> found in ' + url);

            const result = {
                title,
                mainHTML: main.innerHTML,
                headStyles,
                pageScripts
            };
            return result;
        } catch (err) {
            console.warn('[Router] Fetch failed for', url, err);
            return null;
        }
    }

    function applyDynamicHeadStyles(cssText) {
        let styleEl = document.getElementById(DYNAMIC_HEAD_STYLE_ID);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = DYNAMIC_HEAD_STYLE_ID;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = cssText || '';
    }

    async function ensurePageScripts(sources) {
        if (!sources || !sources.length) return;
        const missing = sources.filter(src => !CURRENT_SCRIPT_SET.has(src));
        if (!missing.length) return;

        for (const src of missing) {
            await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
                CURRENT_SCRIPT_SET.add(src);
                resolve();
            };
            script.onerror = () => resolve();
            document.body.appendChild(script);
            });
        }
    }

    // ─── Transition helpers ───────────────────────────────────────────────────

    function fadeOut(el) {
        return new Promise(resolve => {
            el.style.transition = `opacity ${TRANSITION_MS}ms ease`;
            el.style.opacity = '0';
            setTimeout(resolve, TRANSITION_MS);
        });
    }

    function fadeIn(el) {
        el.style.opacity = '0';
        // Force reflow
        void el.offsetHeight;
        el.style.transition = `opacity ${TRANSITION_MS}ms ease`;
        el.style.opacity = '1';
    }

    // ─── After-navigate tasks ─────────────────────────────────────────────────

    /** Re-run page-specific init that was originally in main.js */
    function reinitPage() {
        // Scroll to top instantly
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Re-run hero slider if present
        if (typeof initHeroSlider === 'function') initHeroSlider();

        // Re-run counter animations
        if (typeof animateCounters === 'function') animateCounters();

        // Re-run intersection observer for fade-in cards
        initFadeObserver();

        // Re-run contact form wiring if contact page is active
        if (typeof initContactForm === 'function') initContactForm();

        // Reinitialize Bootstrap dropdowns (for newly inserted content)
        if (window.bootstrap) {
            document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
                try { new bootstrap.Dropdown(el); } catch {}
            });
        }

        // Scroll progress bar reset
        const bar = document.querySelector('.scroll-progress-bar');
        if (bar) bar.style.width = '0%';
    }

    /** Lightweight Intersection Observer for .fade-in card reveals */
    function initFadeObserver() {
        const targets = document.querySelectorAll(
            '.service-card, .why-card, .process-step-card, .tech-logo-item, ' +
            '.feature-box, .benefit-card, .track-card, .position-card'
        );
        if (!targets.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.animationPlayState = 'running';
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        targets.forEach(t => {
            t.style.animationPlayState = 'paused';
            obs.observe(t);
        });
    }

    /** Update the active nav link highlight */
    function updateActiveNav(pathname) {
        const pageId = resolvePageId(pathname);
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
    }

    // ─── Pre-fetch on hover for instant feel ─────────────────────────────────

    function attachPrefetch(link) {
        let prefetched = false;
        link.addEventListener('mouseenter', () => {
            if (prefetched) return;
            const url = resolveUrl(link.href);
            if (url && isInternal(url)) {
                prefetched = true;
                fetchPage(url).catch(() => {});
            }
        }, { passive: true });
    }

    // ─── Core navigation ─────────────────────────────────────────────────────

    let isNavigating = false;

    async function navigate(url, pushState = true) {
        if (isNavigating) return;

        const resolved = resolveUrl(url);
        if (!resolved) return;

        // Same page? Just scroll to top
        if (resolved === location.href) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        isNavigating = true;

        const main = document.querySelector('main');
        if (!main) { isNavigating = false; return; }

        // Show a thin loading bar at the top
        showProgress();

        // Fetch target page
        const page = await fetchPage(resolved);

        if (!page) {
            // Fallback: real navigation if fetch fails
            hideProgress();
            location.href = url;
            return;
        }

        // Fade out current content
        await fadeOut(main);

        // Swap content
        main.innerHTML = page.mainHTML;
        document.title  = page.title;
        applyDynamicHeadStyles(page.headStyles);
        await ensurePageScripts(page.pageScripts);

        // Update URL
        if (pushState) {
            history.pushState({ url: resolved }, page.title, resolved);
        }

        // Update active nav
        updateActiveNav(getPathname(resolved));

        // Update paths for links in new content (since page may come from a sub-dir)
        fixContentPaths(main, resolved);

        // Intercept any new links in the swapped content
        attachLinkInterceptors(main);

        // Fade in new content
        fadeIn(main);

        // Post-navigation tasks
        reinitPage();

        hideProgress();
        isNavigating = false;
    }

    /**
     * Fix relative paths inside swapped content if the fetched page
     * was in a different directory than the current page.
     */
    function fixContentPaths(container, fromUrl) {
        const fromDir = fromUrl.substring(0, fromUrl.lastIndexOf('/') + 1);
        const currentDir = location.href.substring(0, location.href.lastIndexOf('/') + 1);

        if (fromDir === currentDir) return;  // same directory, nothing to fix

        // Fix image src and anchor hrefs
        container.querySelectorAll('img[src], a[href], link[href]').forEach(el => {
            const attr = el.tagName === 'A' || el.tagName === 'LINK' ? 'href' : 'src';
            const val = el.getAttribute(attr);
            if (!val || val.startsWith('http') || val.startsWith('//') ||
                val.startsWith('data:') || val.startsWith('#')) return;

            // Resolve relative to source page, then make relative to current page
            try {
                const absolute = new URL(val, fromDir).href;
                el.setAttribute(attr, absolute);
            } catch {}
        });
    }

    // ─── Progress bar ─────────────────────────────────────────────────────────

    let progressBar = null;
    let progressTimer = null;

    function showProgress() {
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'router-progress';
            progressBar.style.cssText = [
                'position:fixed', 'top:0', 'left:0', 'height:2px',
                'background:#111111', 'z-index:9999',
                'width:0%', 'transition:width 0.25s ease',
                'pointer-events:none'
            ].join(';');
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = '0%';
        progressBar.style.opacity = '1';

        // Animate to 80% while waiting for fetch
        clearTimeout(progressTimer);
        progressTimer = setTimeout(() => {
            if (progressBar) progressBar.style.width = '75%';
        }, 50);
    }

    function hideProgress() {
        if (!progressBar) return;
        clearTimeout(progressTimer);
        progressBar.style.width = '100%';
        setTimeout(() => {
            if (progressBar) progressBar.style.opacity = '0';
        }, 250);
    }

    // ─── Link interceptors ────────────────────────────────────────────────────

    function shouldIntercept(link) {
        // Skip: no href, external, new tab, download, anchor-only, tel/mailto
        if (!link || !link.href) return false;
        if (link.target === '_blank' || link.target === '_parent') return false;
        if (link.hasAttribute('download')) return false;
        if (link.getAttribute('data-bs-toggle') === 'dropdown') return false;
        if (link.getAttribute('href')?.startsWith('#')) return false;
        if (link.getAttribute('href')?.startsWith('mailto:')) return false;
        if (link.getAttribute('href')?.startsWith('tel:')) return false;
        return isInternal(resolveUrl(link.href));
    }

    function attachLinkInterceptors(root = document) {
        root.querySelectorAll('a[href]').forEach(link => {
            // Avoid double-attaching
            if (link.__routerAttached) return;
            link.__routerAttached = true;

            if (shouldIntercept(link)) {
                attachPrefetch(link);
                link.addEventListener('click', handleLinkClick);
            }
        });
    }

    function handleLinkClick(e) {
        const link = e.currentTarget;
        if (!shouldIntercept(link)) return;

        // Allow modifier keys to open new tab normally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        navigate(link.href);
    }

    // ─── popstate (browser back / forward) ───────────────────────────────────

    window.addEventListener('popstate', (e) => {
        const url = e.state?.url || location.href;
        navigate(url, false);   // false = don't pushState again
    });

    // ─── Initial setup ────────────────────────────────────────────────────────

    function init() {
        // Record current page in history state so popstate works on first back
        history.replaceState({ url: location.href }, document.title, location.href);

        // Attach interceptors to all links already in the DOM
        attachLinkInterceptors(document);

        // Watch for DOM mutations (e.g. navbar/footer loaded asynchronously by components.js)
        const mo = new MutationObserver(() => {
            attachLinkInterceptors(document);
        });
        mo.observe(document.body, { childList: true, subtree: true });

        // Initial fade-in observer run
        initFadeObserver();
    }

    // Run after DOM + components are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
