/* Language switcher — English (default) / French.
 * Convention: any translatable element carries a `data-fr` attribute
 * whose value is the French version of its innerHTML. Elements without
 * `data-fr` are left as-is (this is intentional for names, quotes, code, etc.).
 * When editing English text, ALSO update the matching `data-fr` on the same element.
 */
(function () {
    const STORAGE_KEY = 'phuc-site-lang';
    const DEFAULT_LANG = 'en';

    const FLAG_GB = '<svg viewBox="0 0 60 30" aria-hidden="true"><clipPath id="lst"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><path d="M0,0v30h60v-30z" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#lst)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';
    const FLAG_FR = '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" x="0" fill="#0055A4"/><rect width="1" height="2" x="1" fill="#fff"/><rect width="1" height="2" x="2" fill="#EF4135"/></svg>';

    const LABELS = {
        en: { name: 'English', switchTo: 'Passer en français' },
        fr: { name: 'Français', switchTo: 'Switch to English' }
    };

    function getLang() {
        try {
            return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        } catch (e) { return DEFAULT_LANG; }
    }

    function saveLang(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }

    function applyLang(lang) {
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-fr]').forEach(el => {
            if (!el.hasAttribute('data-en')) {
                el.setAttribute('data-en', el.innerHTML);
            }
            const target = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
            if (target != null) el.innerHTML = target;
        });

        document.querySelectorAll('[data-fr-attr]').forEach(el => {
            // Format: data-fr-attr="attrName|French value;attrName2|French value2"
            const spec = el.getAttribute('data-fr-attr');
            if (!spec) return;
            spec.split(';').forEach(pair => {
                const [attr, frValue] = pair.split('|');
                if (!attr) return;
                const enKey = 'data-en-' + attr;
                if (!el.hasAttribute(enKey)) {
                    el.setAttribute(enKey, el.getAttribute(attr) || '');
                }
                const val = lang === 'fr' ? frValue : el.getAttribute(enKey);
                if (val != null) el.setAttribute(attr, val);
            });
        });

        document.querySelectorAll('[data-fr-title]').forEach(el => {
            if (!el.hasAttribute('data-en-title')) {
                el.setAttribute('data-en-title', el.getAttribute('title') || '');
            }
            const val = lang === 'fr' ? el.getAttribute('data-fr-title') : el.getAttribute('data-en-title');
            if (val != null) el.setAttribute('title', val);
        });
    }

    function updateButton(lang) {
        const btn = document.getElementById('lang-switch');
        if (!btn) return;
        // Show the flag of the OTHER language (what clicking will switch to).
        const other = lang === 'en' ? 'fr' : 'en';
        btn.innerHTML = other === 'fr' ? FLAG_FR : FLAG_GB;
        btn.setAttribute('title', LABELS[lang].switchTo);
        btn.setAttribute('aria-label', LABELS[lang].switchTo);
        btn.dataset.lang = lang;
    }

    function injectSwitcher() {
        if (document.getElementById('lang-switch')) return;
        const btn = document.createElement('button');
        btn.id = 'lang-switch';
        btn.type = 'button';
        btn.className = 'lang-switch';
        document.body.appendChild(btn);
        btn.addEventListener('click', () => {
            const next = getLang() === 'en' ? 'fr' : 'en';
            saveLang(next);
            applyLang(next);
            updateButton(next);
        });
    }

    function init() {
        injectSwitcher();
        const lang = getLang();
        applyLang(lang);
        updateButton(lang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
