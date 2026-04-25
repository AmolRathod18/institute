/**
 * Frontend.Club - Main JavaScript
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
        
        // Only set up scroll handler if navbar exists
        if (!navbar) {
            console.warn('mainNav element not found');
            return;
        }
        
        function handleNavbarScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleNavbarScroll);
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

    // ===========================
    // PARALLAX SCROLL EFFECT
    // ===========================
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.why-us-image img, .service-image img, .hero-slide');
        parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            if (element.classList && element.classList.contains('hero-slide')) {
                // Don't parallax hero slider
                return;
            }
            element.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        });
    });

    // ===========================
    // SCROLL PROGRESS BAR
    // ===========================
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #0066CC, #FF6B35);
            z-index: 999;
            width: 0%;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        return progressBar;
    };

    const progressBar = createProgressBar();

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });

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
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Trigger when counter comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && current === 0) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }

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
    // HERO IMAGE SLIDER
    // ===========================
    const initHeroSlider = () => {
        // Slide data with background images, titles, and subtitles
        const slides = [
            {
                title: "Transform Your Digital Vision Into Reality",
                subtitle: "Expert software testing, web development, and design services to accelerate your business growth.",
                link: "contact.html",
                image: "assets/img/landing.png"
            },
            {
                title: "Comprehensive Software Testing Solutions",
                subtitle: "Ensure flawless software delivery with our rigorous quality assurance and testing expertise.",
                link: "services/testing.html",
                image: "assets/img/IMG1.jpg"
            },
            {
                title: "Modern Frontend Development",
                subtitle: "Build responsive, fast, and beautiful web applications with cutting-edge technologies.",
                link: "services/frontend.html",
                image: "assets/img/Front_End.jpg"
            },
            {
                title: "Expert UI/UX Design Services",
                subtitle: "Create engaging, intuitive digital experiences that users love and businesses thrive with.",
                link: "services/uiux.html",
                image: "assets/img/UI_UX.jpg"
            }
        ];

        // Get DOM elements
        const sliderContainer = document.querySelector('.hero-slides-wrapper');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroLearnMore = document.getElementById('heroLearnMore');
        const heroContent = document.getElementById('heroContent');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('heroPrev');
        const nextBtn = document.getElementById('heroNext');

        // Return if elements not found
        if (!sliderContainer || !heroTitle || !heroSubtitle || !heroLearnMore || !heroContent || indicators.length === 0) {
            return;
        }

        let currentIndex = 0;
        let autoPlayInterval;

        // Update slide content and styling
        const updateSlide = (index) => {
            const slide = slides[index];

            // Fade out current content
            heroContent.classList.add('fade-out');

            // Update slide backgrounds
            const slideElements = document.querySelectorAll('.hero-slide');
            slideElements.forEach((slideEl, idx) => {
                slideEl.classList.toggle('active', idx === index);
                // Update background image
                slideEl.style.backgroundImage = `url('${slide.image}')`;
            });

            // Update content after fade
            setTimeout(() => {
                heroTitle.textContent = slide.title;
                heroSubtitle.textContent = slide.subtitle;
                heroLearnMore.href = slide.link;
                heroContent.classList.remove('fade-out');
            }, 300);

            // Update indicators
            indicators.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === index);
            });
        };

        // Next slide
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlide(currentIndex);
            resetAutoPlay();
        };

        // Previous slide
        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlide(currentIndex);
            resetAutoPlay();
        };

        // Auto-play slides every 3 seconds
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                nextSlide();
            }, 3000);
        };

        // Reset auto-play timer
        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Indicator clicks
        indicators.forEach((indicator) => {
            indicator.addEventListener('click', () => {
                currentIndex = parseInt(indicator.dataset.index);
                updateSlide(currentIndex);
                resetAutoPlay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        // Start auto-play
        startAutoPlay();
    };

    // Initialize hero slider when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroSlider);
    } else {
        initHeroSlider();
    }


    // ===========================
    console.log('%cFrontend.Club', 'font-size: 24px; font-weight: bold; color: #0066CC;');
    console.log('%cBuilt with ❤️ using Bootstrap 5 & Vanilla JS', 'font-size: 12px; color: #6B7280;');

})();
