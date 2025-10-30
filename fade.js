// fade.js — page transitions + link interception + stagger trigger
(function(){
  // Add fade-in class then add loaded (to trigger CSS)
  document.documentElement.classList.add('js');
  document.body.classList.add('fade-in');
  window.addEventListener('load', () => {
    // small delay so CSS transition triggers
    requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 30));
    // animate any [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach(el => setTimeout(()=>el.classList.add('animate'), 220));
  });

  // Intercept internal clicks and fade-out before navigating
  function shouldIntercept(el){
    if(!el) return false;
    const href = el.getAttribute && el.getAttribute('href');
    if(!href) return false;
    if(href.startsWith('http') && !href.includes(location.host)) return false;
    if(href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) return false;
    return true;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a, button');
    if(!a) return;
    if(a.tagName.toLowerCase()==='button' && a.dataset.noFade) return;
    if(shouldIntercept(a)){
      e.preventDefault();
      const href = a.getAttribute('href');
      document.body.classList.add('fade-out');
      setTimeout(()=> location.href = href, 360);
    }
  });

  // For programmatic navigation
  window.fadeNavigate = (href) => {
    document.body.classList.add('fade-out');
    setTimeout(()=> location.href = href, 360);
  };
})();
