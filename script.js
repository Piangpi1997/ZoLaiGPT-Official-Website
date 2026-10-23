import {initAnnouncement} from './assets/js/announcement.js';
import {initFaq} from './assets/js/components.js';
import {siteConfig} from './assets/js/site-config.js';
import {initLanguages} from './assets/js/i18n.js';
import {initMotion} from './assets/js/animation.js';
import {initOrb} from './hero-orb.js';
import {initChatbot} from './chatbot.js';
initLanguages();initMotion();initOrb();initChatbot();initAnnouncement();initFaq();
document.querySelectorAll('[data-version]').forEach(el=>el.textContent=`V${siteConfig.version} · ${siteConfig.channel}`);
document.querySelector('#year').textContent=new Date().getFullYear();
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');
function closeMenu(focus=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');if(focus)menu.focus();}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true)});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
matchMedia('(min-width:1181px)').addEventListener('change',()=>closeMenu());
const updates=document.querySelector('#future-updates');
for(const entry of siteConfig.announcements){const card=document.createElement('article');card.className='update-entry';for(const [tag,key] of [['small','eyebrow'],['h3','title'],['p','body'],['span','status']]){const el=document.createElement(tag);el.textContent=entry[key];card.append(el)}updates.append(card);}
