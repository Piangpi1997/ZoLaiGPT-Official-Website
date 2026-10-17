'use strict';
(() => {
 const panel=document.querySelector('#chat-panel'),launch=document.querySelector('#chat-launch'),form=document.querySelector('#chat-form'),input=document.querySelector('#chat-input'),log=document.querySelector('#chat-log'),typing=document.querySelector('#chat-typing'),language=document.querySelector('#chat-lang'),mainLanguage=document.querySelector('#lang');
 let pending=null;
 function append(text,who){const p=document.createElement('p');p.className='chat-message '+who;p.textContent=text;log.append(p);while(log.children.length>40)log.firstElementChild.remove();log.scrollTop=log.scrollHeight}
 function sync(){language.value=mainLanguage.value}
 launch.addEventListener('click',()=>{sync();panel.showModal();launch.setAttribute('aria-expanded','true');input.focus()});
 const close=()=>panel.close();document.querySelector('#chat-close').addEventListener('click',close);document.querySelector('#chat-minimize').addEventListener('click',close);
 panel.addEventListener('close',()=>{launch.setAttribute('aria-expanded','false');launch.focus()});
 language.addEventListener('change',()=>{mainLanguage.value=language.value;mainLanguage.dispatchEvent(new Event('change'))});mainLanguage.addEventListener('change',sync);
 append('Demo Mode — try a message to see a sample reply using the website’s original content. This is not a live AI service.','assistant');
 form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||pending!==null)return;append(text,'user');input.value='';typing.hidden=false;form.querySelector('button').disabled=true;
 const key=/language|ဘာသာ|pau/i.test(text)?'f1d':/mission|about|vision/i.test(text)?'aboutbody':'appdesc';
 const reply=document.querySelector(`[data-i="${key}"]`).textContent;
 pending=setTimeout(()=>{append('Demo reply — '+reply,'assistant');typing.hidden=true;form.querySelector('button').disabled=false;pending=null;input.focus()},650);
 });
 window.addEventListener('pagehide',()=>{if(pending!==null){clearTimeout(pending);pending=null;typing.hidden=true;form.querySelector('button').disabled=false}});
})();
