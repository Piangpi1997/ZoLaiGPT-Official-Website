export function initFaq(){
 for(const details of document.querySelectorAll('.faq-list details')){
  const sync=()=>details.querySelector('summary').setAttribute('aria-expanded',String(details.open));
  details.addEventListener('toggle',sync);sync();
 }
}
export function initGallery(){
 const gallery=document.getElementById('app-gallery');if(!gallery)return;
 const prev=document.getElementById('gallery-prev'),next=document.getElementById('gallery-next');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 function sync(){prev.disabled=gallery.scrollLeft<=2;next.disabled=gallery.scrollLeft>=gallery.scrollWidth-gallery.clientWidth-2;}
 function move(direction){gallery.scrollBy({left:direction*(gallery.querySelector('figure').getBoundingClientRect().width+parseFloat(getComputedStyle(gallery).gap)),behavior:reduced.matches?'instant':'smooth'});}
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 gallery.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
 gallery.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync,{passive:true});
 const observer='ResizeObserver'in window?new ResizeObserver(sync):null;observer?.observe(gallery);sync();
 window.addEventListener('pagehide',event=>{if(!event.persisted){observer?.disconnect();window.removeEventListener('resize',sync)}});
}
