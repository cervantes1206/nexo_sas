document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if(!toggle || !nav) return;

  function setOpen(isOpen){
    nav.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = isOpen ? 'ti ti-x' : 'ti ti-menu-2';
  }

  toggle.addEventListener('click', function(){
    setOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') setOpen(false);
  });
});
