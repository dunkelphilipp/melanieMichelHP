/**
 * Melanie Michel Photography - Main Application
 * Handles scroll-driven animations and interactive features
 */

// ==============================================
// Mobile Menu
// ==============================================
(function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    const portfolioToggle = document.querySelector('.menu-item--toggle');
    const submenu = document.querySelector('.menu-submenu');
    const submenuItems = document.querySelectorAll('.menu-submenu__item');

    if (!menuToggle || !menuOverlay) return;

    // Close menu function
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        menuOverlay.classList.remove('is-open');

        // Also close submenu
        if (portfolioToggle && submenu) {
            portfolioToggle.setAttribute('aria-expanded', 'false');
            submenu.classList.remove('is-open');
        }
    }

    // Toggle main menu
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('is-active');
        menuOverlay.classList.toggle('is-open');
    });

    // Toggle portfolio submenu
    if (portfolioToggle && submenu) {
        portfolioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = portfolioToggle.getAttribute('aria-expanded') === 'true';
            portfolioToggle.setAttribute('aria-expanded', !isExpanded);
            submenu.classList.toggle('is-open');
        });
    }

    // Handle main menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Skip if it's the portfolio toggle button
            if (item.classList.contains('menu-item--toggle')) return;

            closeMenu();

            // Check if clicking "Home" link
            const href = item.getAttribute('href');
            if (href === '#hero') {
                e.preventDefault();

                // Scroll to top first
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Reset hero animations after scroll
                setTimeout(() => {
                    const root = document.documentElement;
                    const hero = document.getElementById('hero');

                    root.style.setProperty('--heroProgress', '0');
                    root.style.setProperty('--aboutTheme', '0');
                    root.style.setProperty('--revealProgress', '0');
                    root.style.setProperty('--cardProgress', '0');

                    if (hero) {
                        hero.classList.remove('is-active');
                    }
                }, 100);
            }
        });
    });

    // Handle submenu item clicks
    submenuItems.forEach(item => {
        item.addEventListener('click', () => {
            closeMenu();
        });
    });
})();

