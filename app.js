const toggle = document.querySelector('#service-toggle');
const menu = document.querySelector('#service-menu');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));});
document.addEventListener('click',e=>{if(!e.target.closest('.services'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus();}});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activePage = null;
let routeAnimation = null;
reducedMotion.addEventListener('change', event => {
  if (event.matches) routeAnimation?.cancel();
});
function route() {
  const requested = location.hash.slice(1) || 'home';
  const target = ['home', 'about', 'food', 'fragrance'].includes(requested) ? requested : 'home';
  const page = document.getElementById(target);
  const changed = activePage !== null && activePage !== page;
  // Never queue transitions or delay navigation, even when links are clicked rapidly.
  routeAnimation?.cancel();
  document.querySelectorAll('.page').forEach(p => p.hidden = p !== page);
  document.querySelectorAll('[data-page]').forEach(a => {
    if (a.dataset.page === target) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  closeMenu();
  if (target === 'food' || target === 'fragrance') toggle.setAttribute('aria-current', 'true');
  else toggle.removeAttribute('aria-current');
  document.title = ({home:'Kasapink — Food & Fragrance', about:'About Us — Kasapink', food:'Kasapink Food', fragrance:'Kasapink Fragrance — TBA'})[target];
  if (location.hash) {
    const heading = page.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
    window.scrollTo(0, 0);
    document.querySelector('#site-content').scrollTop = 0;
  }
  // Animate content only: the header, background and contact button stay still.
  // No fill mode or inline styles: finishing/cancelling restores normal rendering.
  if (changed && !reducedMotion.matches && typeof page.animate === 'function') {
    routeAnimation = page.animate([
      {opacity:0, transform:'translateY(6px)'},
      {opacity:1, transform:'translateY(0px)'}
    ], {duration:220, easing:'cubic-bezier(0.22, 1, 0.36, 1)'});
  }
  activePage = page;
}
window.addEventListener('hashchange',route);route();
// Skip navigation without turning #main into an unknown application route.
document.querySelector('.skip').addEventListener('click',event=>{
  event.preventDefault();
  const main=document.querySelector('#main');
  main.tabIndex=-1;
  main.focus({preventScroll:true});
  window.scrollTo(0,0);
  document.querySelector('#site-content').scrollTop=0;
});
const dialog=document.querySelector('#contact-dialog');
document.querySelector('#whatsapp-toggle').addEventListener('click',()=>dialog.showModal());
document.querySelector('#contact-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const name=f.elements.name.value.trim();const phone=f.elements.phone.value.trim();const message=f.elements.message.value.trim();if(!name||!phone||!message){return;}const text=`Halo Kasapink,\n\nNama: ${name}\nNomor Telepon: ${phone}\nPesan: ${message}`;window.open('https://wa.me/6287884363963?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');});
