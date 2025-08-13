/***********************
 * Smooth scroll links *
 ***********************/
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

/************************
 * Mobile menu toggling *
 ************************/
const menuBtn  = document.querySelector('.menu-toggle');
const siteMenu = document.getElementById('site-menu');

function closeMenu() {
  if (!siteMenu) return;
  if (siteMenu.classList.contains('open')) {
    siteMenu.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }
}

if (menuBtn && siteMenu) {
  // open/close on button
  menuBtn.addEventListener('click', (e) => {
    const open = siteMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    e.stopPropagation();
  });

  // close when clicking a menu link
  siteMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // close when clicking outside the menu/toggle
  document.addEventListener('click', (e) => {
    const clickInsideMenu  = siteMenu.contains(e.target);
    const clickOnToggle    = menuBtn.contains(e.target);
    if (!clickInsideMenu && !clickOnToggle) closeMenu();
  });

  // close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/***************************************
 * Reveal-on-scroll (respects R.M.)     *
 ***************************************/
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
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
 * Dark Mode      *
 *****************
 * HTML expected:
 * <button id="theme-toggle" class="theme-toggle" aria-pressed="false">
 *   <span class="toggle-rail"><span class="toggle-thumb"></span></span>
 *   <span class="toggle-label">Dark Mode</span>
 * </button>
 *
 * CSS expected: rules scoped under .theme-dark (on <html>)
 */
(function () {
  const root   = document.documentElement;              // <html>
  const toggle = document.getElementById('theme-toggle');
  const label  = document.querySelector('.toggle-label');
  const STORAGE_KEY = 'theme'; // 'dark' | 'light'

  function setLabel(isDark){
    if (!label) return;
    label.textContent = isDark ? 'Dark Mode' : 'Light Mode'; // shows current mode
  }

  function applyTheme(theme, persist = true){
    const isDark = theme === 'dark';
    root.classList.toggle('theme-dark', isDark);
    if (toggle) {
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    setLabel(isDark);
    if (persist) localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  // Initial theme: localStorage -> system -> light
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored, false);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light', false);
  }

  // Toggle click
  toggle?.addEventListener('click', () => {
    const nowDark = !root.classList.contains('theme-dark');
    applyTheme(nowDark ? 'dark' : 'light', true);
  });

  // Follow system changes ONLY if user hasn't chosen manually
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  mq && (mq.addEventListener ? mq.addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
  }) : mq.addListener && mq.addListener(e => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
  }));
})();
