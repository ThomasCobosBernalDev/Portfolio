/* ============ SMOOTH SCROLL FOR ANCHOR LINKS ============ */
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

/* ============ MOBILE MENU TOGGLE ============ */
const btn = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ============ REVEAL-ON-SCROLL (IntersectionObserver) ============ */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
    obs.observe(el);
  });
}

/* ============ THEME (LIGHT/DARK) TOGGLE ============ */
/*
  - Adds/removes data-theme="dark" on <html>
  - Respects system preference on first load
  - Persists user choice in localStorage
  - Updates toggle button aria-label
*/
const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme, persist = true) {
  const t = (theme === 'dark') ? 'dark' : 'light';
  root.setAttribute('data-theme', t);
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (persist) localStorage.setItem('theme', t);
}

// Initialize theme (user choice > system pref)
(function initTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored, false);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light', false);
    }
  } catch {
    // Fallback if localStorage is blocked
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light', false);
  }
})();

// Toggle click handler
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Follow system changes only if user hasn't chosen a theme yet
const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
if (mq && mq.addEventListener) {
  mq.addEventListener('change', e => {
    const stored = localStorage.getItem('theme');
    if (!stored) applyTheme(e.matches ? 'dark' : 'light', false);
  });
}

// Sync across tabs/windows
window.addEventListener('storage', (e) => {
  if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
    applyTheme(e.newValue, false);
  }
});
