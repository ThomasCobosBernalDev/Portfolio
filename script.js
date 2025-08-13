/* =========================
   Smooth scroll for hash links
   ========================= */
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

/* =========================
   Mobile menu toggle + outside click to close
   ========================= */
const burger = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-menu');

if (burger && menu) {
  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close when clicking outside menu/burger
  document.addEventListener('click', (e) => {
    const clickedOutside = !menu.contains(e.target) && !burger.contains(e.target);
    if (clickedOutside && menu.classList.contains('open')) closeMenu();
  });

  // Close when clicking a menu link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });
}

/* =========================
   Reveal-on-scroll (IntersectionObserver)
   ========================= */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
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

/* =========================
   Theme toggle (dark/light) with label + persistence
   ========================= */
const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (toggleBtn) {
    const isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    const label = toggleBtn.querySelector('.toggle-label');
    if (label) label.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  }
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* =========================
   Always load at top (clear hash)
   ========================= */
// Stop the browser from restoring scroll into a hash.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('pageshow', () => {
  if (window.location.hash) {
    // Replace the URL (drop the hash) and scroll to top
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }
});
