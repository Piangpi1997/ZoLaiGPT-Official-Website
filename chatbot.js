'use strict';
(() => {
 const panel=document.querySelector('#chat-panel'),launch=document.querySelector('#chat-launch'),form=document.querySelector('#chat-form'),input=document.querySelector('#chat-input'),log=document.querySelector('#chat-log'),typing=document.querySelector('#chat-typing'),language=document.querySelector('#chat-lang'),mainLanguage=document.querySelector('#lang');
 if(!panel||!launch||!form||!input||!log||!typing||!language||!mainLanguage)return;
 const send=form.querySelector('button[type="submit"]');
 let pending=null;
 const labels={
  en:{clear:'New chat',topics:['About ZoLaiGPT','Supported languages','App availability'],welcome:'Demo mode: Ask about ZoLaiGPT. Replies are local website excerpts, not live AI.'},
  my:{clear:'စကားဝိုင်းအသစ်',topics:['ZoLaiGPT အကြောင်း','ဘာသာစကားများ','App အကြောင်း'],welcome:'Demo Mode — ZoLaiGPT Website အကြောင်း မေးနိုင်ပါတယ်။ တကယ့် AI မဟုတ်သေးပါ။'},
  zom:{clear:'New chat',topics:['About ZoLaiGPT','Languages','App information'],welcome:'Demo Mode — English labels pending approved Zomi translation.'}
 };
 const controls=document.createElement('div');controls.className='chat-v55-tools';controls.setAttribute('aria-label','Demo chat tools');
 const clear=document.createElement('button');clear.type='button';clear.className='chat-v55-clear';controls.append(clear);
 const suggestions=document.createElement('div');suggestions.className='chat-v55-suggestions';suggestions.setAttribute('aria-label','Suggested demo questions');
 log.before(controls);log.after(suggestions);
 const style=document.createElement('style');style.textContent='.chat-v55-tools{display:flex;justify-content:flex-end;margin:8px 0}.chat-v55-clear,.chat-v55-suggestions button{border:1px solid #ffffff30;border-radius:999px;background:#162541;color:#f7f9fc;font:inherit;font-size:12px;padding:7px 12px;cursor:pointer}.chat-v55-suggestions{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.chat-v55-suggestions button:hover,.chat-v55-clear:hover{border-color:#ff741c}.chat-v55-tools button:focus-visible,.chat-v55-suggestions button:focus-visible{outline:2px solid #ff9b51;outline-offset:2px}';document.head.append(style);
 const current=()=>labels[language.value]||labels.en;
 function append(text,who){const p=document.createElement('p');p.className='chat-message '+who;p.textContent=text;log.append(p);while(log.children.length>40)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;}
 function cancel(){if(pending!==null){clearTimeout(pending);pending=null;}typing.hidden=true;send.disabled=false;}
 function populate(){clear.textContent=current().clear;suggestions.replaceChildren();current().topics.forEach((label,index)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.addEventListener('click',()=>{input.value=label;form.requestSubmit();});suggestions.append(btn);});}
 function sync(){language.value=mainLanguage.value;populate();}
 function reset(){cancel();log.replaceChildren();append(current().welcome,'assistant');input.value='';input.focus();}
 clear.addEventListener('click',reset);
 launch.addEventListener('click',()=>{sync();if(!panel.open)panel.showModal();launch.setAttribute('aria-expanded','true');input.focus();});
 const close=()=>panel.close();document.querySelector('#chat-close').addEventListener('click',close);document.querySelector('#chat-minimize').addEventListener('click',close);
 panel.addEventListener('close',()=>{launch.setAttribute('aria-expanded','false');launch.focus();});
 language.addEventListener('change',()=>{mainLanguage.value=language.value;mainLanguage.dispatchEvent(new Event('change'));populate();});
 mainLanguage.addEventListener('change',sync);
 populate();append(current().welcome,'assistant');
 function getReply(text){const about=/about|mission|vision|အကြောင်း/i.test(text),languages=/language|ဘာသာ|zomi|myanmar|pau/i.test(text);const key=languages?'f1d':about?'aboutbody':'appdesc';const source=document.querySelector('[data-i="'+key+'"]');return 'Demo reply — '+(source?.textContent?.trim()||'Please browse the website for official information.');}
 form.addEventListener('submit',event=>{event.preventDefault();const text=input.value.trim();if(!text||pending!==null)return;if(text.length>1000)return;append(text,'user');input.value='';typing.hidden=false;send.disabled=true;pending=setTimeout(()=>{append(getReply(text),'assistant');typing.hidden=true;send.disabled=false;pending=null;input.focus();},450);});
 window.addEventListener('pagehide',cancel);
})();