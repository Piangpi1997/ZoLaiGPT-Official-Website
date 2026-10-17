import * as THREE from './vendor/three.module.js';
const host=document.querySelector('#globe');
try {
 const mobile=matchMedia('(max-width:600px)').matches||(navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4;
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.75));host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.z=4.6;
 const earth=new THREE.Group();scene.add(earth);earth.rotation.z=.12;
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(1,mobile?40:64,mobile?24:40),new THREE.MeshPhongMaterial({color:0x06192e,shininess:50,transparent:true,opacity:.96}));earth.add(sphere);
 scene.add(new THREE.AmbientLight(0x5172aa,1.8));const light=new THREE.DirectionalLight(0x78caff,3);light.position.set(-3,3,4);scene.add(light);
 const position=(lon,lat,r=1.008)=>{const a=lon*Math.PI/180,b=lat*Math.PI/180;return new THREE.Vector3(r*Math.cos(b)*Math.sin(a),r*Math.sin(b),r*Math.cos(b)*Math.cos(a))};
 function line(points,color,opacity,parent=earth){const g=new THREE.BufferGeometry().setFromPoints(points);const m=new THREE.LineBasicMaterial({color,transparent:true,opacity});const l=new THREE.Line(g,m);parent.add(l);return l}
 for(let lat=-75;lat<=75;lat+=15)line(Array.from({length:145},(_,i)=>position(i*2.5,lat)),0x3983ba,.25);
 for(let lon=0;lon<360;lon+=20)line(Array.from({length:73},(_,i)=>position(lon,i*2.5-90)),0x3983ba,.25);
 // Geographic polygons are loaded locally; no runtime third-party requests.
 fetch('./assets/world.geojson').then(r=>{if(!r.ok)throw Error('map');return r.json()}).then(data=>{
  if(disposed)return;const vertices=[];for(const f of data.features){const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;for(const poly of polys)for(const ring of poly)for(let i=1;i<ring.length;i++){vertices.push(...position(...ring[i-1],1.012).toArray(),...position(...ring[i],1.012).toArray())}}earth.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)),new THREE.LineBasicMaterial({color:0x70b5d9,transparent:true,opacity:.65})))
  host.dataset.map='ready';render();
 }).catch(()=>{host.dataset.map='unavailable'});
 const cities=[[101.69,3.14],[96.17,16.84],[93.66,23.37],[139.69,35.68],[-.12,51.5],[-74,40.7],[151,-33.8],[-46,-23],[37,55],[-122,37]];
 const points=new THREE.BufferGeometry().setFromPoints(cities.map(c=>position(...c,1.03)));earth.add(new THREE.Points(points,new THREE.PointsMaterial({color:0xff9a45,size:.045,transparent:true,opacity:.95})));
 const travelers=[];
 for(let i=1;i<cities.length;i++){const a=position(...cities[0]),b=position(...cities[i]);const pts=Array.from({length:55},(_,j)=>{const t=j/54;return a.clone().lerp(b,t).normalize().multiplyScalar(1.02+Math.sin(Math.PI*t)*.23)});line(pts,0xff741c,.35);const dot=new THREE.Mesh(new THREE.SphereGeometry(.012,6,6),new THREE.MeshBasicMaterial({color:0xffb875}));earth.add(dot);travelers.push({dot,pts})}
 const rings=[];for(let i=0;i<2;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.24+i*.09,.0045,6,160),new THREE.MeshBasicMaterial({color:i?0x368bdf:0xff741c,transparent:true,opacity:.85}));ring.rotation.x=1.15+i*.8;ring.rotation.y=i*.65;scene.add(ring);rings.push(ring)}
 const dust=[];for(let i=0;i<(mobile?70:150);i++){let t=i*2.39996,r=1.45+(i%11)*.06;dust.push(Math.cos(t)*r,Math.sin(t)*r,(i%7-3)*.13)}const particles=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(dust,3)),new THREE.PointsMaterial({color:0x72acdf,size:.012,transparent:true,opacity:.48}));scene.add(particles);
 host.classList.add('webgl-ready');host.dataset.renderer='webgl';
 let raf=null,lastTime=null,phase=0,total=0,dragging=false,pointer=null,lastX=0,lastY=0,resumeAt=0,lost=false,disposed=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const status=document.querySelector('#motion-status');
 const texture=new THREE.TextureLoader().load('logo.png',()=>render());texture.colorSpace=THREE.SRGBColorSpace;
 // Undistorted square emblems tangent to the sphere; parented to rotating Earth.
 for(const angle of [0,Math.PI]){const emblem=new THREE.Mesh(new THREE.PlaneGeometry(.62,.62),new THREE.MeshBasicMaterial({map:texture,transparent:true,toneMapped:false}));emblem.position.set(Math.sin(angle)*1.025,0,Math.cos(angle)*1.025);emblem.rotation.y=angle;earth.add(emblem)}
 function visible(){const r=host.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}
 function reason(){return lost?'context-lost':reduced.matches?'reduced-motion':document.documentElement.classList.contains('paused')?'manual-pause':document.hidden?'page-hidden':!visible()?'offscreen':dragging?'dragging':performance.now()<resumeAt?'drag-cooldown':'running'}
 function canRun(){return !disposed&&!lost&&!reduced.matches&&!document.documentElement.classList.contains('paused')&&!document.hidden&&visible()}
 function render(){if(disposed||lost)return;renderer.render(scene,camera);host.dataset.rotation=String(earth.rotation.y);host.dataset.autoRadians=String(total);host.dataset.state=reason();host.dataset.reduced=String(reduced.matches);host.dataset.drawCalls=String(renderer.info.render.calls);status.textContent=reason()==='running'?'Auto rotation · 30 seconds / revolution':reason().replaceAll('-',' ')}
 function tick(t){raf=null;if(!canRun()){lastTime=null;return}const dt=Math.min(Math.max((t-(lastTime??t))/1000,0),.1);lastTime=t;phase+=dt;if(!dragging&&t>=resumeAt){earth.rotation.y+=dt*Math.PI*2/30;total+=dt*Math.PI*2/30}earth.position.y=Math.sin(phase*.7)*.025;rings[0].rotation.z=phase*.12;rings[1].rotation.z=-phase*.08;particles.rotation.z=phase*.018;light.intensity=3+Math.sin(phase*1.2)*.35;travelers.forEach(({dot,pts},i)=>dot.position.copy(pts[Math.floor(((phase*.16+i*.13)%1)*(pts.length-1))]));render();raf=requestAnimationFrame(tick)}
 function stop(){if(raf!==null)cancelAnimationFrame(raf);raf=null;lastTime=null}
 function start(){if(canRun()){if(raf===null){lastTime=performance.now();raf=requestAnimationFrame(tick)}}else stop();render()}
 function resize(){if(disposed||lost)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();start()}
 const abort=new AbortController(),on=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal:abort.signal});
 const ro=new ResizeObserver(resize);ro.observe(host);const io=new IntersectionObserver(start);io.observe(host);
 on(window,'scroll',start,{passive:true});on(window,'resize',resize);on(document,'visibilitychange',()=>{end();start()});on(window,'motionchange',start);on(reduced,'change',start);
 on(host,'pointerdown',e=>{if(pointer!==null||!e.isPrimary||e.button!==0)return;pointer=e.pointerId;dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(pointer)});
 on(host,'pointermove',e=>{if(!dragging||pointer!==e.pointerId)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)+4){end();return}earth.rotation.y+=dx*.007;lastX=e.clientX;lastY=e.clientY;render()});
 function end(){if(!dragging)return;dragging=false;resumeAt=performance.now()+1200;const id=pointer;pointer=null;if(host.hasPointerCapture(id))host.releasePointerCapture(id);start()}
 for(const type of ['pointerup','pointercancel','lostpointercapture'])on(host,type,end);on(window,'pointerup',end);on(window,'blur',end);
 on(document.querySelector('#rotate-left'),'click',()=>{earth.rotation.y-=.3;render()});on(document.querySelector('#rotate-right'),'click',()=>{earth.rotation.y+=.3;render()});
 on(renderer.domElement,'webglcontextlost',e=>{e.preventDefault();lost=true;stop();end();host.classList.remove('webgl-ready');renderer.domElement.hidden=true;host.dataset.renderer='fallback';status.textContent='WebGL context lost · static fallback'});
 on(renderer.domElement,'webglcontextrestored',()=>{lost=false;host.classList.add('webgl-ready');renderer.domElement.hidden=false;host.dataset.renderer='webgl';resize()});
 on(window,'pageshow',()=>{end();resize()});on(window,'pagehide',e=>{stop();if(e.persisted)return;disposed=true;ro.disconnect();io.disconnect();abort.abort();texture.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});renderer.dispose()});resize();
}catch(error){host.dataset.renderer='fallback';host.dataset.error=error.message;document.querySelector('#motion-status').textContent='WebGL unavailable · original logo fallback';document.querySelector('#rotate-left').disabled=true;document.querySelector('#rotate-right').disabled=true;}
