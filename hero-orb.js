// Supplied dimensional artwork + independent CSS light layers. No WebGL dependency.
export function initOrb(){
 const stage=document.querySelector('#hero-orb'),image=stage.querySelector('.orb-art');
 const constrained=(navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4||navigator.connection?.saveData;
 stage.classList.toggle('low-power',Boolean(constrained));
 stage.dataset.renderer='css';stage.dataset.quality=constrained?'economy':'standard';
 function fallback(){image.hidden=true;stage.classList.add('asset-fallback');stage.dataset.renderer='css-fallback'}
 image.addEventListener('error',fallback);if(image.complete&&image.naturalWidth===0)fallback();
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(([entry])=>stage.classList.toggle('orb-offscreen',!entry.isIntersecting),{rootMargin:'80px'});observer.observe(stage);window.addEventListener('pagehide',e=>{if(!e.persisted)observer.disconnect()});}
 document.querySelector('#orb-detail').addEventListener('click',e=>{const simple=stage.classList.toggle('low-power');e.currentTarget.setAttribute('aria-pressed',String(simple));e.currentTarget.textContent=simple?'Full atmosphere':'Quiet atmosphere';});
}
