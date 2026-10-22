// One motion policy shared by CSS animation and the hero. No persisted surprise pause.
const query=matchMedia('(prefers-reduced-motion: reduce)');let manual=false;
export function motionSnapshot(){return {paused:manual||query.matches||document.hidden,reduced:query.matches,manual};}
export function initMotion(){
 const button=document.querySelector('#motion');
 function apply(){const state=motionSnapshot();document.documentElement.classList.toggle('motion-paused',state.paused);button.disabled=state.reduced;button.textContent=state.reduced?'Reduced motion':manual?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(state.paused));document.querySelector('#motion-status').textContent=state.reduced?'Still, by your preference.':manual?'A moment of stillness.':'Ambient motion';window.dispatchEvent(new CustomEvent('motionchange',{detail:state}));}
 button.addEventListener('click',()=>{manual=!manual;apply()});query.addEventListener('change',apply);document.addEventListener('visibilitychange',apply);window.addEventListener('pageshow',apply);apply();
 // Content is visible by default; only add reveal animation when supported.
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}},{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));window.addEventListener('pagehide',e=>{if(!e.persisted)observer.disconnect()});}
}