// ==============================================
// Theme Detection & Updates
// ==============================================
(function initThemeDetection() {
    const body = document.body;
    const root = document.documentElement;

    // Define theme zones based on data-theme attributes
    const themeZones = [
        { selector: '#hero', theme: 'dark' },
        { selector: '#about', theme: 'accent' },
        { selector: '#offers', theme: 'accent' },
        { selector: '#discover', theme: 'dark' },
        { selector: '#gallery', theme: 'accent' },
        { selector: '#ready', theme: 'accent' },
        { selector: '.footer', theme: 'dark' }
    ];

    function getCurrentTheme() {
        const scrollY = window.scrollY + window.innerHeight / 2; // Check middle of viewport

        for (const zone of themeZones) {
            const element = document.querySelector(zone.selector);
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;

            // Check if scroll position is within this zone
            if (scrollY >= elementTop && scrollY <= elementBottom) {
                return zone.theme;
            }
        }

        return 'dark'; // Default theme
    }

    function updateTheme() {
        const currentTheme = getCurrentTheme();

        // Update body data-theme
        body.setAttribute('data-theme', currentTheme);

        // Update CSS variable for smooth transitions
        const isAccent = currentTheme === 'accent' ? 1 : 0;
        root.style.setProperty('--currentTheme', isAccent);
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTheme();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Initialize
    updateTheme();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// ==============================================
// Scroll-Driven Animations
// ==============================================
(function initScrollAnimations() {
    const root = document.documentElement;
    const hero = document.getElementById('hero');
    const stage = document.querySelector('.hero-stage');
    const about = document.getElementById('about');
    const offers = document.getElementById('offers');

    if (!hero || !about || !stage || !offers) return;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    let ticking = false;

    function updateScrollProgress() {
        ticking = false;
        const vh = window.innerHeight || 1;
        const scrollTop = window.scrollY || window.pageYOffset;

        // Hero zoom/fade progress
        const stageRect = stage.getBoundingClientRect();
        const heroProgress = clamp01(-stageRect.top / vh);

        // reset scroll progress
        if (scrollTop < 10) {
            root.style.setProperty('--heroProgress', '0');
            root.style.setProperty('--aboutTheme', '0');
            root.style.setProperty('--revealProgress', '0');
            hero.classList.remove('is-active');
        } else {
            if (heroProgress > 0) {
                hero.classList.add('is-active');
            } else {
                hero.classList.remove('is-active');
            }
            root.style.setProperty('--heroProgress', heroProgress.toFixed(4));
        }

        // About theme transition (for content reveal)
        const aboutRect = about.getBoundingClientRect();
        const themeStart = vh * 0.8;
        const themeEnd = vh * 0.2;
        const aboutTheme = clamp01((themeStart - aboutRect.top) / (themeStart - themeEnd));

        root.style.setProperty('--aboutTheme', aboutTheme.toFixed(4));

        // About content reveal
        const revealStart = 0.4;
        const revealEnd = 0.9;
        const revealRaw = (aboutTheme - revealStart) / (revealEnd - revealStart);
        const revealProgress = clamp01(revealRaw);

        root.style.setProperty('--revealProgress', revealProgress.toFixed(4));

        // Offers cards scale/fade
        const offersRect = offers.getBoundingClientRect();
        const cardStart = vh * 0.7;
        const cardEnd = vh * 0.3;
        const cardProgress = clamp01((cardStart - offersRect.top) / (cardStart - cardEnd));

        root.style.setProperty('--cardProgress', cardProgress.toFixed(4));
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }

    // Initialize and attach listeners
    updateScrollProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// ==============================================
// Discover Section Animations
// ==============================================
(function initDiscoverAnimations() {
    const root = document.documentElement;
    const discoverSection = document.getElementById('discover');
    const discoverTitle = document.querySelector('.discover__title');
    const discoverImage = document.querySelector('.discover__image img');

    if (!discoverSection || !discoverTitle || !discoverImage) return;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    let ticking = false;
    let hasAnimated = false;

    function updateDiscoverAnimation() {
        ticking = false;
        const vh = window.innerHeight || 1;
        const rect = discoverSection.getBoundingClientRect();

        // Color transition: starts when section enters viewport
        // Progress from 0 to 1 as section moves into view
        const colorTransitionStart = vh * 1.2; // Start before section is visible
        const colorTransitionEnd = vh * 0.5; // End when section is half visible
        const colorProgress = clamp01((colorTransitionStart - rect.top) / (colorTransitionStart - colorTransitionEnd));

        root.style.setProperty('--discoverColorProgress', colorProgress.toFixed(4));

        // Content animations: trigger when section is well into viewport
        const animationTrigger = vh * 0.6; // Trigger when section top reaches 60% of viewport
        const shouldAnimate = rect.top < animationTrigger && rect.bottom > 0;

        if (shouldAnimate && !hasAnimated) {
            // Scrolling down - animate in
            discoverTitle.classList.add('is-visible');
            discoverImage.classList.add('is-visible');
            hasAnimated = true;
        } else if (!shouldAnimate && hasAnimated && rect.top > animationTrigger) {
            // Scrolling up - animate out
            discoverTitle.classList.remove('is-visible');
            discoverImage.classList.remove('is-visible');
            hasAnimated = false;
        }
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateDiscoverAnimation);
            ticking = true;
        }
    }

    // Initialize and attach listeners
    updateDiscoverAnimation();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// ==============================================
// Gallery TOC Scroll Animation
// ==============================================
(function initGalleryTocAnimation() {
    const root = document.documentElement;
    const gallerySection = document.getElementById('gallery');
    const galleryToc = document.querySelector('.gallery-toc');

    if (!gallerySection || !galleryToc) return;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    let ticking = false;

    function updateGalleryTocScale() {
        ticking = false;
        const vh = window.innerHeight || 1;
        const rect = galleryToc.getBoundingClientRect();

        // Scale progress: buttons grow as they enter the viewport
        // Start scaling when TOC is 100% down the viewport, finish at 60%
        const scaleStart = vh * 1.0; // Start scaling earlier
        const scaleEnd = vh * 0.6;   // Finish scaling faster (fully grown)
        const scaleProgress = clamp01((scaleStart - rect.top) / (scaleStart - scaleEnd));

        root.style.setProperty('--galleryTocProgress', scaleProgress.toFixed(4));
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateGalleryTocScale);
            ticking = true;
        }
    }

    // Initialize and attach listeners
    updateGalleryTocScale();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// ==============================================
// Gallery Items & Headings Animation
// ==============================================
(function initGalleryItemsAnimation() {
    const galleryHeadings = document.querySelectorAll('.gallery__heading');
    const galleryItems = document.querySelectorAll('.gallery__item');

    if (galleryHeadings.length === 0 && galleryItems.length === 0) return;

    // Use Intersection Observer for efficient animation triggering
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px', // Trigger slightly before entering viewport
        threshold: 0.1 // Trigger when 10% visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is entering viewport - animate in
                const delay = entry.target.dataset.index ? parseInt(entry.target.dataset.index) * 50 : 0;

                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
            } else {
                // Element is leaving viewport - animate out (remove class immediately)
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Observe all gallery headings
    galleryHeadings.forEach(heading => {
        observer.observe(heading);
    });

    // Observe all gallery items with stagger
    galleryItems.forEach((item, index) => {
        // Add index for stagger effect (modulo 12 to keep delays reasonable)
        item.dataset.index = index % 12;
        observer.observe(item);
    });
})();

// ==============================================
// CTA Section Scroll Animation
// ==============================================
(function initCtaAnimation() {
    const root = document.documentElement;
    const ctaSection = document.getElementById('ready');

    if (!ctaSection) return;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    let ticking = false;

    function updateCtaProgress() {
        ticking = false;
        const vh = window.innerHeight || 1;
        const rect = ctaSection.getBoundingClientRect();

        // Animation progress: slides in as section enters viewport
        // Start when section bottom is at viewport bottom, finish when section is centered
        const animationStart = vh * 0.8; // Start when section is 80% down
        const animationEnd = vh * 0.3;   // Finish when section is 30% down
        const ctaProgress = clamp01((animationStart - rect.top) / (animationStart - animationEnd));

        root.style.setProperty('--ctaProgress', ctaProgress.toFixed(4));
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateCtaProgress);
            ticking = true;
        }
    }

    // Initialize and attach listeners
    updateCtaProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// ==============================================
// Gallery Lightbox
// ==============================================
(function initLightbox() {
    const gridContainers = document.querySelectorAll('.gallery--complex-grid');
    const dlg = document.getElementById('lightbox');
    const dlgImg = dlg?.querySelector('.lightbox__img');
    const closeBtn = dlg?.querySelector('.lightbox__close');
    const prevBtn = dlg?.querySelector('.lightbox__nav--prev');
    const nextBtn = dlg?.querySelector('.lightbox__nav--next');

    if (!gridContainers.length || !dlg || !dlgImg) return;

    let currentImages = [];
    let currentIndex = 0;

    // Touch/swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    // Collect all images from galleries
    function collectImages() {
        currentImages = [];
        gridContainers.forEach(grid => {
            const images = grid.querySelectorAll('.gallery__item img');
            images.forEach(img => {
                currentImages.push({
                    src: img.currentSrc || img.src,
                    full: img.getAttribute('data-full') || img.currentSrc || img.src,
                    alt: img.alt || ''
                });
            });
        });
    }

    // Show image at specific index
    function showImage(index) {
        if (index < 0 || index >= currentImages.length) return;
        currentIndex = index;
        // Use full-resolution image if available, otherwise fall back to thumbnail
        const fullSrc = currentImages[index].full || currentImages[index].src;
        dlgImg.src = fullSrc;
        dlgImg.alt = currentImages[index].alt;

        // Update navigation button visibility (desktop only)
        if (prevBtn) prevBtn.style.display = index > 0 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = index < currentImages.length - 1 ? 'flex' : 'none';
    }

    // Navigate to previous image
    function showPrevImage() {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    }

    // Navigate to next image
    function showNextImage() {
        if (currentIndex < currentImages.length - 1) {
            showImage(currentIndex + 1);
        }
    }

    // Handle swipe gestures
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const horizontalSwipe = Math.abs(touchEndX - touchStartX);
        const verticalSwipe = Math.abs(touchEndY - touchStartY);

        // Only process if horizontal swipe is more dominant than vertical
        if (horizontalSwipe > verticalSwipe && horizontalSwipe > swipeThreshold) {
            if (touchEndX < touchStartX) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPrevImage();
            }
        }
    }

    // Open lightbox on image click
    gridContainers.forEach(grid => {
        grid.addEventListener('click', (e) => {
            const img = e.target.closest('.gallery__item img');
            if (!img) return;

            collectImages();

            // Find the index of clicked image
            const clickedSrc = img.currentSrc || img.src;
            currentIndex = currentImages.findIndex(item => item.src === clickedSrc);

            if (currentIndex !== -1) {
                showImage(currentIndex);
                dlg.showModal();
            }
        });
    });

    // Close on button click
    closeBtn?.addEventListener('click', () => dlg.close());

    // Navigation buttons (desktop)
    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    // Touch event listeners for swipe
    dlg.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    dlg.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    // Close on backdrop click
    dlg.addEventListener('click', (e) => {
        if (e.target === dlg) {
            dlg.close();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!dlg.open) return;

        switch(e.key) {
            case 'Escape':
                dlg.close();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
})();

// ==============================================
// Progressive Image Loading for Thumbnails
// ==============================================
(function initProgressiveImages() {
    const galleryImages = document.querySelectorAll('.gallery__item img[data-full]');

    if (galleryImages.length === 0) return;

    // Track loaded images to avoid reloading
    const loadedImages = new Set();

    /**
     * Load full resolution image
     */
    function loadFullImage(img) {
        const fullSrc = img.getAttribute('data-full');

        // Skip if no data-full attribute
        if (!fullSrc) return;

        // Skip if already loaded or loading
        if (loadedImages.has(fullSrc)) return;
        loadedImages.add(fullSrc);

        // Create new image to preload
        const fullImage = new Image();

        fullImage.onload = () => {
            // Smooth transition from thumbnail to full image
            img.style.opacity = '0.7';

            setTimeout(() => {
                img.src = fullSrc;
                img.removeAttribute('data-full');
                img.style.opacity = '1';
            }, 100);
        };

        fullImage.onerror = () => {
            console.warn(`Failed to load full image: ${fullSrc}`);
            loadedImages.delete(fullSrc);
        };

        // Start loading
        fullImage.src = fullSrc;
    }

    /**
     * Use Intersection Observer for efficient loading
     */
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadFullImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        // Start loading 100px before image enters viewport
        rootMargin: '100px 0px',
        threshold: 0.01
    });

    // Observe all gallery images
    galleryImages.forEach(img => {
        // Add smooth transition
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });

    // Preload images on hover (desktop only)
    if (window.innerWidth > 768) {
        galleryImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                loadFullImage(img);
            }, { once: true });
        });
    }
})();

