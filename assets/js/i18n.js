import {translations} from './translations.js';
let current='en';
export const getLanguage=()=>current;
export const translate=key=>translations[current]?.[key]??translations.en[key]??'';
export function setLanguage(language){
 current=Object.hasOwn(translations,language)?language:'en';
 document.documentElement.lang=current==='zom'?'ctd':current;
 document.querySelectorAll('[data-i]').forEach(el=>{el.textContent=translate(el.dataset.i);if(current==='zom'&&['lead','hero2','aboutbody','independent','websitefaq','f2d','f3d','updatedesc','updatenote'].includes(el.dataset.i))el.lang='en';else el.removeAttribute('lang')});
 document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===current)));
 for(const id of ['lang','chat-lang']){const el=document.getElementById(id);if(el)el.value=current;}
 const note=document.querySelector('#translation-note');if(note)note.hidden=current==='en';
 try{localStorage.setItem('zolaigpt-language',current)}catch{}
 window.dispatchEvent(new CustomEvent('languagechange',{detail:current}));
}
export function initLanguages(){let saved='en';try{saved=localStorage.getItem('zolaigpt-language')||'en'}catch{}setLanguage(saved);document.querySelector('#lang').addEventListener('change',e=>setLanguage(e.target.value));document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));}
