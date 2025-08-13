/***********************
 * Smooth scroll links *
 ***********************/
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});


/************************
 * Mobile menu toggling *
 ************************/
const menuBtn  = document.querySelector('.menu-toggle');
const siteMenu = document.getElementById('site-menu');

if (menuBtn && siteMenu) {
  menuBtn.addEventListener('click', () => {
    const open = siteMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}


/***************************************
 * Reveal-on-scroll (respects R.M.)     *
 ***************************************/
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
    obs.observe(el);
  });
}


/*****************
 * Dark Mode 💡🌙 *
 *****************
 * This script assumes your HTML uses:
 *  - one or more checkbox inputs with class "dark-toggle"
 *  - optional label text spans with class "dark-label"
 *  - optional emoji spans with class "dark-emoji"
 * CSS should style body.dark-mode { ... } using CSS variables.
 */
(function () {
  const STORAGE_KEY = 'theme';

  const toggles = () => Array.from(document.querySelectorAll('.dark-toggle'));
  const labels  = () => Array.from(document.querySelectorAll('.dark-label'));
  const emojis  = () => Array.from(document.querySelectorAll('.dark-emoji'));

  const isDark = () => document.body.classList.contains('dark-mode');

  function updateControls(dark) {
    // sync all switches
    toggles().forEach(t => { if (t.type === 'checkbox') t.checked = dark; });
    // update any “Dark Mode / Light Mode” labels
    labels().forEach(l => { l.textContent = dark ? 'Light Mode' : 'Dark Mode'; });
    // optional emoji swap
    emojis().forEach(e => { e.textContent = dark ? '🌙' : '☀️'; });
  }

  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.body.classList.toggle('dark-mode', dark);
    updateControls(dark);
  }

  // Initial theme: localStorage -> system preference -> light
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
  } else {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(systemDark ? 'dark' : 'light');
  }

  // Listen to all toggle switches (desktop & mobile)
  toggles().forEach(t => {
    t.addEventListener('change', () => {
      const newTheme = t.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  });

  // Keep theme in sync if the user changes OS setting while page is open
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  if ('addEventListener' in media) {
    media.addEventListener('change', e => {
      // Only auto-follow system if user hasn’t explicitly chosen a theme
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  } else if ('addListener' in media) {
    // Safari < 14
    media.addListener(e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
