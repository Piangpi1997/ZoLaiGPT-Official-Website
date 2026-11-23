import {translations} from './translations.js?v=20261123b';
// Applies reviewed dictionary strings to [data-i] elements. Keys without a reviewed
// translation stay in English and keep lang="en" so typography and screen readers stay correct.
let current='en';
const htmlLang={en:'en',my:'my',zom:'ctd'};
export const getLanguage=()=>current;
export const hasTranslation=key=>Object.hasOwn(translations[current]||{},key);
export const translate=key=>translations[current]?.[key]??translations.en[key]??'';
export function setLanguage(language){
 current=Object.hasOwn(translations,language)?language:'en';
 document.documentElement.lang=htmlLang[current];
 document.querySelectorAll('[data-i]').forEach(el=>{
  const key=el.dataset.i;if(!Object.hasOwn(translations.en,key))return;
  el.textContent=translate(key);
  el.lang=hasTranslation(key)?htmlLang[current]:'en';
 });
 document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===current)));
 for(const id of ['lang','chat-lang']){const el=document.getElementById(id);if(el)el.value=current;}
 const note=document.querySelector('#translation-note');if(note)note.hidden=current==='en';
 try{localStorage.setItem('zolaigpt-language',current)}catch{}
 window.dispatchEvent(new CustomEvent('languagechange',{detail:current}));
}
export function initLanguages(){
 let saved='en';try{saved=localStorage.getItem('zolaigpt-language')||'en'}catch{}
 setLanguage(saved);
 document.getElementById('lang')?.addEventListener('change',e=>setLanguage(e.target.value));
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));
}
