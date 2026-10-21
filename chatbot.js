import {translate,setLanguage,getLanguage} from './assets/js/i18n.js';
// Preview demo: deterministic source-content replies only; no network or API secrets.
export function initChatbot(){
 const panel=document.querySelector('#chat-panel'),launch=document.querySelector('#chat-launch'),input=document.querySelector('#chat-input'),form=document.querySelector('#chat-form'),log=document.querySelector('#chat-log'),typing=document.querySelector('#chat-typing');let timer=null;
 const busy=on=>{typing.hidden=!on;form.querySelector('button').disabled=on;document.querySelectorAll('[data-prompt]').forEach(b=>b.disabled=on)};
 function append(text,role){const el=document.createElement('p');el.className=`chat-message ${role}`;el.textContent=text;log.append(el);while(log.children.length>40)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;}
 function open(){document.querySelector('#chat-lang').value=getLanguage();panel.showModal();launch.setAttribute('aria-expanded','true');input.focus();}
 launch.addEventListener('click',open);document.querySelectorAll('[data-open-chat]').forEach(b=>b.addEventListener('click',open));
 for(const id of ['chat-close','chat-minimize'])document.getElementById(id).addEventListener('click',()=>panel.close());
 panel.addEventListener('close',()=>{launch.setAttribute('aria-expanded','false');launch.focus()});
 document.querySelector('#chat-expand').addEventListener('click',e=>{const expanded=panel.classList.toggle('expanded');e.currentTarget.setAttribute('aria-pressed',String(expanded));e.currentTarget.textContent=expanded?'Compact':'Expand';});
 document.querySelector('#chat-lang').addEventListener('change',e=>setLanguage(e.target.value));
 function send(text,key){if(timer!==null||!text.trim())return;append(text.slice(0,1000),'user');input.value='';busy(true);const source=key||(/language|ဘာသာ|pau/i.test(text)?'f1d':/mission|vision|about/i.test(text)?'aboutbody':'appdesc');const reply=translate(source);timer=setTimeout(()=>{append(reply?'Preview demo — '+reply:'Preview demo — information is currently unavailable. Please try again.','assistant');timer=null;busy(false);if(panel.open)input.focus()},550);}
 form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.textContent,b.dataset.prompt)));
 append('Welcome to the ZoLaiGPT preview. Explore our languages, mission and app status with a local demo reply.','assistant');
 window.addEventListener('pagehide',()=>{clearTimeout(timer);timer=null;busy(false)});
}
