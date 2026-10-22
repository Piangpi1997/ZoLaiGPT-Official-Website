import * as THREE from '../../vendor/three.module.js';
const TURN_SECONDS=30,TAU=Math.PI*2;
// A real sphere, with the original spherical brand artwork projected into its
// material. Both hemispheres carry the identity, so it reappears as it turns.
// No camera-facing logo plane or CSS-rotated PNG is used in the WebGL version.
export async function createUniverseOrb(stage,{constrained,quiet,motionSnapshot}){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:!constrained,powerPreference:'low-power'});}catch(error){throw error;}
 const canvas=renderer.domElement;canvas.className='universe-canvas';canvas.setAttribute('aria-hidden','true');
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,constrained?1.25:1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.setClearColor(0x000000,0);stage.append(canvas);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,50);camera.position.set(0,.08,4.25);
 let texture;
 try{texture=await new THREE.TextureLoader().loadAsync(new URL('../zolaigpt-orb.webp',import.meta.url).href);}catch(error){renderer.dispose();canvas.remove();throw error;}
 texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
 const root=new THREE.Group(),sphereGroup=new THREE.Group();root.add(sphereGroup);scene.add(root);
 const sphereMaterial=new THREE.ShaderMaterial({
  uniforms:{brand:{value:texture},time:{value:0}},
  vertexShader:`varying vec3 localPoint;varying vec3 viewNormal;varying vec3 viewPosition;
   void main(){localPoint=position;vec4 p=modelViewMatrix*vec4(position,1.0);viewPosition=p.xyz;viewNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}`,
  fragmentShader:`uniform sampler2D brand;uniform float time;varying vec3 localPoint;varying vec3 viewNormal;varying vec3 viewPosition;
   void main(){
    vec3 p=normalize(localPoint);float facing=abs(p.z);
    vec2 uv=vec2(p.x*(p.z<0.0?-1.0:1.0),p.y)*0.5+0.5;
    vec4 art=texture2D(brand,uv);
    float seam=smoothstep(0.12,0.52,facing);
    float ribbon=0.5+0.5*sin(p.y*16.0+p.x*5.0+time*0.35);
    vec3 amber=mix(vec3(0.12,0.025,0.006),vec3(0.9,0.22,0.012),ribbon*0.72);
    vec3 color=mix(amber,art.rgb,seam*art.a);
    vec3 n=normalize(viewNormal),v=normalize(-viewPosition);
    float rim=pow(1.0-max(dot(n,v),0.0),3.3);
    color+=rim*vec3(0.45,0.17,0.018);
    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`
 });
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(1,constrained?40:64,constrained?28:48),sphereMaterial);sphereGroup.add(sphere);
 const atmosphereMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
  uniforms:{time:{value:0}},vertexShader:`varying vec3 n;varying vec3 p;void main(){vec4 view=modelViewMatrix*vec4(position,1.0);p=view.xyz;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*view;}`,
  fragmentShader:`uniform float time;varying vec3 n;varying vec3 p;void main(){float a=pow(1.0-abs(dot(normalize(n),normalize(-p))),2.8);vec3 color=mix(vec3(0.08,0.36,0.72),vec3(1.0,0.32,0.04),smoothstep(-0.8,0.8,n.x));gl_FragColor=vec4(color,a*(0.32+0.035*sin(time*0.7)));}`});
 root.add(new THREE.Mesh(new THREE.SphereGeometry(1.055,constrained?32:48,24),atmosphereMaterial));
 function ring(radius,color,arc){const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,.006,6,constrained?96:160,arc),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75}));scene.add(mesh);return mesh;}
 const orangeRing=ring(1.35,0xffa644,TAU*.88);orangeRing.rotation.set(1.12,.3,-.32);
 const blueRing=ring(1.52,0x56bbff,TAU*.72);blueRing.rotation.set(.95,-.7,.65);
 const starPositions=new Float32Array((constrained?90:220)*3),starColors=new Float32Array(starPositions.length);
 // Deterministic stars: stable through resize/restoration, no allocations per frame.
 let seed=821;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
 for(let i=0;i<starPositions.length;i+=3){starPositions[i]=(random()-.5)*6;starPositions[i+1]=(random()-.5)*5;starPositions[i+2]=-1-random()*4;const blue=random()>.6;starColors.set(blue?[.35,.66,1]:[1,.73,.41],i);}
 const starsGeometry=new THREE.BufferGeometry();starsGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));starsGeometry.setAttribute('color',new THREE.BufferAttribute(starColors,3));
 const starsMaterial=new THREE.PointsMaterial({size:constrained?.022:.018,vertexColors:true,transparent:true,opacity:.68,sizeAttenuation:true,depthWrite:false});const stars=new THREE.Points(starsGeometry,starsMaterial);scene.add(stars);
 let frame=0,last=0,lastWall=0,elapsed=0,automaticAngle=0,visible=true,lost=false,dead=false,pageAway=false,isDragging=false,resumeAfter=0,lastTelemetry=0;
 let pointerId=null,startX=0,startY=0,previousX=0,previousY=0,dragIntent=false,verticalIntent=false;
 function draw(){renderer.render(scene,camera);}
 function blocked(){return dead||lost||pageAway||!visible||motionSnapshot().paused;}
 function state(){const policy=motionSnapshot();return lost?'context-lost':policy.reduced?'reduced':policy.manual?'paused':document.hidden||pageAway?'hidden':!visible?'offscreen':isDragging?'dragging':'running';}
 function telemetry(){stage.dataset.rotationY=sphereGroup.rotation.y.toFixed(6);stage.dataset.autoAngle=automaticAngle.toFixed(6);stage.dataset.motion=state();stage.dataset.sampleTime=String(Date.now());}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;lastWall=0;telemetry();}
 // Visual deltas are clamped; the rotating identity uses elapsed active time.
 function tick(now){
  frame=0;if(blocked()){last=0;lastWall=0;telemetry();return;}
  frame=requestAnimationFrame(tick);
  const minimum=1000/(constrained||quiet?30:60);
  if(last&&now-last<minimum-1)return;
  const delta=last?Math.min((now-last)/1000,.1):0;last=now;elapsed+=delta;const wall=Date.now(),activeDelta=lastWall?Math.max(0,(wall-lastWall)/1000):0;lastWall=wall;
  if(!isDragging&&wall>=resumeAfter){const step=TAU/TURN_SECONDS*activeDelta;sphereGroup.rotation.y+=step;automaticAngle+=step;}
  root.position.y=quiet?0:Math.sin(elapsed*.6)*.035;
  orangeRing.rotation.z=-.32+elapsed*.055;orangeRing.rotation.y=.3+Math.sin(elapsed*.16)*.12;
  blueRing.rotation.z=.65-elapsed*.032;stars.rotation.z=quiet?0:elapsed*.004;
  sphereMaterial.uniforms.time.value=elapsed;atmosphereMaterial.uniforms.time.value=elapsed;
  draw();if(now-lastTelemetry>200){telemetry();lastTelemetry=now;}
 }
 function refresh(){if(blocked()){stop();if(!lost&&!dead){draw();}}else if(!frame){last=0;lastWall=0;frame=requestAnimationFrame(tick);}telemetry();}
 function resize(){const rect=stage.getBoundingClientRect();renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);camera.aspect=rect.width/Math.max(1,rect.height);camera.updateProjectionMatrix();draw();refresh();}
 function down(event){if(pointerId!==null||event.button!==0)return;pointerId=event.pointerId;startX=previousX=event.clientX;startY=previousY=event.clientY;dragIntent=verticalIntent=false;isDragging=true;telemetry();}
 function move(event){
  if(event.pointerId!==pointerId)return;
  const dx=event.clientX-startX,dy=event.clientY-startY;
  if(!dragIntent&&!verticalIntent&&Math.hypot(dx,dy)>6){dragIntent=Math.abs(dx)>Math.abs(dy);verticalIntent=!dragIntent;if(dragIntent)canvas.setPointerCapture(pointerId);}
  if(!dragIntent)return;
  sphereGroup.rotation.y+=(event.clientX-previousX)*.008;sphereGroup.rotation.x=THREE.MathUtils.clamp(sphereGroup.rotation.x+(event.clientY-previousY)*.004,-.35,.35);previousX=event.clientX;previousY=event.clientY;draw();telemetry();
 }
 function up(event){if(event.pointerId!==pointerId)return;const id=pointerId;pointerId=null;isDragging=false;resumeAfter=Date.now()+1400;if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);telemetry();refresh();}
 function contextLost(event){event.preventDefault();lost=true;stage.classList.add('webgl-lost');stop();}
 function contextRestored(){lost=false;stage.classList.remove('webgl-lost');resize();refresh();}
 function visibility(){if(document.hidden){const id=pointerId;pointerId=null;isDragging=false;resumeAfter=0;if(id!==null&&canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);}refresh();}
 function hide(event){pageAway=true;stop();if(!event.persisted)dispose();}
 function show(){pageAway=false;isDragging=false;pointerId=null;resize();refresh();}
 function setQuiet(value){quiet=value;stars.visible=!quiet;blueRing.visible=!quiet;refresh();}
 const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;stage.classList.toggle('orb-offscreen',!visible);refresh();},{rootMargin:'80px'}):null;
 const sizeObserver='ResizeObserver'in window?new ResizeObserver(resize):null;
 function dispose(){
  if(dead)return;dead=true;stop();observer?.disconnect();sizeObserver?.disconnect();
  document.removeEventListener('visibilitychange',visibility);window.removeEventListener('motionchange',refresh);window.removeEventListener('resize',resize);window.removeEventListener('pageshow',show);window.removeEventListener('pagehide',hide);
  canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);
  scene.traverse(object=>{object.geometry?.dispose();if(object.material)object.material.dispose();});texture.dispose();renderer.dispose();canvas.remove();
 }
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
 document.addEventListener('visibilitychange',visibility);window.addEventListener('motionchange',refresh);window.addEventListener('resize',resize,{passive:true});window.addEventListener('pageshow',show);window.addEventListener('pagehide',hide);
 sizeObserver?.observe(stage);observer?.observe(stage);stage.dataset.renderer='webgl';stage.dataset.turnSeconds=String(TURN_SECONDS);stage.classList.add('webgl-ready');setQuiet(quiet);resize();refresh();
 return {dispose,setQuiet};
}
