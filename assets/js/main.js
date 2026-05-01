/**
 * Reszolute - Main JavaScript
 * Handles navigation, scroll effects, and animations
 */

// ===========================
// EMAIL JS INITIALIZATION
// ===========================
// Initialize EmailJS with your Public Key
// Get your Public Key from: https://dashboard.emailjs.com/admin/account
if (typeof emailjs !== 'undefined') {
    emailjs.init('osn4i6-JS8KeLuvYY');
}

(function() {
    'use strict';

    // ===========================
    // NAVBAR SCROLL EFFECT
    // ===========================
    function initializeNavbarScroll() {
        const navbar = document.getElementById('mainNav');
        
        if (!navbar) {
            console.warn('mainNav element not found');
            return;
        }

        const heroSection = document.querySelector('.hero-slider, .svc-hero');
        const scrollThreshold = heroSection ? Math.min(heroSection.offsetHeight * 0.1, 80) : 50;
        
        function handleNavbarScroll() {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavbarScroll);
    } else {
        initializeNavbarScroll();
    }

    // ===========================
    // MOBILE MENU AUTO-CLOSE
    // ===========================
    function initializeMobileMenuClose() {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        // Only proceed if elements exist
        if (!navbarCollapse || navLinks.length === 0) {
            return;
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        });

        // Auto-close menu when dropdown item is clicked
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        });
    }
    
    // Initialize menu close when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileMenuClose);
    } else {
        initializeMobileMenuClose();
    }

    // ===========================
    // ACTIVE LINK HIGHLIGHTING
    // ===========================
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = new URL(link.href).pathname;
            
            if (currentPath === linkPath || 
                (currentPath.includes('/services/') && linkPath.includes('services.html'))) {
                link.classList.add('active');
            }
        });

        // Handle dropdown items
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.classList.remove('active');
            const itemPath = new URL(item.href).pathname;
            
            if (currentPath === itemPath) {
                item.classList.add('active');
                // Also mark parent dropdown as active
                const parentDropdown = item.closest('.nav-item').querySelector('.nav-link');
                if (parentDropdown) {
                    parentDropdown.classList.add('active');
                }
            }
        });
    }

    // Initialize active links when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setActiveLink);
    } else {
        setActiveLink();
    }

    // ===========================
    // SMOOTH SCROLL FOR ANCHORS
    // ===========================
    function initializeSmoothScroll() {
        const navbar = document.getElementById('mainNav');
        const navbarHeight = navbar ? navbar.offsetHeight : 70; // Fallback height
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#main-content') {
                    return; // Let skip link work normally
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSmoothScroll);
    } else {
        initializeSmoothScroll();
    }

    // ===========================
    // INTERSECTION OBSERVER - FADE IN ANIMATIONS
    // ===========================
    function initializeIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should fade in
        const fadeElements = document.querySelectorAll(
            '.service-card, .testimonial-card, .service-detail-card, ' +
            '.feature-box, .benefit-card, .track-card, .position-card, ' +
            '.process-step, .section-title, .section-subtitle'
        );
        fadeElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIntersectionObserver);
    } else {
        initializeIntersectionObserver();
    }

    // ===========================
    // HOVER EFFECTS FOR CARDS
    // ===========================
    function initializeCardHoverEffects() {
        const cards = document.querySelectorAll('.service-card, .testimonial-card, .feature-box, .benefit-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCardHoverEffects);
    } else {
        initializeCardHoverEffects();
    }

    // Parallax disabled — causes visual glitches during SPA navigation


    // ===========================
    // SCROLL PROGRESS BAR (read-progress while scrolling)
    // ===========================
    let _scrollBar = null;
    function getOrCreateScrollBar() {
        if (_scrollBar) return _scrollBar;
        // Re-use router-progress if router.js is loaded, else create own
        _scrollBar = document.getElementById('router-progress');
        if (!_scrollBar) {
            _scrollBar = document.createElement('div');
            _scrollBar.id = 'scroll-read-progress';
            _scrollBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#111111;z-index:9998;width:0%;transition:width 0.1s ease;pointer-events:none;';
            document.body.appendChild(_scrollBar);
        }
        return _scrollBar;
    }
    window.addEventListener('scroll', () => {
        const bar = getOrCreateScrollBar();
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        // Only update when not navigating (router sets opacity:0 when hiding)
        if (bar && bar.style.opacity !== '0') bar.style.width = pct + '%';
    }, { passive: true });


    // ===========================
    // BUTTON RIPPLE EFFECT
    // ===========================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple-animation 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .scroll-progress-bar {
            box-shadow: 0 0 10px rgba(0, 102, 204, 0.5);
        }
    `;
    document.head.appendChild(style);

    // ===========================
    // FORM VALIDATION HELPER
    // ===========================
    window.validateForm = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });

        return isValid;
    };

    // Remove invalid class on input
    document.querySelectorAll('.form-control, .form-select').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });

    // ===========================
    // CONSOLE BRANDING
    // ===========================
    // TECH ICON FALLBACKS (when CDN logos fail)
    // ===========================
    function initializeTechLogoFallbacks() {
        const logoImgs = document.querySelectorAll('.tech-logo-item img');
        logoImgs.forEach((img) => {
            if (img.dataset.fallbackBound === 'true') return;
            img.dataset.fallbackBound = 'true';
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const item = this.closest('.tech-logo-item');
                if (!item || item.querySelector('.tech-fallback-icon')) return;
                const icon = document.createElement('i');
                icon.className = 'bi bi-tools tech-fallback-icon';
                item.insertBefore(icon, item.firstChild);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTechLogoFallbacks);
    } else {
        initializeTechLogoFallbacks();
    }

    // STAGGERED CARD ANIMATIONS
    // ===========================
    const cardGroups = document.querySelectorAll('.row');
    
    cardGroups.forEach(group => {
        const cards = group.querySelectorAll('[class*="col"]');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    });

    // ===========================
    // COUNTER ANIMATIONS FOR STATS
    // ===========================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-target]');

        counters.forEach(counter => {
            const target   = parseInt(counter.getAttribute('data-target'), 10);
            const suffix   = counter.getAttribute('data-suffix') || '+';
            const duration = 1800;
            let startTime  = null;
            let done       = false;

            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed  = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value    = Math.floor(easeOutQuart(progress) * target);
                counter.textContent = value + (progress < 1 ? '' : suffix);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    done = true;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !done && !startTime) {
                        requestAnimationFrame(step);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    // Expose globally for router re-init after navigation
    window.animateCounters = animateCounters;
    animateCounters();

    // ===========================
    // SCROLL REVEAL ANIMATIONS
    // ===========================
    const revealElements = document.querySelectorAll('[class*="fade"], [class*="slide"], [class*="scale"]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    // ===========================
    // HERO IMAGE SLIDER  (fixed)
    // ===========================
    const initHeroSlider = () => {
        // ── Slide data ────────────────────────────────────────────
        // Each entry maps 1-to-1 with the .hero-slide element in HTML.
        // The background-image is already set in HTML via inline style;
        // we NEVER overwrite it from JS (that was the original bug).
        const slides = [
            {
                title: 'Transform Your Digital Vision Into Reality',
                subtitle: 'Expert software testing, web development, and design services to accelerate your business growth.',
                link: 'contact.html'
            },
            {
                title: 'Comprehensive Software Testing Solutions',
                subtitle: 'Ensure flawless software delivery with our rigorous quality assurance and testing expertise.',
                link: 'services/testing.html'
            },
            {
                title: 'Modern Frontend Development',
                subtitle: 'Build responsive, fast, and beautiful web applications with cutting-edge technologies.',
                link: 'services/frontend.html'
            },
            {
                title: 'Expert UI/UX Design Services',
                subtitle: 'Create engaging, intuitive digital experiences that users love and businesses thrive with.',
                link: 'services/uiux.html'
            }
        ];

        // ── DOM references ─────────────────────────────────────────
        const heroTitle    = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroLearnMore = document.getElementById('heroLearnMore');
        const heroContent  = document.getElementById('heroContent');
        const slideEls     = document.querySelectorAll('.hero-slide');
        const indicators   = document.querySelectorAll('.indicator');
        const prevBtn      = document.getElementById('heroPrev');
        const nextBtn      = document.getElementById('heroNext');

        // Guard — exit silently if hero markup is absent (other pages)
        if (!heroTitle || !heroSubtitle || !heroContent || !slideEls.length) return;

        // ── State ─────────────────────────────────────────────────
        let currentIndex = 0;
        let autoPlayInterval;
        let isAnimating  = false; // prevent double-trigger mid-transition

        // ── Core: update slide (FIXED) ─────────────────────────────
        //
        // BUG that was here:
        //   slideElements.forEach(el => el.style.backgroundImage = `url('${slide.image}')`);
        //   → set the SAME image on ALL slides, destroying the cross-fade.
        //
        // FIX: each .hero-slide already has its own background-image from
        //   HTML inline style. We only toggle the `active` class to let the
        //   CSS `opacity` transition handle the cross-fade between slides.
        const updateSlide = (index) => {
            if (isAnimating) return;
            isAnimating = true;

            const slide = slides[index];

            // 1. Fade background slides — ONLY toggle .active, never rewrite backgroundImage
            slideEls.forEach((el, i) => el.classList.toggle('active', i === index));

            // 2. Fade text out (CSS transition does the work — see style.css .hero-content)
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(8px)';

            // 3. Wait for text fade-out to complete, then swap text and fade back in.
            //    Using a fixed 350ms (matches the CSS transition duration) keeps it tight.
            const FADE_MS = 350;
            setTimeout(() => {
                // Swap text content
                heroTitle.textContent    = slide.title;
                heroSubtitle.textContent = slide.subtitle;
                if (heroLearnMore) heroLearnMore.href = slide.link;

                // Fade text back in
                heroContent.style.opacity   = '1';
                heroContent.style.transform = 'translateY(0)';

                // Allow next transition only after fade-in completes
                setTimeout(() => { isAnimating = false; }, FADE_MS);
            }, FADE_MS);

            // 4. Update dot indicators
            indicators.forEach((btn, i) => btn.classList.toggle('active', i === index));
        };

        // ── Navigation helpers ─────────────────────────────────────
        const goToNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlide(currentIndex);
        };

        const goToPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlide(currentIndex);
        };

        // ── Auto-play (3500 ms as specified) ──────────────────────
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(goToNext, 3500);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        // ── Event listeners ────────────────────────────────────────
        if (nextBtn) nextBtn.addEventListener('click', () => { goToNext(); resetAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { goToPrev(); resetAutoPlay(); });

        indicators.forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index, 10);
                if (idx !== currentIndex) {
                    currentIndex = idx;
                    updateSlide(currentIndex);
                    resetAutoPlay();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { goToNext(); resetAutoPlay(); }
            if (e.key === 'ArrowLeft')  { goToPrev(); resetAutoPlay(); }
        });

        // Pause on hover to avoid interrupting reading
        const heroSection = document.querySelector('.hero-slider');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            heroSection.addEventListener('mouseleave', startAutoPlay);
        }

    // ── Kick off ───────────────────────────────────────────────
        startAutoPlay();
    };

    // Expose globally for router re-init after navigation
    window.initHeroSlider = initHeroSlider;

    // Initialize hero slider when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroSlider);
    } else {
        initHeroSlider();
    }


    // ===========================
    console.log('%cReszolute', 'font-size: 24px; font-weight: bold; color: #0066CC;');
    console.log('%cBuilt with ❤️ using Bootstrap 5 & Vanilla JS', 'font-size: 12px; color: #6B7280;');

})();
