/* ==========================================================================
   Melanie Michel Fotografie — Sprachumschaltung (Deutsch / Englisch)
   Wiederverwendbar fuer alle Ansichten des Reworks.

   Aufbau
   - Diese Datei ist nur die Mechanik. Die Texte liegen in i18n.common.js
     (seitenuebergreifend) und je Ansicht in i18n.<ansicht>.js. Jede dieser
     Dateien schiebt ihr Woerterbuch in window.I18N_STRINGS.
   - Deutsch steht zusaetzlich direkt im HTML. Damit sehen deutsche
     Besucherinnen sofort den richtigen Text, ohne auf JavaScript zu warten,
     und Suchmaschinen finden die deutsche Fassung auch ohne Rendering.

   Auszeichnung im HTML
     data-i18n="key"              -> textContent
     data-i18n-html="key"         -> innerHTML (nur fuer eigene Strings mit <br>)
     data-i18n-placeholder="key"  -> placeholder
     data-i18n-aria-label="key"   -> aria-label
     data-i18n-alt="key"          -> alt
     data-i18n-content="key"      -> content (Meta-Tags)
     data-i18n-title="key"        -> title
   ========================================================================== */

(function () {
    'use strict';

    var SUPPORTED = ['de', 'en'];
    var DEFAULT_LANG = 'de';
    var STORAGE_KEY = 'mm_lang';
    var ATTRS = ['placeholder', 'aria-label', 'alt', 'content', 'title'];

    // Woerterbuecher der einzelnen Dateien zusammenfuehren
    var dict = { de: {}, en: {} };
    (window.I18N_STRINGS || []).forEach(function (part) {
        SUPPORTED.forEach(function (lang) {
            var strings = part[lang] || {};
            Object.keys(strings).forEach(function (key) {
                dict[lang][key] = strings[key];
            });
        });
    });

    // Die Sprache hat das Inline-Skript im <head> schon bestimmt, damit vor
    // dem ersten Zeichnen kein falscher Text aufblitzt.
    var current = window.__mmLang && SUPPORTED.indexOf(window.__mmLang) >= 0
        ? window.__mmLang
        : DEFAULT_LANG;

    function t(key) {
        if (dict[current] && dict[current][key] != null) return dict[current][key];
        if (dict[DEFAULT_LANG] && dict[DEFAULT_LANG][key] != null) return dict[DEFAULT_LANG][key];
        return '';
    }

    function store(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* Privatmodus */ }
    }

    /** Sprache in der Adresse mitfuehren, damit Links teilbar bleiben. */
    function syncUrl(lang) {
        if (!window.history || !window.history.replaceState) return;
        var url = new URL(window.location.href);
        if (lang === DEFAULT_LANG) {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        window.history.replaceState(null, '', url.pathname + (url.search || '') + url.hash);

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            var base = canonical.getAttribute('data-base') || canonical.getAttribute('href');
            canonical.setAttribute('data-base', base);
            canonical.setAttribute('href', lang === DEFAULT_LANG ? base : base + '?lang=' + lang);
        }
    }

    function applyTo(root) {
        root.querySelectorAll('[data-i18n]').forEach(function (el) {
            var value = t(el.getAttribute('data-i18n'));
            if (value) el.textContent = value;
        });

        // innerHTML nur fuer eigene, statische Strings (Zeilenumbrueche in Titeln)
        root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var value = t(el.getAttribute('data-i18n-html'));
            if (value) el.innerHTML = value;
        });

        ATTRS.forEach(function (attr) {
            root.querySelectorAll('[data-i18n-' + attr + ']').forEach(function (el) {
                var value = t(el.getAttribute('data-i18n-' + attr));
                if (value) el.setAttribute(attr, value);
            });
        });
    }

    function markSwitcher() {
        document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
            var isActive = btn.getAttribute('data-lang-switch') === current;
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    function apply(lang, options) {
        current = SUPPORTED.indexOf(lang) >= 0 ? lang : DEFAULT_LANG;
        document.documentElement.lang = current;
        document.documentElement.setAttribute('data-lang', current);

        applyTo(document);
        markSwitcher();

        var ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) ogLocale.setAttribute('content', current === 'de' ? 'de_CH' : 'en_GB');

        if (options && options.persist) {
            store(current);
            syncUrl(current);
        }

        // Inhalte freigeben (das Inline-Skript versteckt sie nur fuer Englisch)
        document.documentElement.classList.remove('i18n-pending');

        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: current } }));
    }

    function init() {
        apply(current, { persist: false });
        if (current !== DEFAULT_LANG) syncUrl(current);

        document.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-lang-switch]');
            if (!btn) return;
            e.preventDefault();
            var next = btn.getAttribute('data-lang-switch');
            if (next !== current) apply(next, { persist: true });
        });
    }

    window.i18n = {
        t: t,
        apply: apply,
        get lang() { return current; },
        supported: SUPPORTED
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
