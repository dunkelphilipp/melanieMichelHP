/* ==========================================================================
   Melanie Michel Fotografie — Hochzeiten
   Eigenständiges Skript für die Hochzeits-Ansicht.
   Bewusst getrennt von js/app.js, das auf das DOM der Hauptseite
   (Menü-Overlay, Hero-Sticky, Karten) ausgelegt ist.
   ========================================================================== */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==============================================
    // Eigener Cursor (nur bei präzisem Zeigegerät)
    // ==============================================
    (function initCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, input, textarea, summary, .frame').forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('big'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
        });
    })();

    // ==============================================
    // Mobiles Menü
    // ==============================================
    (function initMobileNav() {
        const burger = document.querySelector('.nav-burger');
        const panel = document.getElementById('nav-mobile');
        if (!burger || !panel) return;

        function close() {
            panel.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
        }

        burger.addEventListener('click', () => {
            const isOpen = panel.classList.toggle('is-open');
            burger.setAttribute('aria-expanded', String(isOpen));
        });

        panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    })();

    // ==============================================
    // FAQ — jeweils nur ein Eintrag offen
    // ==============================================
    (function initAccordion() {
        const items = document.querySelectorAll('.faq-grid details');
        if (!items.length) return;

        items.forEach((d) => {
            d.addEventListener('toggle', () => {
                if (!d.open) return;
                items.forEach((other) => {
                    if (other !== d) other.open = false;
                });
            });
        });
    })();

    // ==============================================
    // Lightbox für den Kontaktbogen
    // ==============================================
    (function initLightbox() {
        const triggers = Array.from(document.querySelectorAll('.sheet .frame-img[data-full]'));
        const dlg = document.getElementById('lightbox');
        if (!triggers.length || !dlg || typeof dlg.showModal !== 'function') return;

        const dlgImg = dlg.querySelector('.lightbox__img');
        const counter = dlg.querySelector('.lightbox__counter');
        const cursorEl = document.getElementById('cursor');
        const closeBtn = dlg.querySelector('.lightbox__close');
        const prevBtn = dlg.querySelector('.lightbox__nav--prev');
        const nextBtn = dlg.querySelector('.lightbox__nav--next');

        // Der Alt-Text wird erst beim Anzeigen gelesen, nicht hier zwischen-
        // gespeichert: Bei einem Sprachwechsel waere eine Kopie sonst veraltet.
        const slides = triggers.map((btn) => ({
            full: btn.getAttribute('data-full'),
            img: btn.querySelector('img')
        }));

        let index = 0;
        let lastFocused = null;

        function show(i) {
            index = (i + slides.length) % slides.length;
            const slide = slides[index];
            dlgImg.src = slide.full;
            dlgImg.alt = slide.img ? slide.img.alt : '';
            if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
        }

        function open(i) {
            lastFocused = document.activeElement;
            show(i);
            dlg.showModal();

            // showModal() hebt den Dialog in die Top-Layer. Die zeichnet über
            // allem anderen, unabhängig von z-index — der eigene Cursor bliebe
            // also darunter verborgen. Deshalb wandert er für die Dauer der
            // Vollbildansicht in den Dialog hinein.
            if (cursorEl) {
                dlg.appendChild(cursorEl);
                cursorEl.classList.add('in-lightbox');
            }
        }

        function close() {
            dlg.close();
        }

        triggers.forEach((btn, i) => btn.addEventListener('click', () => open(i)));

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (prevBtn) prevBtn.addEventListener('click', () => show(index - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => show(index + 1));

        dlg.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                show(index - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                show(index + 1);
            }
        });

        // Klick auf den Hintergrund schliesst
        dlg.addEventListener('click', (e) => {
            if (e.target === dlg) close();
        });

        // Fokus zurück auf das auslösende Bild
        dlg.addEventListener('close', () => {
            dlgImg.removeAttribute('src');

            // Cursor zurück in den normalen Seitenfluss
            if (cursorEl) {
                cursorEl.classList.remove('in-lightbox');
                document.body.appendChild(cursorEl);
            }

            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        });

        // Wischen auf Touch-Geräten
        let touchStartX = null;
        dlg.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        dlg.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(delta) > 50) show(delta > 0 ? index - 1 : index + 1);
            touchStartX = null;
        }, { passive: true });
    })();

    // ==============================================
    // Einblenden beim Scrollen
    // ==============================================
    (function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

        items.forEach((el) => observer.observe(el));
    })();

    // ==============================================
    // Anfrageformular
    // GitHub Pages ist statisch — es gibt kein Backend, das die Anfrage
    // annehmen könnte. Das Formular baut deshalb eine vorbereitete E-Mail
    // im Mailprogramm der Besucherin. So geht keine Anfrage verloren.
    // ==============================================
    (function initEnquiryForm() {
        const form = document.getElementById('enquiry-form');
        if (!form) return;

        const status = document.getElementById('form-status');
        const recipient = form.getAttribute('data-recipient');
        if (!recipient) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const value = (name) => {
                const field = form.elements[name];
                return field && field.value ? field.value.trim() : '';
            };

            const names = value('names');
            const email = value('email');
            const date = value('date');
            const place = value('place');
            const message = value('message');

            // Betreff und Text in der aktiven Sprache
            const t = (key, fallback) => (window.i18n ? window.i18n.t(key) : '') || fallback;

            const subject = t('mail.subject', 'Hochzeitsanfrage') + (date ? ' — ' + date : '');
            const body = [
                t('mail.names', 'Namen') + ': ' + names,
                t('mail.email', 'E-Mail') + ': ' + email,
                t('mail.date', 'Datum') + ': ' + (date || '—'),
                t('mail.place', 'Ort') + ': ' + (place || '—'),
                '',
                t('mail.message', 'Nachricht') + ':',
                message || '—'
            ].join('\n');

            window.location.href = recipient +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            if (status) {
                status.hidden = false;
                status.textContent = t('form.status',
                    'Dein Mailprogramm öffnet sich mit der vorbereiteten Anfrage. ' +
                    'Falls nicht, schreib mir direkt an ') + recipient.replace('mailto:', '') + '.';
            }
        });
    })();

    // ==============================================
    // Cookie-Hinweis
    // Nutzt denselben Cookie wie die Hauptseite (Pfad /), damit eine
    // bereits getroffene Entscheidung hier nicht erneut erfragt wird.
    // ==============================================
    (function initCookieConsent() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;

        const acceptBtn = document.getElementById('cookieAccept');
        const declineBtn = document.getElementById('cookieDecline');
        const COOKIE_NAME = 'cookie_consent';
        const COOKIE_EXPIRY_DAYS = 365;

        function getCookie(name) {
            const value = '; ' + document.cookie;
            const parts = value.split('; ' + name + '=');
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        function setCookie(name, val, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = name + '=' + val + ';expires=' + date.toUTCString() + ';path=/;SameSite=Strict';
        }

        function hide() {
            banner.classList.remove('is-visible');
            setTimeout(() => { banner.style.display = 'none'; }, 400);
        }

        if (getCookie(COOKIE_NAME)) {
            banner.style.display = 'none';
            return;
        }

        setTimeout(() => banner.classList.add('is-visible'), 500);

        if (acceptBtn) acceptBtn.addEventListener('click', () => {
            setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
            hide();
        });

        if (declineBtn) declineBtn.addEventListener('click', () => {
            setCookie(COOKIE_NAME, 'declined', COOKIE_EXPIRY_DAYS);
            hide();
        });
    })();
})();
