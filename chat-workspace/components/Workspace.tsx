'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Plus, PanelLeftClose, PanelLeftOpen, MessageSquare, MoreHorizontal, Settings2, Download, Link2, LayoutPanelLeft, X, Sparkles, Globe2, Code2, Compass, ArrowRight, Square, Paperclip, AudioLines, ChevronDown, Check, Trash2, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import Message, { type ChatMessage } from './Message';
import { makeReply, prompts, safeAttachment, transcript } from '../lib/demo.mjs';

type Thread = { id: string; title: string; created: number; messages: ChatMessage[] };
type Attachment = { name: string; text: string };
type Job = { threadId: string; messageId: string; reply: string; offset: number; timer: ReturnType<typeof setTimeout> | null };
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function Workspace() {
  const systemReduced = useReducedMotion();
  const [motionOff, setMotionOff] = useState(false);
  const [solid, setSolid] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState('');
  const [streamId, setStreamId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [wave, setWave] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const dock = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const sidebarDialog = useRef<HTMLDialogElement>(null);
  const settings = useRef<HTMLDialogElement>(null);
  const modeDialog = useRef<HTMLDialogElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const job = useRef<Job | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = threads.find(t => t.id === activeId);
  const messages = active?.messages || [];
  const reduced = Boolean(systemReduced || motionOff);
  const t = (en: string, my: string) => language === 'my' ? my : en;
  function changeLanguage(value: string) { setLanguage(value); try { localStorage.setItem('zolaigpt-language',value); } catch {} }
  function toggleTheme() { const value=theme==='dark'?'light':'dark';setTheme(value);try { localStorage.setItem('zolaigpt-theme',value); } catch {} }
  useEffect(() => { document.documentElement.dataset.theme=theme; },[theme]);
  useEffect(() => { document.documentElement.lang=language==='my'?'my':language==='zom'?'ctd':'en'; },[language]);

  function notify(text: string) {
    setToast(text); if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4500);
  }

  useEffect(() => {
    setHydrated(true);
    try { setTheme(localStorage.getItem('zolaigpt-theme')==='light'?'light':'dark'); } catch {}
    if(new URLSearchParams(location.search).get('sample')==='code')setInput('Show me a small JavaScript example.');
    try { const lang = localStorage.getItem('zolaigpt-language'); if (['en','my','zom'].includes(lang || '')) setLanguage(lang!); } catch {}
    const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dock.current?.focus(); } };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); if (job.current?.timer) clearTimeout(job.current.timer); if (toastTimer.current) clearTimeout(toastTimer.current); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  useEffect(() => {
    const panel = sidebarDialog.current;
    if (mobileOpen && panel && !panel.open) panel.showModal();
    else if (!mobileOpen && panel?.open) panel.close();
  }, [mobileOpen]);

  useEffect(() => {
    if (!dock.current) return;
    dock.current.style.height = 'auto';
    dock.current.style.height = `${Math.min(dock.current.scrollHeight, 144)}px`;
  }, [input]);

  useEffect(() => {
    const el = log.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 280) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const adjust = () => document.documentElement.style.setProperty('--workspace-height', `${viewport?.height || innerHeight}px`);
    adjust(); viewport?.addEventListener('resize', adjust);
    return () => { viewport?.removeEventListener('resize', adjust); document.documentElement.style.removeProperty('--workspace-height'); };
  }, []);

  useEffect(() => {
    const running = job.current;
    if (!reduced || !running) return;
    if (running.timer) clearTimeout(running.timer);
    setThreads(items => items.map(t => t.id !== running.threadId ? t : {...t, messages:t.messages.map(m => m.id === running.messageId ? {...m,content:running.reply} : m)}));
    job.current = null; setStreamId(null);
  }, [reduced]);

  function stop() {
    if (job.current?.timer) clearTimeout(job.current.timer);
    const running = job.current;
    if (running && running.offset === 0) setThreads(items => items.map(t => t.id !== running.threadId ? t : {...t, messages:t.messages.filter(m => m.id !== running.messageId)}));
    job.current = null; setStreamId(null);
  }

  function beginReply(threadId: string, text: string, replaceId?: string) {
    const messageId = replaceId || uid();
    const reply = makeReply(text, language);
    setThreads(items => items.map(t => t.id !== threadId ? t : {...t, messages: replaceId ? t.messages.map(m => m.id === replaceId ? {...m, content:''} : m) : [...t.messages, {id:messageId, role:'assistant', content:''}]}));
    setStreamId(messageId);
    const running: Job = {threadId, messageId, reply, offset:0, timer:null}; job.current = running;
    function tick() {
      if (job.current !== running) return;
      running.offset = reduced ? reply.length : Math.min(reply.length, running.offset + 16);
      setThreads(items => items.map(t => t.id !== threadId ? t : {...t, messages:t.messages.map(m => m.id === messageId ? {...m,content:reply.slice(0,running.offset)} : m)}));
      if (running.offset < reply.length) running.timer = setTimeout(tick, 24);
      else { job.current = null; setStreamId(null); }
    }
    running.timer = setTimeout(tick, reduced ? 0 : 520);
  }

  function send(text = input) {
    if (!text.trim() || job.current) return;
    if (messages.length >= 79) { notify('Start a new thread to continue this preview.'); return; }
    if (!activeId && threads.length >= 30) { notify('This preview holds up to 30 threads. Clear local conversations in preferences to continue.'); return; }
    const content = text.trim().slice(0, 4000) + (attachment ? `\n\nAttached locally: ${attachment.name}\n${attachment.text.slice(0, 6000)}` : '');
    let id = activeId;
    const user: ChatMessage = {id:uid(),role:'user',content};
    if (!id) { id = uid(); setThreads(items => [...items,{id:id!,title:text.trim().slice(0,42),created:Date.now(),messages:[user]}]); setActiveId(id); }
    else setThreads(items => items.map(t => t.id === id ? {...t,messages:[...t.messages,user]} : t));
    setInput(''); setAttachment(null); beginReply(id, text); dock.current?.focus();
    requestAnimationFrame(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; });
  }

  function newThread() { stop(); setActiveId(null); setInput(''); setAttachment(null); setMobileOpen(false); dock.current?.focus(); }
  function choose(id: string) { stop(); setActiveId(id); setInput(''); setAttachment(null); setMobileOpen(false); }
  function exportText(name: string, text: string) {
    const url = URL.createObjectURL(new Blob([text], {type:'text/markdown;charset=utf-8'}));
    const anchor = document.createElement('a'); anchor.href=url; anchor.download=name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
    notify('Markdown export downloaded.');
  }
  async function attach(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0]; e.target.value=''; if (!chosen) return;
    if (!safeAttachment(chosen.name, chosen.size)) { notify('Choose a .txt, .md, .json or .csv file up to 100 KB.'); return; }
    try { const text = await chosen.text(); setAttachment({name:chosen.name,text}); notify('Text attached locally. Demo replies do not analyse files.'); } catch { notify('This file could not be read.'); }
  }
  const closeMobile = () => { setMobileOpen(false); menuButton.current?.focus(); };
  const Sidebar = ({compact = false}: {compact?: boolean}) => <>
    <a href="/" className="sidebar-brand" aria-label="ZoLaiGPT homepage"><img src="/logo.png" alt="" width="34" height="34"/>{!compact && <span>ZoLai<span className="brand-orange">GPT</span><small>WORKSPACE DEMO</small></span>}</a>
    <button className="new-thread glass-button" onClick={newThread} title="New thread"><Plus size={18}/>{!compact && <span>{t('New thread','စကားဝိုင်းအသစ်')}</span>}{!compact && <kbd>＋</kbd>}</button>
    {!compact && <><label className="thread-search"><Search size={14}/><input aria-label="Search threads" value={filter} onChange={e=>setFilter(e.target.value)} placeholder={t("Find a conversation","စကားဝိုင်းရှာရန်")}/></label><div className="history-heading">TODAY <span>{threads.length}</span></div></>}
    <nav className="thread-history" aria-label="Conversation history">{threads.filter(t=>t.title.toLowerCase().includes(filter.toLowerCase())).map(t=><button key={t.id} className={`thread-item ${activeId===t.id?'active':''}`} onClick={()=>choose(t.id)} title={t.title}><MessageSquare size={16}/>{!compact&&<span>{t.title}</span>}</button>)}{!compact&&threads.length===0&&<p className="empty-history">{t('A space for your next idea.','သင့်စိတ်ကူးအသစ်အတွက် နေရာ။')}<br/>{t('Your conversations appear here.','သင့်စကားဝိုင်းများ ဤနေရာတွင် ပေါ်မည်။')}</p>}{!compact&&threads.length>0&&threads.filter(t=>t.title.toLowerCase().includes(filter.toLowerCase())).length===0&&<p className="empty-history">{t('No matching threads.','ကိုက်ညီသော စကားဝိုင်းမတွေ့ပါ။')}</p>}</nav>
    <div className="sidebar-footer">{!compact&&<div className="privacy-line"><ShieldCheck size={13}/><span>{t('Local to this tab. Refresh clears.','ဤ tab တွင်သာ။ Refresh လုပ်လျှင် ပျောက်မည်။')}</span></div>}<button className="workspace-profile" onClick={()=>settings.current?.showModal()} title="Workspace preferences"><span className="profile-avatar">Z</span>{!compact&&<span>{t('Guest workspace','ဧည့်သည် Workspace')}<small>PREVIEW · NO ACCOUNT</small></span>}{!compact&&<Settings2 size={16}/>}</button></div>
  </>;

  return <MotionConfig reducedMotion={reduced ? 'always':'user'}><div className={`spatial-app ${collapsed?'sidebar-compact':''} ${canvasOpen?'with-canvas':''} ${solid?'solid-surfaces':''} ${reduced?'still':''}`}>
    <a className="skip-chat" href="#composer">Skip to message input</a>
    <div className="ambient-mesh" aria-hidden="true"><i/><i/><i/></div>
    <motion.aside className="desktop-sidebar glass-panel" animate={{width:collapsed?80:260}} transition={spring}>{Sidebar({compact:collapsed})}<button className="sidebar-fold icon-button" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} title={collapsed?'Expand sidebar':'Collapse sidebar'}>{collapsed?<PanelLeftOpen size={16}/>:<PanelLeftClose size={16}/>}</button></motion.aside>
    <dialog ref={sidebarDialog} className="mobile-sidebar glass-panel" onCancel={()=>setMobileOpen(false)} onClose={closeMobile}><button className="mobile-sidebar-close icon-button" onClick={()=>setMobileOpen(false)} aria-label="Close sidebar"><X size={20}/></button>{Sidebar({})}</dialog>
    <main className="workspace-main" id="main">
      <header className="workspace-header glass-panel"><div className="header-context"><button ref={menuButton} className="mobile-menu icon-button" aria-label="Open sidebar" onClick={()=>setMobileOpen(true)}><PanelLeftOpen size={19}/></button><span className="breadcrumb">Workspace <span>/</span></span><button className="mode-pill" onClick={()=>modeDialog.current?.showModal()} aria-label="Preview response mode"><span className="status-dot"/>{t('Source demo','Demo အဖြေ')}<ChevronDown size={12}/></button></div><div className="header-actions"><button className="icon-button" onClick={toggleTheme} aria-label="Toggle light theme" aria-pressed={theme==='light'} title="Dark / Light">{theme==='dark'?'☼':'☾'}</button><span className="local-badge">DEMO · NO LIVE AI</span><button className="icon-button" title="Copy workspace link" aria-label="Copy workspace link" onClick={async()=>{try{await navigator.clipboard.writeText(location.origin+location.pathname);notify('Workspace link copied. Private messages are not included.');}catch{notify('Copy unavailable. Use your browser address bar.');}}}><Link2 size={17}/></button><button className="icon-button" title="Export conversation" aria-label="Export conversation" disabled={!messages.length} onClick={()=>active&&exportText('ZoLaiGPT-conversation.md',transcript(active))}><Download size={17}/></button><button className="icon-button" aria-label={canvasOpen?'Close canvas':'Open canvas'} aria-pressed={canvasOpen} title="Canvas" onClick={()=>setCanvasOpen(!canvasOpen)}><LayoutPanelLeft size={18}/></button></div></header>
      <div className={`chat-stage ${messages.length?'has-messages':''}`} ref={log}>
        <AnimatePresence mode="wait" initial={false}>{!messages.length ? <motion.section key="welcome" className="welcome-stage" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={spring}>
          <div className="welcome-orb"><span/><img src="/assets/zolaigpt-orb.webp" alt="ZoLaiGPT glowing orange glass core" width="160" height="160"/><i/></div>
          <div className="welcome-eyebrow"><span/> INTELLIGENCE, IN YOUR ELEMENT</div>
          <h1>{t('A little clarity.','ပိုမိုရှင်းလင်းသော အတွေးများ။')}<br/><span>{t('A world of possibility.','ဖြစ်နိုင်ခြေများစွာ။')}</span></h1><p className="welcome-description">{t('A thoughtful space for your ideas.','သင့်စိတ်ကူးများအတွက် နေရာ။')}<br className="desktop-break"/> Explore ZoLaiGPT in a new light.</p>
          <div className="starter-grid">{prompts.map((p,i)=><motion.button whileHover={reduced?{}:{y:-3,rotate:i%2?.35:-.35}} whileTap={reduced?{}:{scale:.985}} transition={spring} key={p.kind} className="starter-card glass-panel" onClick={()=>send(p.text)}><span className={`starter-icon icon-${i}`}>{i===0?<Globe2 size={19}/>:i===1?<Compass size={19}/>:i===2?<Sparkles size={19}/>:<Code2 size={19}/>}</span><span className="starter-title">{t(p.title,["ဘာသာစကားစုံ ကမ္ဘာ","ZoLaiGPT ရည်မှန်းချက်","နောက်အစီအစဉ်","Code နမူနာ"][i])}</span><span className="starter-caption">{t(p.caption,["အင်္ဂလိပ် · မြန်မာ · Zomi","လူသားတို့၏ ဖြစ်နိုင်ခြေ","အတည်ပြုထားသည့် သတင်းများ","Markdown နှင့် code နမူနာ"][i])}</span><ArrowUpRight className="starter-arrow" size={15}/></motion.button>)}</div>
          <span className="welcome-footnote"><ShieldCheck size={12}/> Original website copy · Simulated replies · No live AI</span>
        </motion.section> : <section key={activeId} className="conversation" aria-label="Chat conversation"><div className="conversation-date">TODAY <span>·</span> LOCAL PREVIEW</div>{messages.map((m,i)=><motion.div key={m.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={spring}><Message message={m} streaming={m.id===streamId} notify={notify} onRetry={()=>{if(job.current){notify('Stop the current reply first.');return;}const previous=messages.slice(0,i).reverse().find(x=>x.role==='user');if(previous&&activeId)beginReply(activeId,previous.content,m.id)}}/></motion.div>)}{streamId&&messages.find(m=>m.id===streamId)?.content===''&&<div className="thinking" role="status"><span/><span/><span/>{t('Preparing a scripted reply','ကြိုတင်ရေးထားသော အဖြေကို ပြနေသည်')}</div>}<div className="sr-only" role="status">{!streamId&&messages.at(-1)?.role==='assistant'?'Demo reply ready.':''}</div></section>}</AnimatePresence>
      </div>
      <div className="composer-area"><form id="composer" className="prompt-dock glass-panel" onSubmit={e=>{e.preventDefault();send()}}>
        {attachment&&<div className="attachment-pill"><Paperclip size={13}/><span>{attachment.name}</span><button type="button" onClick={()=>setAttachment(null)} aria-label="Remove attachment"><X size={14}/></button></div>}
        <label className="sr-only" htmlFor="prompt-input">Message ZoLaiGPT Preview</label><textarea ref={dock} id="prompt-input" value={input} onChange={e=>setInput(e.target.value)} placeholder={t("Where shall we begin?","ဘယ်ကနေ စကြမလဲ။")} maxLength={4000} rows={1} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send()}}}/>
        <div className="dock-tools"><div className="dock-left"><input ref={file} type="file" accept=".txt,.md,.json,.csv" className="sr-only" aria-label="Attach local text file" onChange={attach}/><button type="button" className="icon-button" title="Attach local text · up to 100 KB" aria-label="Attach local text" onClick={()=>file.current?.click()}><Plus size={19}/></button><span className="dock-divider"/><button type="button" className="search-disabled" aria-disabled="true" onClick={()=>notify('Web search is not connected in this local preview.')}><Globe2 size={13}/><span>{t('Web search','ဝဘ်ရှာဖွေမှု')}</span><small>OFF</small></button></div><div className="dock-right"><label className="sr-only" htmlFor="reply-language">Reply language</label><select id="reply-language" value={language} onChange={e=>changeLanguage(e.target.value)}><option value="en">English</option><option value="my">မြန်မာ</option><option value="zom">Zomi (Tedim)</option></select><button type="button" className={`icon-button wave-button ${wave?'wave-active':''}`} aria-label="Preview waveform animation" aria-pressed={wave} title="Visual waveform preview · no microphone" onClick={()=>{setWave(!wave);notify('Visual waveform only. No microphone or voice AI is connected.');}}>{wave?<span className="wave-bars" aria-hidden="true"><i/><i/><i/><i/><i/></span>:<AudioLines size={19}/>}</button>{streamId?<button type="button" className="send-button" onClick={stop} aria-label="Stop demo reply"><Square size={14} fill="currentColor"/></button>:<button type="submit" className="send-button" disabled={!hydrated||!input.trim()} aria-label="Send message"><ArrowUp size={19}/></button>}</div></div>
      </form><p className="composer-note"><span>{t('Preview only. Replies are prewritten, not live AI.','Demo သာဖြစ်သည်။ အဖြေများသည် ကြိုတင်ရေးထားပြီး Live AI မဟုတ်ပါ။')}</span><span className="shortcut-hint">Shift ↵ new line <b>·</b> ⌘ / Ctrl K focus</span></p></div>
    </main>
    <AnimatePresence>{canvasOpen&&<motion.aside className="canvas-panel glass-panel" initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:18}} transition={spring} aria-label="Personal canvas"><header><div><span className="section-eyebrow">YOUR SPACE</span><h2>Canvas</h2></div><button className="icon-button" onClick={()=>setCanvasOpen(false)} aria-label="Close canvas panel"><X size={18}/></button></header><p>{t('A little room to think. Notes stay in this tab.','အတွေးများကို မှတ်သားပါ။ မှတ်စုများသည် ဤ tab တွင်သာ ရှိသည်။')}</p><textarea aria-label="Canvas notes" value={notes} maxLength={20000} onChange={e=>setNotes(e.target.value)} placeholder={t("Capture an idea, shape a thought…","စိတ်ကူးကို မှတ်သားပါ…")}/><button className="glass-button" disabled={!notes.trim()} onClick={()=>exportText('ZoLaiGPT-notes.md',notes)}><Download size={15}/> Export notes</button></motion.aside>}</AnimatePresence>
    <dialog ref={settings} className="preferences glass-panel"><header><div><span className="section-eyebrow">MAKE IT YOURS</span><h2>{t('Workspace preferences','Workspace ရွေးချယ်မှုများ')}</h2></div><button className="icon-button" aria-label="Close preferences" onClick={()=>settings.current?.close()}><X size={18}/></button></header><label><span>{t('Still atmosphere','လှုပ်ရှားမှု ရပ်ရန်')}<small>{t('Pause ambient movement and transitions.','နောက်ခံလှုပ်ရှားမှုနှင့် အပြောင်းအလဲများ ရပ်ရန်။')}</small></span><input type="checkbox" checked={motionOff} onChange={e=>setMotionOff(e.target.checked)}/></label><label><span>{t('Solid glass surfaces','နောက်ခံဖောက်ထွင်းမှု လျှော့ရန်')}<small>{t('Reduce transparency and backdrop blur.','နောက်ခံဖောက်ထွင်းမှုနှင့် ဝါးမှုကို လျှော့ရန်။')}</small></span><input type="checkbox" checked={solid} onChange={e=>setSolid(e.target.checked)}/></label>{systemReduced&&<p>{t('Your system reduced-motion preference is respected.','စက်၏ reduced-motion ရွေးချယ်မှုကို လိုက်နာထားသည်။')}</p>}<div className="preferences-info"><ShieldCheck size={18}/><p>{t('No account, provider key or live AI connection. Threads, notes and attachments stay in memory and clear on refresh.','အကောင့်၊ API key နှင့် Live AI ချိတ်ဆက်မှုမရှိပါ။ စကားဝိုင်း၊ မှတ်စုနှင့် ဖိုင်များသည် မှတ်ဉာဏ်တွင်သာ ရှိပြီး refresh လုပ်လျှင် ပျောက်မည်။')}</p></div><button className="glass-button danger-button" disabled={!threads.length} onClick={()=>{stop();setThreads([]);setActiveId(null);settings.current?.close();notify('Local conversation history cleared.');}}><Trash2 size={15}/> Clear local conversations</button><a className="home-link" href="/">Back to ZoLaiGPT website <ArrowUpRight size={14}/></a></dialog>
    <dialog ref={modeDialog} className="preferences mode-dialog glass-panel"><header><h2>{t('Preview response mode','Demo အဖြေမုဒ်')}</h2><button className="icon-button" aria-label="Close response mode" onClick={()=>modeDialog.current?.close()}><X size={18}/></button></header><div className="source-mode"><span className="status-dot"/><div><strong>{t('Source demo','Demo အဖြေ')}</strong><p>{t('Original website content and a prewritten code sample. No model connection.','မူရင်းဝဘ်စာသားနှင့် ကြိုတင်ရေးထားသော code နမူနာ။ AI model မချိတ်ထားပါ။')}</p></div><Check size={17}/></div><p>{t('Live model choices will appear only after a secure server-side integration is ready.','လုံခြုံသော server ချိတ်ဆက်မှုပြီးမှ AI model ရွေးချယ်မှုများကို ပြမည်။')}</p></dialog>
    <AnimatePresence>{toast&&<motion.div className="workspace-toast glass-panel" role="status" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}><span>{toast}</span><button onClick={()=>setToast('')} aria-label="Dismiss notification"><X size={14}/></button></motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