// ==============================================
// Cookie Consent Management
// ==============================================
(function initCookieConsent() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');

    if (!cookieBanner) return;

    const COOKIE_NAME = 'cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    /**
     * Get cookie value by name
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    /**
     * Set cookie with expiry
     */
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    }

    /**
     * Show cookie banner
     */
    function showBanner() {
        // Small delay for smooth appearance after page load
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 500);
    }

    /**
     * Hide cookie banner
     */
    function hideBanner() {
        cookieBanner.classList.remove('is-visible');

        // Remove from DOM after animation
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 400);
    }

    /**
     * Handle accept
     */
    function acceptCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();

        // Here you can enable optional cookies/tracking if needed in the future
        console.log('✅ Cookies accepted');
    }

    /**
     * Handle decline
     */
    function declineCookies() {
        setCookie(COOKIE_NAME, 'declined', COOKIE_EXPIRY_DAYS);
        hideBanner();

        console.log('❌ Cookies declined');
    }

    /**
     * Check if user has already made a choice
     */
    function checkConsent() {
        const consent = getCookie(COOKIE_NAME);

        if (!consent) {
            // No consent recorded, show banner
            showBanner();
        } else {
            // User already made a choice, keep banner hidden
            cookieBanner.style.display = 'none';

            if (consent === 'accepted') {
                console.log('✅ Cookies previously accepted');
                // Enable any optional cookies here
            } else {
                console.log('❌ Cookies previously declined');
            }
        }
    }

    // Event listeners
    acceptBtn.addEventListener('click', acceptCookies);
    declineBtn.addEventListener('click', declineCookies);

    // Initialize on page load
    checkConsent();
})();