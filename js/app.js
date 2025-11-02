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

        // *** NEW: If we're at the very top, ensure everything is reset ***
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
                    alt: img.alt || ''
                });
            });
        });
    }

    // Show image at specific index
    function showImage(index) {
        if (index < 0 || index >= currentImages.length) return;
        currentIndex = index;
        dlgImg.src = currentImages[index].src;
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