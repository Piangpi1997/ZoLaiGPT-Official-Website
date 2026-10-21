import {siteConfig} from './site-config.js';
// Dismissals apply to one editorial announcement, never to all future updates.
export const announcementKey=id=>`zolaigpt-announcement:${id}`;
export function initAnnouncement(){
 const banner=document.getElementById('announcement-banner'),header=document.querySelector('.header');
 const message=document.getElementById('announcement-text'),close=document.getElementById('announcement-close');
 const config=siteConfig.announcement;if(!banner||!config)return;
 message.textContent=config.text;message.setAttribute('href',config.href);
 const key=announcementKey(config.id);
 try{banner.hidden=localStorage.getItem(key)==='dismissed'}catch{}
 function measure(){
  document.documentElement.style.setProperty('--announcement-height',`${banner.hidden?0:banner.getBoundingClientRect().height}px`);
  document.documentElement.style.setProperty('--header-height',`${header.getBoundingClientRect().height}px`);
 }
 close.addEventListener('click',()=>{
  // Focus a stable destination before removing the currently focused control.
  header.querySelector('.brand').focus();banner.hidden=true;
  try{localStorage.setItem(key,'dismissed')}catch{}
  measure();
 });
 const observer='ResizeObserver'in window?new ResizeObserver(measure):null;
 observer?.observe(banner);observer?.observe(header);window.addEventListener('resize',measure,{passive:true});
 window.addEventListener('pageshow',measure);document.fonts?.ready.then(measure);measure();
 window.addEventListener('pagehide',event=>{if(!event.persisted){observer?.disconnect();window.removeEventListener('resize',measure)}});
}
