/* ==========================================================================
   Melanie Michel Fotografie — Landingpage
   Wenig zu tun: eigener Cursor und der Cookie-Hinweis. Die Choreografie
   der beiden Haelften macht das CSS allein.
   ========================================================================== */

(function () {
    'use strict';

    // ==============================================
    // Eigener Cursor (nur bei praezisem Zeigegeraet)
    // ==============================================
    (function initCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button').forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('big'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
        });
    })();

    // ==============================================
    // Cookie-Hinweis
    // Nutzt denselben Cookie wie die uebrigen Ansichten (Pfad /), damit
    // eine bereits getroffene Entscheidung nicht erneut erfragt wird.
    // Meist ist das hier die erste Seite, also auch die erste Frage.
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

        /* Der Hinweis liegt fest am unteren Rand und wuerde das „Eintreten"
           der beiden Haelften verdecken. Deshalb wird seine Hoehe als
           CSS-Variable weitergereicht, solange er steht. */
        function setBannerHeight(px) {
            document.documentElement.style.setProperty('--banner-h', px + 'px');
        }

        function measure() {
            if (banner.classList.contains('is-visible')) setBannerHeight(banner.offsetHeight);
        }

        function hide() {
            banner.classList.remove('is-visible');
            setBannerHeight(0);
            setTimeout(() => { banner.style.display = 'none'; }, 400);
        }

        if (getCookie(COOKIE_NAME)) {
            banner.style.display = 'none';
            return;
        }

        setTimeout(() => {
            banner.classList.add('is-visible');
            measure();
        }, 600);

        window.addEventListener('resize', measure);

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
