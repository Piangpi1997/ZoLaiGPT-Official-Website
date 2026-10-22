// CPU ray-cast sphere fallback for browsers without WebGL. This maps each visible
// sphere surface point through an inverse 3D Y rotation; it never rotates a PNG.
// Pixel buffers are bounded and reused. The original source artwork is untouched.
const TAU=Math.PI*2;
export async function createSoftwareOrb(stage,{constrained,quiet,motionSnapshot}){
 const canvas=document.createElement('canvas');canvas.className='universe-canvas';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw Error('Canvas unavailable');
 const image=new Image();image.src=new URL('../zolaigpt-orb.webp',import.meta.url).href;await image.decode();
 const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=512;
 const tctx=textureCanvas.getContext('2d',{willReadFrequently:true});tctx.drawImage(image,0,0,512,512);
 const texture=tctx.getImageData(0,0,512,512).data;
 const resolution=constrained?180:280,buffer=document.createElement('canvas');buffer.width=buffer.height=resolution;
 const bctx=buffer.getContext('2d'),pixels=bctx.createImageData(resolution,resolution),surface=[];
 for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){const nx=(x+.5)/resolution*2-1,ny=1-(y+.5)/resolution*2,r2=nx*nx+ny*ny;if(r2<1)surface.push({i:(y*resolution+x)*4,x:nx,y:ny,z:Math.sqrt(1-r2),rim:Math.pow(r2,4),alpha:Math.min(1,(1-r2)*resolution*.35)});}
 let seed=821;function random(){seed=seed*16807%2147483647;return(seed-1)/2147483646;}
 const stars=Array.from({length:constrained?65:145},()=>({x:random(),y:random(),r:.5+random()*.8,blue:random()>.65,phase:random()*TAU}));
 stage.append(canvas);let width=1,height=1,frame=0,last=0,lastWall=0,elapsed=0,angle=0,automatic=0,tilt=0,visible=true,dead=false,away=false,dragging=false,resumeAfter=0,lastTelemetry=0;
 let pointer=null,startX=0,startY=0,previousX=0,previousY=0,intent=false,vertical=false;
 function blocked(){return dead||away||!visible||motionSnapshot().paused;}
 function state(){const m=motionSnapshot();return m.reduced?'reduced':m.manual?'paused':away||document.hidden?'hidden':!visible?'offscreen':dragging?'dragging':'running';}
 function telemetry(){stage.dataset.rotationY=angle.toFixed(6);stage.dataset.autoAngle=automatic.toFixed(6);stage.dataset.motion=state();stage.dataset.sampleTime=String(Date.now());}
 function sphere(){
  const c=Math.cos(angle),s=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt),out=pixels.data;
  for(const p of surface){
   const py=p.y*ct+p.z*st,pz=-p.y*st+p.z*ct,lx=p.x*c-pz*s,lz=p.x*s+pz*c;
   const u=Math.max(0,Math.min(511,Math.round((lx*(lz<0?-1:1)*.5+.5)*511))),v=Math.max(0,Math.min(511,Math.round((.5-py*.5)*511))),index=(v*512+u)*4;
   let blend=Math.max(0,Math.min(1,(Math.abs(lz)-.12)/.4));blend=blend*blend*(3-2*blend)*(texture[index+3]/255);
   const light=.65+.35*p.z,baseR=120+60*p.z,baseG=34+20*p.y,baseB=7;
   out[p.i]=(baseR*(1-blend)+texture[index]*blend)*light+p.rim*40;
   out[p.i+1]=(baseG*(1-blend)+texture[index+1]*blend)*light+p.rim*18;
   out[p.i+2]=(baseB*(1-blend)+texture[index+2]*blend)*light+p.rim*6;out[p.i+3]=Math.round(p.alpha*255);
  }
  bctx.putImageData(pixels,0,0);
 }
 function orbit(cx,cy,rx,ry,rotation,color,phase,front){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);ctx.strokeStyle=color;ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,front?0:Math.PI,front?Math.PI:TAU);ctx.stroke();
  const t=(phase%TAU+TAU)%TAU;if((front&&t<Math.PI)||(!front&&t>=Math.PI)){ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(Math.cos(t)*rx,Math.sin(t)*ry,2,0,TAU);ctx.fill();}ctx.restore();
 }
 function draw(){
  ctx.clearRect(0,0,width,height);const cx=width*.5,cy=height*.46+(quiet?0:Math.sin(elapsed*.6)*height*.007),radius=Math.min(width,height)*.31;
  if(!quiet){for(const star of stars){const x=(star.x+Math.sin(elapsed*.025+star.phase)*.008)*width,y=star.y*height;ctx.globalAlpha=.35+.3*Math.sin(elapsed*.3+star.phase);ctx.fillStyle=star.blue?'#87cfff':'#ffd199';ctx.beginPath();ctx.arc(x,y,star.r,0,TAU);ctx.fill();}ctx.globalAlpha=1;}
  const glow=ctx.createRadialGradient(cx,cy,radius*.8,cx,cy,radius*1.45);glow.addColorStop(0,'#ff741c22');glow.addColorStop(1,'#ff741c00');ctx.fillStyle=glow;ctx.fillRect(cx-radius*1.5,cy-radius*1.5,radius*3,radius*3);
  orbit(cx,cy,radius*1.4,radius*.44,-.38,'#ffb25699',elapsed*.32,false);if(!quiet)orbit(cx,cy,radius*1.58,radius*.51,.5,'#6dbdff77',TAU-elapsed*.24,false);
  sphere();ctx.drawImage(buffer,cx-radius,cy-radius,radius*2,radius*2);
  const sheen=ctx.createRadialGradient(cx-radius*.28,cy-radius*.3,radius*.2,cx,cy,radius);sheen.addColorStop(0,'#ffffff00');sheen.addColorStop(.82,'#ffb24a00');sheen.addColorStop(.97,'#ffb24a55');sheen.addColorStop(1,'#fff3caa0');ctx.fillStyle=sheen;ctx.beginPath();ctx.arc(cx,cy,radius,0,TAU);ctx.fill();
  orbit(cx,cy,radius*1.4,radius*.44,-.38,'#ffb25699',elapsed*.32,true);if(!quiet)orbit(cx,cy,radius*1.58,radius*.51,.5,'#6dbdff77',TAU-elapsed*.24,true);
 }
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;lastWall=0;telemetry();}
 // Clamp visual integration, but preserve elapsed-time angular speed even at low FPS.
 function tick(now){frame=0;if(blocked()){last=0;lastWall=0;telemetry();return;}frame=requestAnimationFrame(tick);if(last&&now-last<1000/30-1)return;const dt=last?Math.min((now-last)/1000,.1):0;last=now;elapsed+=dt;const wall=Date.now(),activeDelta=lastWall?Math.max(0,(wall-lastWall)/1000):0;lastWall=wall;if(!dragging&&wall>=resumeAfter){const step=TAU/30*activeDelta;angle+=step;automatic+=step;}draw();if(now-lastTelemetry>200){telemetry();lastTelemetry=now;}}
 function refresh(){if(blocked()){stop();if(!dead)draw();}else if(!frame){last=0;lastWall=0;frame=requestAnimationFrame(tick);}telemetry();}
 function resize(){const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,constrained?1:1.25);canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw();refresh();}
 function down(e){if(pointer!==null||e.button!==0)return;pointer=e.pointerId;startX=previousX=e.clientX;startY=previousY=e.clientY;intent=vertical=false;dragging=true;telemetry();}
 function move(e){if(pointer!==e.pointerId)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(!intent&&!vertical&&Math.hypot(dx,dy)>6){intent=Math.abs(dx)>Math.abs(dy);vertical=!intent;if(intent)canvas.setPointerCapture(pointer);}if(!intent)return;angle+=(e.clientX-previousX)*.008;tilt=Math.max(-.35,Math.min(.35,tilt+(e.clientY-previousY)*.004));previousX=e.clientX;previousY=e.clientY;draw();telemetry();}
 function up(e){if(pointer!==e.pointerId)return;const id=pointer;pointer=null;dragging=false;resumeAfter=Date.now()+1400;if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);telemetry();refresh();}
 function visibility(){if(document.hidden){const id=pointer;pointer=null;dragging=false;resumeAfter=0;if(id!==null&&canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);}refresh();}
 function hide(e){away=true;stop();if(!e.persisted)dispose();}function show(){away=false;pointer=null;dragging=false;resize();refresh();}
 const observer='IntersectionObserver'in window?new IntersectionObserver(e=>{visible=e[0].isIntersecting;stage.classList.toggle('orb-offscreen',!visible);refresh();},{rootMargin:'80px'}):null;
 const sizeObserver='ResizeObserver'in window?new ResizeObserver(resize):null;
 function dispose(){if(dead)return;dead=true;stop();observer?.disconnect();sizeObserver?.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('motionchange',refresh);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('lostpointercapture',up);canvas.remove();}
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);window.addEventListener('resize',resize,{passive:true});window.addEventListener('motionchange',refresh);document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
 stage.dataset.renderer='canvas-3d';stage.dataset.turnSeconds='30';stage.classList.add('webgl-ready');sizeObserver?.observe(stage);observer?.observe(stage);resize();refresh();
 return {dispose,setQuiet(value){quiet=value;refresh();}};
}
