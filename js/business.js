/* ==========================================================================
   Melanie Michel Fotografie — Business, Events & Journalismus
   Eigenstaendiges Skript fuer die Business-Ansicht.

   Die Bildstrecken stehen als Daten in PROJECTS. Um eine Kategorie zu
   fuellen, die jetzt noch ein reservierter Platz ist, genuegt es, hier
   die Bilder einzutragen und in business.html den Platzhalter gegen eine
   Kachel zu tauschen (Anleitung steht dort als Kommentar).
   ========================================================================== */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const base = 'img/portfolio/';

    /* Bildstrecken je Kategorie.
       thumb wird im Archivraster nicht gebraucht — die Projektansicht zeigt
       die vollen Dateien; das Raster nutzt das Titelbild aus dem HTML.
       altKey verweist auf js/i18n.business.js, damit die Bildbeschreibungen
       der gewaehlten Sprache folgen. */
    const PROJECTS = {
        events: {
            titleKey: 'work.events.title',
            descKey: 'work.events.desc',
            images: [
                { src: base + 'event/eventGal/Event1.webp', altKey: 'ev.1' },
                { src: base + 'event/eventGal/Event2.webp', altKey: 'ev.2' },
                { src: base + 'event/eventGal/Event3.webp', altKey: 'ev.3' },
                { src: base + 'event/eventGal/Event4.webp', altKey: 'ev.4' },
                { src: base + 'event/eventGal/Event5.webp', altKey: 'ev.5' },
                { src: base + 'event/eventGal/Event6.webp', altKey: 'ev.6' }
            ]
        },
        portraits: {
            titleKey: 'work.portraits.title',
            descKey: 'work.portraits.desc',
            images: [
                { src: base + 'shooting/shootingGal/Shooting1.webp', altKey: 'po.1' },
                { src: base + 'shooting/shootingGal/Shooting2.webp', altKey: 'po.2' },
                { src: base + 'shooting/shootingGal/Shooting3.webp', altKey: 'po.3' },
                { src: base + 'shooting/shootingGal/Shooting4.webp', altKey: 'po.4' },
                { src: base + 'shooting/shootingGal/Shooting5.webp', altKey: 'po.5' },
                { src: base + 'shooting/shootingGal/Shooting6.webp', altKey: 'po.6' },
                { src: base + 'shooting/shootingGal/Shooting7.webp', altKey: 'po.7' },
                { src: base + 'shooting/shootingGal/Shooting8.webp', altKey: 'po.8' }
            ]
        }

        /* Noch ohne Bilder — sobald Aufnahmen vorliegen, hier ergaenzen:

        business: {
            titleKey: 'work.business.title',
            descKey: 'work.business.desc',
            images: [
                { src: base + 'business/businessGal/Business1.webp', altKey: 'bu.1' }
            ]
        },
        journalism: {
            titleKey: 'work.journalism.title',
            descKey: 'work.journalism.desc',
            images: [
                { src: base + 'journalism/journalismGal/Journalism1.webp', altKey: 'jo.1' }
            ]
        }
        */
    };

    /** Uebersetzung mit Rueckfallwert, falls i18n noch nicht bereit ist. */
    function t(key, fallback) {
        const value = window.i18n ? window.i18n.t(key) : '';
        return value || fallback || '';
    }

    // ==============================================
    // Eigener Cursor (nur bei praezisem Zeigegeraet)
    // ==============================================
    const cursorEl = document.getElementById('cursor');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    function bindCursorGrow(root) {
        if (!cursorEl || !finePointer) return;
        root.querySelectorAll('a, button, input, textarea, select, summary, .tile').forEach((el) => {
            el.addEventListener('mouseenter', () => cursorEl.classList.add('big'));
            el.addEventListener('mouseleave', () => cursorEl.classList.remove('big'));
        });
    }

    if (cursorEl && finePointer) {
        window.addEventListener('mousemove', (e) => {
            cursorEl.style.left = e.clientX + 'px';
            cursorEl.style.top = e.clientY + 'px';
        });
        bindCursorGrow(document);
    }

    // ==============================================
    // Navigationsleiste: ab etwas Scrollweg als Glasflaeche
    // ==============================================
    (function initStickyNav() {
        const nav = document.querySelector('.site-nav');
        if (!nav) return;

        function update() {
            nav.classList.toggle('is-stuck', window.scrollY > 100);
        }

        update();
        window.addEventListener('scroll', update, { passive: true });
    })();

    // ==============================================
    // Mobiles Menue
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

        panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    })();

    // ==============================================
    // FAQ — jeweils nur ein Eintrag offen
    // ==============================================
    (function initAccordion() {
        const items = document.querySelectorAll('#faq details');
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
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        items.forEach((el) => observer.observe(el));
    })();

    // ==============================================
    // Projektansicht
    // Als <dialog> statt als eigenes Overlay: Fokusfalle und
    // Escape-Taste kommen damit vom Browser.
    // ==============================================
    (function initProjects() {
        const dlg = document.getElementById('project');
        if (!dlg || typeof dlg.showModal !== 'function') return;

        const head = dlg.querySelector('.project__head');
        const titleEl = dlg.querySelector('.project__head h2');
        const descEl = dlg.querySelector('.project__head p');
        const grid = dlg.querySelector('.project__grid');
        const closeBtn = dlg.querySelector('.project__close');

        // Spaltenmuster, das sich wiederholt — erzeugt die versetzte Anordnung
        const layouts = ['a', 'b', 'c', 'd', 'e'];
        let lastFocused = null;
        let imageObserver = null;
        let currentId = null;

        function build(project) {
            titleEl.textContent = t(project.titleKey, '');
            descEl.textContent = t(project.descKey, '');
            grid.textContent = '';

            project.images.forEach((image, i) => {
                const item = document.createElement('div');
                item.className = 'project__item project__item--' + layouts[i % layouts.length];

                const figure = document.createElement('figure');
                figure.className = 'project__media';
                figure.style.margin = '0';

                const img = document.createElement('img');
                img.src = image.src;
                img.alt = t(image.altKey, '');
                img.loading = 'lazy';
                img.decoding = 'async';

                figure.appendChild(img);
                item.appendChild(figure);
                grid.appendChild(item);
            });
        }

        function revealImages() {
            const images = grid.querySelectorAll('img');

            if (prefersReducedMotion || !('IntersectionObserver' in window)) {
                images.forEach((img) => img.classList.add('is-visible'));
                return;
            }

            imageObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -15% 0px' });

            images.forEach((img) => imageObserver.observe(img));
        }

        function open(id) {
            const project = PROJECTS[id];
            if (!project || !project.images.length) return;

            currentId = id;
            lastFocused = document.activeElement;
            build(project);

            dlg.showModal();
            dlg.scrollTop = 0;

            // Erst nach dem Oeffnen die Klasse setzen, sonst gibt es keinen
            // Zustandswechsel, den der Browser animieren koennte.
            requestAnimationFrame(() => dlg.classList.add('is-open'));

            // Der Dialog liegt in der Top-Layer und wuerde den eigenen
            // Cursor verdecken; er wandert deshalb mit hinein.
            if (cursorEl) dlg.appendChild(cursorEl);

            bindCursorGrow(grid);
            setTimeout(revealImages, prefersReducedMotion ? 0 : 500);
        }

        function close() {
            dlg.classList.remove('is-open');

            if (prefersReducedMotion) {
                dlg.close();
                return;
            }

            // Erst schliessen, wenn die Bewegung nach unten gelaufen ist
            const done = (e) => {
                if (e.target !== dlg || e.propertyName !== 'transform') return;
                dlg.removeEventListener('transitionend', done);
                dlg.close();
            };
            dlg.addEventListener('transitionend', done);
            setTimeout(() => { if (dlg.open) dlg.close(); }, 800);
        }

        // Escape loest beim <dialog> cancel aus — hier abfangen, damit die
        // Ansicht nach unten herausfaehrt statt zu verschwinden.
        dlg.addEventListener('cancel', (e) => {
            e.preventDefault();
            close();
        });

        dlg.addEventListener('close', () => {
            if (imageObserver) {
                imageObserver.disconnect();
                imageObserver = null;
            }
            grid.textContent = '';
            currentId = null;

            if (cursorEl) document.body.appendChild(cursorEl);
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        });

        if (closeBtn) closeBtn.addEventListener('click', close);

        document.querySelectorAll('[data-project]').forEach((btn) => {
            btn.addEventListener('click', () => open(btn.getAttribute('data-project')));
        });

        // Bei einem Sprachwechsel Titel, Text und Bildbeschreibungen
        // der offenen Ansicht nachziehen.
        document.addEventListener('languagechange', () => {
            if (!currentId || !dlg.open) return;
            const project = PROJECTS[currentId];
            titleEl.textContent = t(project.titleKey, '');
            descEl.textContent = t(project.descKey, '');
            grid.querySelectorAll('img').forEach((img, i) => {
                const image = project.images[i];
                if (image) img.alt = t(image.altKey, '');
            });
        });

        // Anzahl der Bilder je Kachel ausweisen
        document.querySelectorAll('[data-project]').forEach((btn) => {
            const project = PROJECTS[btn.getAttribute('data-project')];
            const slot = btn.querySelector('[data-count]');
            if (project && slot) slot.textContent = String(project.images.length);
        });

        if (head) head.setAttribute('tabindex', '-1');
    })();

    // ==============================================
    // Anfrageformular
    // GitHub Pages ist statisch — es gibt kein Backend, das die Anfrage
    // annehmen koennte. Das Formular baut deshalb eine vorbereitete
    // E-Mail im Mailprogramm. So geht keine Anfrage verloren.
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

            const scopeField = form.elements['scope'];
            const scopeLabel = scopeField && scopeField.selectedIndex >= 0
                ? scopeField.options[scopeField.selectedIndex].text
                : '';

            const subject = t('mail.subject', 'Anfrage') +
                (scopeLabel ? ' — ' + scopeLabel : '');

            const body = [
                t('mail.name', 'Name') + ': ' + value('name'),
                t('mail.email', 'E-Mail') + ': ' + value('email'),
                t('mail.scope', 'Bereich') + ': ' + (scopeLabel || '—'),
                '',
                t('mail.message', 'Nachricht') + ':',
                value('message') || '—'
            ].join('\n');

            window.location.href = recipient +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            if (status) {
                status.hidden = false;
                status.textContent = t('form.status',
                    'Dein Mailprogramm oeffnet sich mit der vorbereiteten Anfrage. ' +
                    'Falls nicht, schreib mir direkt an ') + recipient.replace('mailto:', '') + '.';
            }
        });
    })();

    // ==============================================
    // Cookie-Hinweis
    // Nutzt denselben Cookie wie die uebrigen Ansichten (Pfad /), damit
    // eine bereits getroffene Entscheidung nicht erneut erfragt wird.
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
