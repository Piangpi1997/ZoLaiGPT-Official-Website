'use strict';
(() => {
 const panel=document.querySelector('#chat-panel'),launch=document.querySelector('#chat-launch'),form=document.querySelector('#chat-form'),input=document.querySelector('#chat-input'),log=document.querySelector('#chat-log'),typing=document.querySelector('#chat-typing'),language=document.querySelector('#chat-lang'),mainLanguage=document.querySelector('#lang');
 if(!panel||!launch||!form||!input||!log||!typing||!language||!mainLanguage)return;
 const send=form.querySelector('button[type="submit"]');
 let pending=null,abortController=null;
 const ENDPOINT='https://zolaigpt-v55-openrouter-preview.thangdeihpiang21.workers.dev';
 let history=[];
 const labels={
  en:{clear:'New chat',topics:['About ZoLaiGPT','Supported languages','App availability'],welcome:'V5.5 AI Preview — OpenRouter free-model availability may vary.'},
  my:{clear:'စကားဝိုင်းအသစ်',topics:['ZoLaiGPT အကြောင်း','ဘာသာစကားများ','App အကြောင်း'],welcome:'V5.5 AI Preview — OpenRouter Free Model ဖြင့် စမ်းသပ်နေဆဲဖြစ်သည်။'},
  zom:{clear:'New chat',topics:['About ZoLaiGPT','Languages','App information'],welcome:'Demo Mode — English labels pending approved Zomi translation.'}
 };
 const controls=document.createElement('div');controls.className='chat-v55-tools';controls.setAttribute('aria-label','Demo chat tools');
 const clear=document.createElement('button');clear.type='button';clear.className='chat-v55-clear';controls.append(clear);
 const suggestions=document.createElement('div');suggestions.className='chat-v55-suggestions';suggestions.setAttribute('aria-label','Suggested demo questions');
 log.before(controls);log.after(suggestions);
 const style=document.createElement('style');style.textContent='.chat-v55-tools{display:flex;justify-content:flex-end;margin:8px 0}.chat-v55-clear,.chat-v55-suggestions button{border:1px solid #ffffff30;border-radius:999px;background:#162541;color:#f7f9fc;font:inherit;font-size:12px;padding:7px 12px;cursor:pointer}.chat-v55-suggestions{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.chat-v55-suggestions button:hover,.chat-v55-clear:hover{border-color:#ff741c}.chat-v55-tools button:focus-visible,.chat-v55-suggestions button:focus-visible{outline:2px solid #ff9b51;outline-offset:2px}';document.head.append(style);
 const current=()=>labels[language.value]||labels.en;
 function append(text,who){const p=document.createElement('p');p.className='chat-message '+who;p.textContent=text;log.append(p);while(log.children.length>40)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;}
 function cancel(){if(pending!==null){clearTimeout(pending);pending=null;}if(abortController){abortController.abort();abortController=null;}typing.hidden=true;send.disabled=false;}
 function populate(){clear.textContent=current().clear;suggestions.replaceChildren();current().topics.forEach((label,index)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.addEventListener('click',()=>{input.value=label;form.requestSubmit();});suggestions.append(btn);});}
 function sync(){language.value=mainLanguage.value;populate();}
 function reset(){cancel();history=[];log.replaceChildren();append(current().welcome,'assistant');input.value='';input.focus();}
 clear.addEventListener('click',reset);
 launch.addEventListener('click',()=>{sync();if(!panel.open)panel.showModal();launch.setAttribute('aria-expanded','true');input.focus();});
 const close=()=>panel.close();document.querySelector('#chat-close').addEventListener('click',close);document.querySelector('#chat-minimize').addEventListener('click',close);
 panel.addEventListener('close',()=>{launch.setAttribute('aria-expanded','false');launch.focus();});
 language.addEventListener('change',()=>{mainLanguage.value=language.value;mainLanguage.dispatchEvent(new Event('change'));populate();});
 mainLanguage.addEventListener('change',sync);
 populate();append(current().welcome,'assistant');
 form.addEventListener('submit',async event=>{
  event.preventDefault();const message=input.value.trim();if(!message||pending!==null||abortController)return;
  append(message,'user');input.value='';typing.hidden=false;send.disabled=true;
  const controller=new AbortController();abortController=controller;
  const timeout=setTimeout(()=>controller.abort(),18000);
  try{
   const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:language.value,history:history.slice(-8)}),signal:controller.signal});
   let data={};try{data=await response.json()}catch{}
   if(!response.ok)throw Error(data.error||'AI temporarily unavailable');
   if(typeof data.reply!=='string'||!data.reply.trim())throw Error('Empty AI reply');
   append(data.reply,'assistant');
   history.push({role:'user',content:message},{role:'assistant',content:data.reply.slice(0,1000)});
   history=history.slice(-8);
  }catch(error){
   if(!controller.signal.aborted)append('AI unavailable — '+(error.message||'Please try again later')+'. No demo response was substituted.','assistant');
   else if(log.isConnected)append('Request cancelled or timed out. Please try again.','assistant');
  }finally{clearTimeout(timeout);if(abortController===controller)abortController=null;typing.hidden=true;send.disabled=false;input.focus();}
 });
 window.addEventListener('pagehide',cancel);
})();