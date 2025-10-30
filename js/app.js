/**
 * Scroll-driven variables for the sticky hero + about reveal.
 *
 * We compute three progress values (0..1):
 *  - heroProgress: how far the sticky HERO has been scrolled (controls zoom/fade)
 *  - aboutTheme:  how far we are into the ABOUT section (controls black→yellow fade)
 *  - revealProgress: content fly-in within ABOUT (bidirectional)
 *
 * The CSS consumes these variables to animate without expensive JS per-frame work.
 */
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuItems = document.querySelectorAll('.menu-item');

(function() {
    const root = document.documentElement;
    const hero = document.getElementById('hero');
    const stage = document.querySelector('.hero-stage'); // <- NEU
    const about = document.getElementById('about');

    // Menubar
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
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

    // Guard if elements are missing
    if (!hero || !about) return;

    // Helper: clamp to [0,1]
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    // Use rAF to avoid layout thrash during scroll
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }

    function update() {
        ticking = false;
        const vh = window.innerHeight || 1;

        // ----- HERO PROGRESS (0..1 während das STAGE-Element gescrollt wird)
        // Statt hero.getBoundingClientRect().top verwenden wir die .hero-stage:
        const stageRect = stage.getBoundingClientRect();
        const heroProgress = clamp01((-stageRect.top) / vh); // 0 → 1 über eine Viewport-Höhe

        if (heroProgress > 0) hero.classList.add('is-active');
        else hero.classList.remove('is-active');

        root.style.setProperty('--heroProgress', heroProgress.toFixed(4));

        // ----- ABOUT THEME (schwarz → gelb) wie gehabt
        const aboutRect = about.getBoundingClientRect();
        const start = vh * 0.8;
        const end   = vh * 0.2;
        const aboutTheme = clamp01((start - aboutRect.top) / (start - end));
        root.style.setProperty('--aboutTheme', aboutTheme.toFixed(4));

        // ----- ABOUT REVEAL (Text/Bild einfliegen) wie gehabt
        const revealStart = 0.4;
        const revealEnd   = 0.9;
        const revealRaw   = (aboutTheme - revealStart) / (revealEnd - revealStart);
        const revealProgress = clamp01(revealRaw);
        root.style.setProperty('--revealProgress', revealProgress.toFixed(4));

        // ----- PORTFOLIO CARDS (Vergrössern und Einblenden)
        const offersRect = offers.getBoundingClientRect();
        const cardStart = vh * 0.7; // Startet, wenn 70% des Viewports sichtbar sind
        const cardEnd   = vh * 0.3; // Endet, wenn 30% des Viewports sichtbar sind
        const cardProgress = clamp01((cardStart - offersRect.top) / (cardStart - cardEnd));
        root.style.setProperty('--cardProgress', cardProgress.toFixed(4));
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// One-pager Gallery Lightbox
(function () {
    const gridContainers = document.querySelectorAll('.gallery--grid');
    const dlg = document.getElementById('lightbox');
    const dlgImg = dlg?.querySelector('.lightbox__img');
    const closeBtn = dlg?.querySelector('.lightbox__close');
    if (!gridContainers.length || !dlg || !dlgImg) return;

    gridContainers.forEach(grid => {
        grid.addEventListener('click', (e) => {
            const img = e.target.closest('.gallery__item img');
            if (!img) return;
            dlgImg.src = img.currentSrc || img.src;
            dlgImg.alt = img.alt || '';
            dlg.showModal();
        });
    });

    closeBtn?.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => {
        const r = dlgImg.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) dlg.close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dlg.open) dlg.close(); });
})();
