import {siteConfig} from './site-config.js?v=20261123c';
import {initLanguages} from './i18n.js?v=20261123c';
import {initQuickChat} from './quick-chat.js?v=20261123c';

document.documentElement.classList.add('js');

function initMenu(){
 const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('site-nav');if(!toggle||!nav)return;
 const set=open=>{nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu')};
 toggle.addEventListener('click',()=>set(toggle.getAttribute('aria-expanded')!=='true'));
 nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){set(false);toggle.focus()}});
 document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))set(false)});
 matchMedia('(min-width:901px)').addEventListener('change',()=>set(false));
}

function initAnnouncement(){
 const bar=document.getElementById('announcement'),cfg=siteConfig.announcement;if(!bar||!cfg)return;
 const key=`zolaigpt-announcement:${cfg.id}`;
 let dismissed=false;try{dismissed=localStorage.getItem(key)==='dismissed'}catch{}
 const link=bar.querySelector('a');link.textContent=cfg.text;link.href=cfg.href;
 bar.hidden=dismissed;
 bar.querySelector('button').addEventListener('click',()=>{document.querySelector('.brand')?.focus();bar.hidden=true;try{localStorage.setItem(key,'dismissed')}catch{}});
}

function initReveal(){
 const items=document.querySelectorAll('.reveal');
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){items.forEach(el=>el.classList.add('is-visible'));return}
 const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}},{rootMargin:'0px 0px -8% 0px',threshold:.08});
 items.forEach(el=>io.observe(el));
}

function initFaq(){
 for(const d of document.querySelectorAll('.faq details')){const s=d.querySelector('summary');const sync=()=>s.setAttribute('aria-expanded',String(d.open));d.addEventListener('toggle',sync);sync()}
}

function initAppFilters(){
 const bar=document.getElementById('app-filters'),grid=document.getElementById('app-grid');if(!bar||!grid)return;
 const empty=document.getElementById('app-empty');
 bar.addEventListener('click',e=>{
  const btn=e.target.closest('[data-filter]');if(!btn)return;
  bar.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
  const f=btn.dataset.filter;let shown=0;
  for(const card of grid.children){const match=f==='all'||card.dataset.platforms.split(' ').includes(f)||card.dataset.status===f;card.hidden=!match;if(match)shown++}
  empty.hidden=shown>0;
  document.getElementById('app-count').textContent=`${shown} ${shown===1?'app':'apps'} shown`;
 });
}

/** The Android download always serves the newest release; show its version and checksum. */
function initLatestAndroid(){
 const els=document.querySelectorAll('[data-latest]');if(!els.length)return;
 fetch('/download/android.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{
  if(!j||!/^[0-9a-f]{64}$/.test(j.sha256||'')||!j.version)return;
  els.forEach(el=>{const k=el.dataset.latest;
   if(k==='version')el.textContent=j.version;
   else if(k==='sha256')el.textContent=j.sha256;
   else if(k==='label')el.textContent=el.textContent.replace(/\d+\.\d+(\.\d+)?/,j.version);});
 }).catch(()=>{});
}

initLatestAndroid();initLanguages();initMenu();initAnnouncement();initReveal();initFaq();initAppFilters();initQuickChat();
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
