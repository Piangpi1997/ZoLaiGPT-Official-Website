import {siteConfig} from './assets/js/site-config.js';
import {initLanguages} from './assets/js/i18n.js';
import {initMotion} from './assets/js/animation.js';
import {initOrb} from './hero-orb.js';
import {initChatbot} from './chatbot.js';
initLanguages();initMotion();initOrb();initChatbot();
document.querySelectorAll('[data-version]').forEach(el=>el.textContent=`V${siteConfig.version} · ${siteConfig.channel}`);
document.querySelector('#year').textContent=new Date().getFullYear();
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');
function closeMenu(focus=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');if(focus)menu.focus();}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true)});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
matchMedia('(min-width:1001px)').addEventListener('change',()=>closeMenu());
document.querySelectorAll('[data-shot]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#app-shot').src=`assets/app-${b.dataset.shot}.webp`;document.querySelector('#app-shot').alt=b.dataset.shot==='1'?'Actual ZoLaiGPT account credits and billing status':'Actual ZoLaiGPT Free, Plus, Pro and Ultra plans';document.querySelectorAll('[data-shot]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
const updates=document.querySelector('#future-updates');
for(const entry of siteConfig.announcements){const card=document.createElement('article');card.className='update-entry';for(const [tag,key] of [['small','eyebrow'],['h3','title'],['p','body'],['span','status']]){const el=document.createElement(tag);el.textContent=entry[key];card.append(el)}updates.append(card);}
