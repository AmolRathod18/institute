/**
 * Component Loader - Loads reusable HTML components
 * Handles path adjustments for nested directories
 */

class ComponentLoader {
    /**
     * Get the relative path to the root directory based on current page location
     */
    static getRootPath() {
        const pathArray = window.location.pathname.split('/');
        const isInSubdirectory = pathArray[pathArray.length - 2] === 'services';
        return isInSubdirectory ? '../' : './';
    }

    /**
     * Adjust all hrefs in component to account for nested directories
     */
    static adjustPaths(html, basePath) {
        const isInSubdirectory = basePath === '../';
        
        // Create a temporary container to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Adjust navbar brand link
        const brandLink = temp.querySelector('.navbar-brand');
        if (brandLink) {
            brandLink.href = isInSubdirectory ? '../index.html' : 'index.html';
            const logo = brandLink.querySelector('.logo-img');
            if (logo) {
                logo.src = isInSubdirectory ? '../assets/img/logo.svg' : 'assets/img/logo.svg';
            }
        }

        // Adjust all links (nav links, footer links, buttons, etc.)
        const allLinks = temp.querySelectorAll('a[href], [href]');
        allLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (href && !href.startsWith('http') && href !== '#') {
                if (isInSubdirectory && !href.startsWith('../')) {
                    // Add ../ prefix if in subdirectory and not already prefixed
                    if (!href.startsWith('services/')) {
                        link.href = '../' + href;
                    } else {
                        link.href = '../' + href;
                    }
                } else if (!isInSubdirectory && href.startsWith('../')) {
                    // Remove ../ prefix if in root directory
                    link.href = href.replace('../', '');
                }
            }
        });

        return temp.innerHTML;
    }

    /**
     * Get current page identifier
     */
    static getCurrentPage() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop() || 'index.html';

        if (filename === 'index.html' || filename === '') {
            return 'home';
        } else if (filename === 'about.html') {
            return 'about';
        } else if (filename === 'services.html' || pathname.includes('services/')) {
            return 'services';
        } else if (filename === 'careers.html') {
            return 'careers';
        } else if (filename === 'contact.html') {
            return 'contact';
        }
        return '';
    }

    /**
     * Load navbar component
     */
    static async loadNavbar() {
        try {
            const rootPath = this.getRootPath();
            const navbarPath = rootPath === '../' ? '../components/navbar.html' : 'components/navbar.html';
            
            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.statusText}`);
            }

            let html = await response.text();
            
            // Adjust paths for nested directories
            html = this.adjustPaths(html, rootPath);

            // Insert navbar at the beginning of body
            const navbar = document.createElement('div');
            navbar.innerHTML = html;
            
            // Check if there's a skip link or navbar already
            const body = document.body;
            const firstElement = body.firstElementChild;
            
            if (firstElement && firstElement.classList.contains('skip-link')) {
                // Insert after skip link
                firstElement.insertAdjacentElement('afterend', navbar.firstElementChild);
            } else {
                // Insert at beginning of body
                body.insertBefore(navbar.firstElementChild, body.firstChild);
            }

            // Set active nav link
            this.setActiveNavLink();

            // Re-initialize navbar functionality
            this.reinitializeNavbar();

        } catch (error) {
            console.error('Error loading navbar component:', error);
        }
    }

    /**
     * Set active nav link based on current page
     */
    static setActiveNavLink() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link[data-page]');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Reinitialize navbar JavaScript functionality
     */
    static reinitializeNavbar() {
        // Get navbar elements
        const navbar = document.getElementById('mainNav');
        if (!navbar) return;

        const navLinks = navbar.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
        const navbarCollapse = navbar.querySelector('.navbar-collapse');
        const dropdownItems = navbar.querySelectorAll('.dropdown-item');

        // Mobile menu auto-close for regular nav links
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

        // Navbar scroll effect
        const handleNavbarScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleNavbarScroll);
        
        // Initialize theme toggle
        this.initializeThemeToggle();
    }

    /**
     * Initialize theme toggle functionality
     */
    static initializeThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeDropdown = document.getElementById('themeDropdown');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (!themeToggle || !themeDropdown) return;

        // Initialize theme from localStorage or set to light-blue as default
        const savedTheme = localStorage.getItem('website-theme') || 'light-blue';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggleIcon(savedTheme);

        // Toggle dropdown visibility
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
        });

        // Handle theme option selection
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = option.getAttribute('data-theme');
                this.switchTheme(theme);
                themeDropdown.classList.remove('show');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-toggle-wrapper')) {
                themeDropdown.classList.remove('show');
            }
        });
    }

    /**
     * Switch theme and update UI
     */
    static switchTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('website-theme', theme);
        this.updateThemeToggleIcon(theme);
    }

    /**
     * Update toggle button icon based on theme
     */
    static updateThemeToggleIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        if (theme === 'dark') {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        } else {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        }
    }

    /**
     * Load footer component
     */
    static async loadFooter() {
        try {
            const rootPath = this.getRootPath();
            const footerPath = rootPath === '../' ? '../components/footer.html' : 'components/footer.html';
            
            const response = await fetch(footerPath);
            if (!response.ok) {
                throw new Error(`Failed to load footer: ${response.statusText}`);
            }

            let html = await response.text();
            
            // Adjust paths for nested directories
            html = this.adjustPaths(html, rootPath);

            // Insert footer before closing body tag
            const footer = document.createElement('div');
            footer.innerHTML = html;
            
            // Find existing footer and replace it, or append if it doesn't exist
            const existingFooter = document.querySelector('footer');
            if (existingFooter) {
                existingFooter.replaceWith(footer.firstElementChild);
            } else {
                document.body.appendChild(footer.firstElementChild);
            }

        } catch (error) {
            console.error('Error loading footer component:', error);
        }
    }

    /**
     * Load scroll-to-top button component
     */
    static async loadScrollToTop() {
        try {
            const rootPath = this.getRootPath();
            const scrollToTopPath = rootPath === '../' ? '../components/scroll-to-top.html' : 'components/scroll-to-top.html';
            
            const response = await fetch(scrollToTopPath);
            if (!response.ok) {
                throw new Error(`Failed to load scroll-to-top: ${response.statusText}`);
            }

            let html = await response.text();
            
            // Insert scroll-to-top button at the end of body
            const button = document.createElement('div');
            button.innerHTML = html;
            document.body.appendChild(button.firstElementChild);

            // Initialize scroll-to-top functionality
            this.initializeScrollToTop();

        } catch (error) {
            console.error('Error loading scroll-to-top component:', error);
        }
    }

    /**
     * Initialize scroll-to-top button functionality
     */
    static initializeScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTopBtn');
        if (!scrollBtn) return;

        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        // Scroll to top when button is clicked
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ComponentLoader.loadNavbar();
        ComponentLoader.loadFooter();
        ComponentLoader.loadScrollToTop();
    });
} else {
    ComponentLoader.loadNavbar();
    ComponentLoader.loadFooter();
    ComponentLoader.loadScrollToTop();
}
