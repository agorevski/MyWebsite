/**
 * Modern JavaScript with ES6+ features
 * Vanilla JS replacement for jQuery-based custom.js
 */
'use strict';

const App = {
    init() {
        this.initNav();
        this.initSmoothScroll();
        this.initScrollToTop();
        this.initDarkMode();
        this.initLazySections();
    },

    initLazySections() {
        const lazySections = document.querySelectorAll('.lazy-section');
        if (!lazySections.length) return;

        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            lazySections.forEach(section => sectionObserver.observe(section));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazySections.forEach(section => section.classList.add('is-visible'));
        }
    },

    initNav() {
        const toggleNormal = document.querySelector('div.toggle-normal');
        const menuToggle = document.getElementById('menuToggle');
        const theMenu = document.getElementById('theMenu');
        const menuBackdrop = document.getElementById('menuBackdrop');
        const body = document.body;

        const bars = {
            top: document.querySelector('i.top-bar'),
            middle: document.querySelector('i.middle-bar'),
            bottom: document.querySelector('i.bottom-bar')
        };

        const toggleBars = (add = true) => {
            const method = add ? 'toggle' : 'remove';
            bars.top?.classList[method]('top-transform');
            bars.middle?.classList[method]('middle-transform');
            bars.bottom?.classList[method]('bottom-transform');
        };

        const closeMenu = () => {
            theMenu?.classList.remove('menu-open');
            menuToggle?.classList.remove('active');
            menuBackdrop?.classList.remove('active');
            body.classList.remove('body-push-toright');
            toggleBars(false);
            menuToggle?.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
            theMenu?.classList.add('menu-open');
            menuToggle?.classList.add('active');
            menuBackdrop?.classList.add('active');
            body.classList.add('body-push-toright');
            menuToggle?.setAttribute('aria-expanded', 'true');
        };

        document.querySelectorAll('.section, div#menu-options a').forEach(el => {
            el.addEventListener('click', closeMenu);
        });

        // Close menu when clicking backdrop
        menuBackdrop?.addEventListener('click', closeMenu);

        menuToggle?.addEventListener('click', () => {
            const isOpen = theMenu?.classList.contains('menu-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
            toggleBars();
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && theMenu?.classList.contains('menu-open')) {
                closeMenu();
                toggleBars(false);
            }
        });
    },

    initSmoothScroll() {
        const containers = document.querySelectorAll('div#menu-options, div#about-btn');
        
        containers.forEach(container => {
            container.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    const hash = href.substring(href.indexOf('#'));
                    
                    if (location.pathname.replace(/^\//, '') === anchor.pathname.replace(/^\//, '') &&
                        location.hostname === anchor.hostname) {
                        
                        const target = document.querySelector(hash) || 
                                      document.querySelector(`[name="${hash.slice(1)}"]`);
                        
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            });
        });
    },

    initScrollToTop() {
        const scrollUpBtn = document.getElementById('scrollup');
        
        const handleScroll = () => {
            if (!scrollUpBtn) return;
            
            if (window.scrollY >= 50) {
                scrollUpBtn.classList.add('animated', 'flipInY');
                scrollUpBtn.style.display = 'block';
                scrollUpBtn.style.opacity = '1';
            } else {
                scrollUpBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY < 50) {
                        scrollUpBtn.style.display = 'none';
                    }
                }, 200);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        scrollUpBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    initDarkMode() {
        const toggle = document.getElementById('dark-mode-toggle');
        const root = document.documentElement;
        
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply saved theme or let system preference take effect
        if (savedTheme) {
            root.setAttribute('data-theme', savedTheme);
        }
        
        // Toggle dark mode
        toggle?.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            let newTheme;
            
            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
            } else {
                // No explicit theme set, toggle based on system preference
                newTheme = systemPrefersDark ? 'light' : 'dark';
            }
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if user hasn't set a manual preference
            if (!localStorage.getItem('theme')) {
                // The CSS handles this automatically, no JS needed
            }
        });
    },

    initScrollReveal() {
        if (typeof ScrollReveal === 'undefined') return;

        const sr = ScrollReveal({ reset: false });

        const commonCards = [
            '#map-card', '.interest-icon-even', '.interest-icon',
            '.timeline-dot', '.timeline-content', '#interest-card',
            '#contact-card', '.section-title img'
        ].join(',');

        sr.reveal(commonCards, { duration: 1100 });
        sr.reveal('#about-card, .map-label', { duration: 1400, delay: 500 });
        sr.reveal('#v-card-holder', { duration: 1400, distance: '150px' });
    }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => App.init());

// Initialize ScrollReveal on load
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 500);
    }
    App.initScrollReveal();
});