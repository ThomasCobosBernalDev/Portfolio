// ============ DARK/LIGHT THEME ============
// Persist in localStorage and reflect in button label + aria state
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const label = btn ? btn.querySelector('.toggle-label') : null;

  // Determine initial theme: saved -> system -> light
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  function updateButtonState(theme) {
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    if (label) label.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  }
  updateButtonState(initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateButtonState(next);
    });
  }
})();

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id && id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// ============ MOBILE MENU ============
const menuBtn = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-menu');

if (menuBtn && menu){
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Click outside to close (only when open)
  document.addEventListener('click', (e) => {
    const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
    if (!isClickInside && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============ REVEAL-ON-SCROLL ============
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.2});

  document.querySelectorAll('[data-reveal]').forEach((el, i)=>{
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i*60, 300)}ms`;
    obs.observe(el);
  });
}
