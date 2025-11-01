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

    if (!menuToggle || !menuOverlay) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('is-active');
        menuOverlay.classList.toggle('is-open');
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('is-active');
            menuOverlay.classList.remove('is-open');
        });
    });
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

        // Hero zoom/fade progress
        const stageRect = stage.getBoundingClientRect();
        const heroProgress = clamp01(-stageRect.top / vh);

        if (heroProgress > 0) {
            hero.classList.add('is-active');
        } else {
            hero.classList.remove('is-active');
        }

        root.style.setProperty('--heroProgress', heroProgress.toFixed(4));

        // About theme transition (black → yellow)
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

    if (!gridContainers.length || !dlg || !dlgImg) return;

    // Open lightbox on image click
    gridContainers.forEach(grid => {
        grid.addEventListener('click', (e) => {
            const img = e.target.closest('.gallery__item img');
            if (!img) return;

            dlgImg.src = img.currentSrc || img.src;
            dlgImg.alt = img.alt || '';
            dlg.showModal();
        });
    });

    // Close on button click
    closeBtn?.addEventListener('click', () => dlg.close());

    // Close on backdrop click
    dlg.addEventListener('click', (e) => {
        const rect = dlgImg.getBoundingClientRect();
        const clickedOutside =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;

        if (clickedOutside) dlg.close();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dlg.open) {
            dlg.close();
        }
    });
})();