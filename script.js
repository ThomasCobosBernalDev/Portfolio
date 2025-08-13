// -------- Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id && id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// -------- Mobile menu toggle
const btn = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-menu');
if (btn && menu){
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// -------- Reveal-on-scroll
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

// -------- Dark mode toggle with persistence + dynamic label
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const label = toggle?.querySelector('.toggle-label');

  // helper to set UI text and aria
  function applyLabel(isDark){
    if (!label || !toggle) return;
    // show the CURRENT mode text
    label.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // initial state from storage or system
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = stored ? stored === 'dark' : prefersDark;

  if (dark) root.classList.add('theme-dark'); else root.classList.remove('theme-dark');
  applyLabel(dark);

  toggle?.addEventListener('click', ()=>{
    const isDark = root.classList.toggle('theme-dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyLabel(isDark);
  });
})();
