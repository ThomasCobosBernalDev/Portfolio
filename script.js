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

// -------- Dark mode toggle with persistence
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  // initial state from storage or system
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = stored ? stored === 'dark' : prefersDark;

  if (dark) {
    root.classList.add('theme-dark');
    toggle?.setAttribute('aria-pressed','true');
  } else {
    root.classList.remove('theme-dark');
    toggle?.setAttribute('aria-pressed','false');
  }

  toggle?.addEventListener('click', ()=>{
    const on = root.classList.toggle('theme-dark');
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    localStorage.setItem('theme', on ? 'dark' : 'light');
  });
})();
