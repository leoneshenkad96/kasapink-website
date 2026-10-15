const toggle = document.querySelector('#service-toggle');
const menu = document.querySelector('#service-menu');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));});
document.addEventListener('click',e=>{if(!e.target.closest('.services'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus();}});
function route(){const requested=location.hash.slice(1)||'home';const target=['home','about','food','fragrance'].includes(requested)?requested:'home';document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==target);document.querySelectorAll('[data-page]').forEach(a=>{if(a.dataset.page===target)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});closeMenu();document.title=({home:'Kasapink — Food & Fragrance',about:'About Us — Kasapink',food:'Kasapink Food',fragrance:'Kasapink Fragrance — TBA'})[target];if(location.hash){const heading=document.querySelector('#'+target+' h1');heading.tabIndex=-1;heading.focus({preventScroll:true});window.scrollTo(0,0);}}
window.addEventListener('hashchange',route);route();
const dialog=document.querySelector('#contact-dialog');
document.querySelector('#whatsapp-toggle').addEventListener('click',()=>dialog.showModal());
document.querySelector('#contact-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const name=f.elements.name.value.trim();const phone=f.elements.phone.value.trim();const message=f.elements.message.value.trim();if(!name||!phone||!message){return;}const text=`Halo Kasapink,\n\nNama: ${name}\nNomor Telepon: ${phone}\nPesan: ${message}`;window.open('https://wa.me/6287884363963?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');});
