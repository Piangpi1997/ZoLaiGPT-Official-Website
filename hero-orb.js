import {motionSnapshot} from './assets/js/animation.js';
// Progressive enhancement: keep the original artwork until the local WebGL module
// and texture are ready. Failure leaves an honest static, original-brand fallback.
export async function initOrb(){
 const stage=document.getElementById('hero-orb'),image=stage?.querySelector('.orb-art');
 if(!stage)return;
 const constrained=(navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4||navigator.connection?.saveData;
 stage.classList.toggle('low-power',Boolean(constrained));
 stage.dataset.renderer='static';stage.dataset.quality=constrained?'economy':'standard';
 const detail=document.getElementById('orb-detail');
 detail.setAttribute('aria-pressed',String(Boolean(constrained)));
 detail.textContent=constrained?'Full atmosphere':'Quiet atmosphere';
 let core=null,disposed=false;
 const fallback=()=>{stage.dataset.renderer='static';stage.classList.remove('webgl-ready');};
 image?.addEventListener('error',()=>{stage.classList.add('asset-fallback');if(image)image.hidden=true;});
 if(image?.complete&&!image.naturalWidth){stage.classList.add('asset-fallback');image.hidden=true;}
 detail.addEventListener('click',()=>{const quiet=stage.classList.toggle('low-power');detail.setAttribute('aria-pressed',String(quiet));detail.textContent=quiet?'Full atmosphere':'Quiet atmosphere';core?.setQuiet(quiet);});
 window.addEventListener('pagehide',event=>{if(!event.persisted){disposed=true;core?.dispose();}});
 try{
  const {createUniverseOrb}=await import('./assets/js/universe-orb.js');
  if(disposed)return;
  core=await createUniverseOrb(stage,{constrained,quiet:stage.classList.contains('low-power'),motionSnapshot});
  if(disposed)core.dispose();
 }catch(error){
  console.warn('ZoLaiGPT: using the Canvas 3D sphere fallback.',error.message);
  try{const {createSoftwareOrb}=await import('./assets/js/software-orb.js');if(disposed)return;core=await createSoftwareOrb(stage,{constrained,quiet:stage.classList.contains('low-power'),motionSnapshot});if(disposed)core.dispose();}
  catch(fallbackError){fallback();console.warn('ZoLaiGPT: static artwork fallback.',fallbackError.message);}
 }
}
