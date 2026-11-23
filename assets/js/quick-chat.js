import {translate,setLanguage,getLanguage} from './i18n.js?v=20261123b';
// Quick preview demo: deterministic replies from existing website copy. No network, no API keys.
export function initQuickChat(){
 const panel=document.getElementById('chat-panel');if(!panel)return;
 const input=document.getElementById('chat-input'),form=document.getElementById('chat-form'),log=document.getElementById('chat-log'),typing=document.getElementById('chat-typing');
 let timer=null,opener=null;
 const busy=on=>{typing.hidden=!on;form.querySelector('button').disabled=on;panel.querySelectorAll('[data-prompt]').forEach(b=>b.disabled=on)};
 function append(text,role){const el=document.createElement('p');el.className=`chat-message ${role}`;el.textContent=text;log.append(el);while(log.children.length>40)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;}
 function open(event){opener=event.currentTarget;document.getElementById('chat-lang').value=getLanguage();panel.showModal();opener.setAttribute('aria-expanded','true');input.focus();}
 document.querySelectorAll('[data-open-chat]').forEach(b=>b.addEventListener('click',open));
 document.getElementById('chat-close').addEventListener('click',()=>panel.close());
 panel.addEventListener('close',()=>{if(opener){opener.setAttribute('aria-expanded','false');opener.focus()}});
 panel.addEventListener('click',e=>{if(e.target===panel)panel.close()});
 document.getElementById('chat-expand').addEventListener('click',e=>{const expanded=panel.classList.toggle('expanded');e.currentTarget.setAttribute('aria-pressed',String(expanded));e.currentTarget.textContent=expanded?'Compact':'Expand';});
 document.getElementById('chat-lang').addEventListener('change',e=>setLanguage(e.target.value));
 function send(text,key){
  if(timer!==null||!text.trim())return;
  append(text.slice(0,1000),'user');input.value='';busy(true);
  const source=key||(/language|ဘာသာ|pau/i.test(text)?'f1d':/mission|vision|about|အကြောင်း/i.test(text)?'aboutbody':/app|download/i.test(text)?'appdesc':'independent');
  const reply=translate(source);
  timer=setTimeout(()=>{append(reply?'Preview demo — '+reply:'Preview demo — information is currently unavailable. Please try again.','assistant');timer=null;busy(false);if(panel.open)input.focus()},550);
 }
 form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});
 panel.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.textContent,b.dataset.prompt)));
 append('Welcome to the ZoLaiGPT preview. Ask about our languages, mission or app status — replies are local demo content, not live AI.','assistant');
 window.addEventListener('pagehide',()=>{clearTimeout(timer);timer=null;busy(false)});
}
