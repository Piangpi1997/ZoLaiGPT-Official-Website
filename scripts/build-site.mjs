#!/usr/bin/env node
// ZoLaiGPT static site generator. Zero dependencies (Node >= 18).
// Renders every website page from shared layout + content files and writes the
// deploy-ready HTML into the repository root, which Cloudflare Pages serves as-is.
//
//   node scripts/build-site.mjs
//
// Sources: content/apps/*.json, content/updates.json, content/social.json,
// src/legacy/*.html (guides and legal drafts), assets/js/translations.js.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://zolaigptofficial.com';
const ADSENSE_CLIENT = 'ca-pub-7075005129832926'; // Existing verified account. Do not change.
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const ASSET_V = '20261123c';
// Version every CSS/JS file a page pulls in (not only site.css/site.js): the old design used the
// same file names, and browsers kept serving their cached old copies of tokens.css, site-config.js…
for (const dir of ['assets/js', 'assets/css']) for (const f of fs.readdirSync(path.join(ROOT, dir))) {
  const file = path.join(ROOT, dir, f), src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/((?:from\s*|import\s*|@import\s+url\()['"])(\.\/[\w.-]+\.(?:js|css))(?:\?v=[\w]+)?(['"])/g, `$1$2?v=${ASSET_V}$3`);
  if (out !== src) fs.writeFileSync(file, out);
}

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJSON = p => JSON.parse(read(p));
const exists = p => fs.existsSync(path.join(ROOT, p.replace(/^\//, '')));
const write = (p, s) => { const f = path.join(ROOT, p); fs.mkdirSync(path.dirname(f), {recursive: true}); fs.writeFileSync(f, s); written.push(p); };
const written = [];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const {translations} = await import(pathToFileURL(path.join(ROOT, 'assets/js/translations.js')).href);
const t = key => { const v = translations.en[key]; if (v === undefined) throw new Error(`Missing translation key ${key}`); return `<span data-i="${key}">${esc(v)}</span>`; };

const apps = fs.readdirSync(path.join(ROOT, 'content/apps')).filter(f => f.endsWith('.json'))
  .map(f => readJSON(`content/apps/${f}`)).sort((a, b) => a.order - b.order);
const updates = readJSON('content/updates.json');
const social = readJSON('content/social.json');

// ---------------------------------------------------------------- icons
const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  languages: '<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
  sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6.5A2.5 2.5 0 0 0 4 20.5 2.5 2.5 0 0 0 6.5 23H20M8 7h8M8 11h6"/>',
  code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert: '<path d="M12 3 2 20h20zM12 10v4M12 17h.01"/>',
  android: '<path d="M7 10v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6zM7 9a5 5 0 0 1 10 0zM9.5 6.5 8 4M14.5 6.5 16 4M5 10v5M19 10v5"/>',
  apple: '<path d="M16 3c0 1.7-1.3 3-3 3 0-1.7 1.3-3 3-3zM18.5 16c-.8 1.9-2 4-3.6 4-1.2 0-1.6-.7-2.9-.7s-1.8.7-2.9.7C7.4 20 5 16.4 5 13c0-3 2-4.8 3.9-4.8 1.2 0 2.1.8 3.1.8s1.7-.8 3.2-.8c1.1 0 2.4.6 3.2 1.8-2.8 1.6-2.3 5.4.1 6z"/>',
  web: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>',
};
const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

// ---------------------------------------------------------------- status model
const STATUS = {
  'live': {label: 'Available', cls: 'live'},
  'preview': {label: 'Preview · Demo', cls: 'preview'},
  'beta': {label: 'Beta', cls: 'beta'},
  'in-development': {label: 'In development', cls: 'dev'},
  'archived': {label: 'Archived', cls: 'archived'},
};
const PLATFORM_LABEL = {android: 'Android', ios: 'iOS', web: 'Web'};
const PLATFORM_STATE = {available: 'Available', beta: 'Beta', planned: 'Planned', 'not-planned': null, 'not-applicable': null};
const statusBadge = s => `<span class="badge badge--${STATUS[s].cls}">${STATUS[s].label}</span>`;
const pricingBadge = p => p === 'free' ? '<span class="badge badge--plain">Free</span>' : p === 'paid' ? '<span class="badge badge--plain">Paid</span>' : '';
const platformList = app => {
  const items = Object.entries(app.platforms).filter(([, v]) => PLATFORM_STATE[v]).map(([k, v]) =>
    `<li data-available="${v === 'available'}">${icon(k === 'ios' ? 'apple' : k)} ${PLATFORM_LABEL[k]} · ${PLATFORM_STATE[v]}</li>`);
  return `<ul class="platforms" aria-label="Platforms">${items.join('')}</ul>`;
};
const appIcon = (app, cls = 'app-icon', size = 60) => app.icon
  ? `<img class="${cls}" src="${app.icon}" width="${size}" height="${size}" alt="" loading="lazy" decoding="async">`
  : `<span class="${cls} app-icon--glyph" aria-hidden="true">${icon(app.glyph || 'grid')}</span>`;
const latestRelease = app => app.releases?.[0] || null;
const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});

// ---------------------------------------------------------------- layout
const NAV = [
  {href: '/', label: 'Home', key: 'home', id: 'home'},
  {href: '/apps/', label: 'Apps', id: 'apps'},
  {href: '/chat/', label: 'AI Chat', id: 'chat'},
  {href: '/guides/', label: 'Learn', id: 'learn'},
  {href: '/about/', label: 'About', key: 'about', id: 'about'},
  {href: '/contact/', label: 'Contact', key: 'contact', id: 'contact'},
];

function head({title, description, canonical, robots, adsense, lang = 'en', ogType = 'website', jsonld = [], preloadDisplay = false}) {
  const ld = jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
${adsense ? `<meta name="google-adsense-account" content="${ADSENSE_CLIENT}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>
` : ''}<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#06050b">
<meta name="color-scheme" content="dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
${robots ? `<meta name="robots" content="${robots}">` : ''}
<meta property="og:site_name" content="ZoLaiGPT">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="${ogType}">
${canonical ? `<meta property="og:url" content="${canonical}">` : ''}
<meta property="og:image" content="${SITE}/assets/brand/og-image.jpg?v=mono">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/brand/favicon-48.png?v=mono" sizes="48x48" type="image/png">
<link rel="icon" href="/assets/brand/favicon-32.png?v=mono" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
${preloadDisplay ? '<link rel="preload" href="/assets/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>\n' : ''}<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_V}">
<script type="module" src="/assets/js/site.js?v=${ASSET_V}"></script>
${ld}
</head>`;
}

function header(active) {
  const items = NAV.map(n => `<li><a href="${n.href}"${n.id === active ? ' aria-current="page"' : ''}>${n.key ? t(n.key) : n.label}</a></li>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<aside class="announcement" id="announcement" aria-label="Website announcement" hidden>
<a href="/apps/">Browse the ZoLaiGPT Apps directory.</a>
<button class="announcement__close" type="button" aria-label="Dismiss announcement">×</button>
</aside>
<header class="site-header">
<div class="container">
<div class="site-header__bar">
<a class="brand" href="/" aria-label="ZoLaiGPT home"><img src="/assets/brand/zolaigpt-mark-white-64.webp" width="34" height="34" alt=""><span>ZoLai<b>GPT</b></span></a>
<nav class="site-nav" id="site-nav" aria-label="Main"><ul>${items}</ul></nav>
<div class="header-actions">
<label class="lang-select"><span class="sr-only">Language</span>${icon('languages')}<select id="lang" aria-label="Language"><option value="en">English</option><option value="my" lang="my">မြန်မာ</option><option value="zom" lang="ctd">Zomi (Tedim)</option></select></label>
<a class="btn btn--light btn--sm header-cta" href="/apps/">Our Apps</a>
<button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><span></span></button>
</div>
</div>
</div>
</header>`;
}

function footer() {
  const soc = social.map(s => `<a href="${esc(s.href)}" aria-label="${esc(s.name)}" title="${esc(s.name)}"${s.href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"'}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${s.path}"/></svg></a>`).join('');
  return `<footer class="site-footer">
<div class="container">
<div class="footer-grid">
<div class="footer-brand">
<a class="brand" href="/"><img src="/assets/brand/zolaigpt-mark-white-64.webp" width="34" height="34" alt=""><span>ZoLai<b>GPT</b></span></a>
<p>${t('footerline')} An independent multilingual AI and technology project for English, Myanmar and Zomi (Tedim).</p>
<div class="socials" aria-label="Social media">${soc}</div>
</div>
<div><h2>Explore</h2><ul><li><a href="/apps/">Apps</a></li><li><a href="/chat/">AI Chat (demo)</a></li><li><a href="/guides/">Learning Center</a></li><li><a href="/#updates">Updates</a></li></ul></div>
<div><h2>Project</h2><ul><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li><li><a href="/guides/editorial-standards">Editorial standards</a></li><li><a href="/guides/check-app-availability">Download safety</a></li></ul></div>
<div><h2>Legal (drafts)</h2><ul><li><a href="/privacy-policy.html">Privacy Policy</a></li><li><a href="/privacy-bm.html" lang="ms">Privasi (BM)</a></li><li><a href="/terms-of-use.html">Terms of Use</a></li></ul></div>
</div>
<div class="footer-bottom"><span>© <span data-year>${BUILD_DATE.slice(0, 4)}</span> ZoLaiGPT · Independent project, not an incorporated company.</span><span>Chat is a local demo · No live AI connected</span></div>
</div>
</footer>`;
}

const backdrop = (lines = true) => `<div class="backdrop" aria-hidden="true">
<div class="gridlines"></div><div class="spotlight"></div>
<div class="aurora aurora--violet"></div><div class="aurora aurora--blue"></div><div class="aurora aurora--ember"></div>
${lines ? linefield() : ''}
</div>`;

function linefield() {
  // Original abstract composition: flowing parallel curves with travelling light pulses.
  const paths = [];
  for (let i = 0; i < 9; i++) {
    const o = i * 26;
    paths.push(`M-40 ${420 - o} C 180 ${300 - o}, 320 ${520 - o * 1.2}, 520 ${360 - o} S 820 ${140 - o * .6}, 960 ${210 - o}`);
  }
  const base = paths.map((d, i) => `<path d="${d}" stroke="url(#lf-grad)" stroke-opacity="${(0.18 + i * 0.05).toFixed(2)}"/>`).join('');
  const pulses = paths.filter((_, i) => i % 2 === 0).map(d => `<path class="pulse" d="${d}" stroke="#fff" stroke-opacity=".55" stroke-linecap="round" stroke-width="1.5"/>`).join('');
  return `<svg class="linefield" viewBox="0 0 920 560" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="lf-grad" x1="0" x2="1"><stop offset="0" stop-color="#6d3cf5" stop-opacity="0"/><stop offset=".45" stop-color="#9d7bff"/><stop offset=".8" stop-color="#5b8dff"/><stop offset="1" stop-color="#ff8a3d" stop-opacity=".6"/></linearGradient></defs>${base}${pulses}</svg>`;
}

const page = (opts, body) => `${head(opts)}
<body>
${header(opts.active)}
<main id="main">
${body}
</main>
${footer()}
${opts.quickChat ? quickChatDialog() : ''}
</body>
</html>
`;

function pageHero({eyebrow, title, lead, crumbs = [], extra = ''}) {
  const bc = crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li><span aria-current="page">${esc(c.label)}</span></li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`).join('')}</ol></nav>` : '';
  return `<section class="page-hero">${backdrop(false)}<div class="container">${bc}<p class="eyebrow mt-5">${eyebrow}</p><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></section>`;
}

function quickChatDialog() {
  return `<dialog class="quick-chat" id="chat-panel" aria-labelledby="chat-title">
<div class="quick-chat__head"><img src="/assets/brand/zolaigpt-icon-64.webp" width="36" height="36" alt=""><div><h2 id="chat-title">ZoLaiGPT Assistant</h2><small><span class="badge--preview" aria-hidden="true">●</span> Preview · Local demo</small></div><button class="icon-btn" id="chat-close" type="button" aria-label="Close chat">×</button></div>
<div class="quick-chat__tools"><label class="sr-only" for="chat-lang">Reply language</label><select id="chat-lang"><option value="en">English</option><option value="my" lang="my">မြန်မာ</option><option value="zom" lang="ctd">Zomi (Tedim)</option></select><button id="chat-expand" type="button" aria-pressed="false">Expand</button><a class="btn btn--sm btn--ghost" href="/chat/">Full workspace ↗</a></div>
<p class="quick-chat__notice">Demo only: replies reuse existing website text. No live AI. Messages stay in this tab.</p>
<div class="quick-chat__log" id="chat-log" role="log" aria-live="polite" aria-label="Preview conversation"></div>
<div class="quick-prompts" aria-label="Quick prompts"><button type="button" data-prompt="f1d">Languages in focus</button><button type="button" data-prompt="aboutbody">About ZoLaiGPT</button><button type="button" data-prompt="appdesc">App status</button></div>
<p class="quick-chat__typing" id="chat-typing" role="status" hidden>Preparing a demo reply…</p>
<form id="chat-form"><label class="sr-only" for="chat-input">Your message</label><input id="chat-input" autocomplete="off" maxlength="1000" placeholder="Ask about ZoLaiGPT…" required><button type="submit" aria-label="Send message">↑</button></form>
</dialog>`;
}

// ---------------------------------------------------------------- components
function appCard(app, {headingLevel = 3, shot = false} = {}) {
  const rel = latestRelease(app);
  const platforms = Object.entries(app.platforms).filter(([, v]) => v === 'available' || v === 'beta' || v === 'planned').map(([k]) => k).join(' ');
  const s = shot && app.screenshots?.find(x => exists(x.src));
  return `<article class="card card--link app-card reveal" data-platforms="${platforms}" data-status="${app.status}">
${s ? `<div class="app-card__shot"><img src="${s.src}" alt="${esc(s.alt)}" width="1200" height="750" loading="lazy" decoding="async"></div>` : ''}
<div class="app-card__top">${appIcon(app)}<div><h${headingLevel}><a href="/apps/${app.slug}/" style="text-decoration:none">${esc(app.name)}</a></h${headingLevel}><span class="app-card__cat">${esc(app.category)}</span></div></div>
<p>${esc(app.tagline)}</p>
<div class="app-meta">${statusBadge(app.status)}${app.downloads?.some(d => d.signing === 'debug') ? '<span class="badge badge--draft">Test build</span>' : ''}${pricingBadge(app.pricing)}${rel ? `<span class="badge badge--plain">${/^\d/.test(rel.version) ? 'v' : ''}${esc(rel.version)}</span>` : '<span class="badge badge--plain">Not released</span>'}</div>
${platformList(app)}
<div class="card__foot"><a class="text-link" href="/apps/${app.slug}/">View details <span class="arrow">→</span></a>${rel ? `<span class="note-small">Updated ${fmtDate(rel.date)}</span>` : ''}</div>
</article>`;
}

// ---------------------------------------------------------------- pages
function homePage() {
  const featured = apps.filter(a => a.featured);
  const upd = updates.slice(0, 4).map((u, i) => `<article class="card update reveal" style="--delay:${i * 0.06}s"><time datetime="${u.date}">${fmtDate(u.date)}</time><h3>${esc(u.title)}</h3><p>${esc(u.body)}</p><div class="mt-5">${u.status === 'live' ? '<span class="badge badge--live">Published</span>' : u.status === 'draft' ? '<span class="badge badge--draft">Draft</span>' : '<span class="badge badge--preview">Preview</span>'}</div></article>`).join('');
  const body = `
<section class="hero" id="home" aria-labelledby="hero-title">
${backdrop()}
<div class="container hero__inner">
<p class="eyebrow hero-reveal" style="--delay:.05s">The future of multilingual AI</p>
<h1 class="hero__title" id="hero-title"><span class="line hero-reveal" style="--delay:.12s">ZoLaiGPT.</span><span class="line line--accent hero-reveal" style="--delay:.22s">Intelligence without boundaries.</span></h1>
<p class="hero__desc hero-reveal" style="--delay:.32s">Explore multilingual AI, innovative digital products, educational resources and the growing ZoLaiGPT ecosystem.</p>
<div class="hero__ctas hero-reveal" style="--delay:.42s"><a class="btn btn--primary" href="#ecosystem">${t('explore')} ${icon('arrow')}</a><a class="btn" href="/apps/">Discover Our Apps</a></div>
<p class="hero__langs hero-reveal" style="--delay:.5s" aria-label="Languages"><span>English</span><i></i><span lang="my">မြန်မာ</span><i></i><span lang="ctd">Zomi (Tedim)</span></p>
<dl class="hero__meta hero-reveal" style="--delay:.6s">
<div><dt>Languages in focus</dt><dd>3</dd></div>
<div><dt>Apps directory</dt><dd>${apps.length} listed</dd></div>
<div><dt>AI chat status</dt><dd>Demo · not live</dd></div>
</dl>
</div>
</section>

<section class="section" id="ecosystem" aria-labelledby="eco-title">
<div class="container">
<div class="section-head section-head--split">
<div class="stack"><p class="eyebrow">${t('why')}</p><h2 class="h-xl" id="eco-title">One ecosystem.<br><span class="text-gradient">Many languages.</span></h2></div>
<p>${t('featuredesc')}</p>
</div>
<div class="bento">
<article class="card span-4 reveal"><div class="feature-visual feature-visual--langs" aria-hidden="true"><span>Hello.</span><span lang="my">မင်္ဂလာပါ</span><span lang="ctd">Zomi (Tedim)</span></div><h3>${t('f1t')}</h3><p>${t('f1d')}</p></article>
<a class="card card--link span-2 tall reveal" style="--delay:.06s" href="/chat/"><div class="card__icon">${icon('message')}</div><h3>AI Chat workspace</h3><p>A browser-based conversation workspace with threads, notes and export. Replies are scripted demo content — clearly labelled, never presented as live AI.</p><div class="card__foot"><span class="badge badge--preview">Demo</span><span class="text-link">Open <span class="arrow">→</span></span></div></a>
<a class="card card--link span-2 reveal" href="/apps/"><div class="card__icon">${icon('grid')}</div><h3>Apps directory</h3><p>Every ZoLaiGPT product with honest release status, platforms and safe download rules.</p></a>
<a class="card card--link span-2 reveal" style="--delay:.06s" href="/guides/"><div class="card__icon">${icon('book')}</div><h3>Learning Center</h3><p>Practical guides on verifying downloads, reviewing multilingual AI and spotting real releases.</p></a>
<article class="card span-6 reveal"><div class="two-col" style="align-items:center;gap:2rem"><div class="stack"><div class="card__icon" style="margin:0">${icon('shield')}</div><h3>${t('f2t')}</h3><p>${t('f2d')} No hidden trackers in the chat demo, no API keys in the browser and no download without a checksum and an honest build label.</p></div><ul class="feature-list"><li>Status labels you can trust: Available, Preview, In development</li><li>SHA-256 checksums and signing details for every direct download</li><li>Draft legal texts are labelled as drafts</li></ul></div></article>
</div>
</div>
</section>

<section class="section section--tight" id="apps" aria-labelledby="apps-title">
<div class="container">
<div class="section-head section-head--split"><div class="stack"><p class="eyebrow">Apps showcase</p><h2 class="h-lg" id="apps-title">Built in the open. <span class="muted">Released when ready.</span></h2></div><div class="stack"><p>Products are listed with their real status. Every download shows its SHA-256 checksum and how it is signed; test builds are labelled as test builds.</p><a class="text-link" href="/apps/">See all apps <span class="arrow">→</span></a></div></div>
<div class="app-grid">${featured.map(a => appCard(a)).join('')}</div>
</div>
</section>

<section class="section" id="languages" aria-labelledby="lang-title">
<div class="container">
<div class="section-head"><p class="eyebrow">${t('languages')}</p><h2 class="h-lg" id="lang-title">Choose how the website speaks to you.</h2><p>Switch the interface language. Original Myanmar and draft Zomi (Tedim) translations are applied where reviewed copy exists; newer text stays in English until a fluent reviewer approves it.</p></div>
<div class="lang-row">
<button class="card lang-card reveal" type="button" data-language="en" aria-pressed="true"><small>01 / English</small><strong>Hello.</strong><span class="lang-card__foot">English</span></button>
<button class="card lang-card reveal" style="--delay:.06s" type="button" data-language="my" aria-pressed="false"><small>02 / Myanmar</small><strong lang="my">မင်္ဂလာပါ</strong><span class="lang-card__foot" lang="my">မြန်မာ</span></button>
<button class="card lang-card reveal" style="--delay:.12s" type="button" data-language="zom" aria-pressed="false"><small>03 / Zomi (Tedim)</small><strong>ZoLaiGPT</strong><span class="lang-card__foot" lang="ctd">Zomi (Tedim)</span></button>
</div>
<p class="note-small mt-5" id="translation-note" hidden>Showing existing reviewed translations. Untranslated text remains in English pending fluent-speaker review.</p>
</div>
</section>

<section class="section section--tight" id="assistant" aria-labelledby="chat-title-h">
<div class="container chat-teaser">
<div class="stack" style="--stack:1.25rem"><p class="eyebrow">AI Chat</p><h2 class="h-lg" id="chat-title-h">A conversation starts here.</h2><p class="muted">Explore the ZoLaiGPT chat workspace — threads, a notes canvas and Markdown export. It is an honest preview: replies are prewritten from website content and nothing is sent to an AI provider.</p><div class="cluster"><a class="btn btn--primary" href="/chat/">Open AI Chat ${icon('arrow')}</a><button class="btn" type="button" data-open-chat aria-haspopup="dialog" aria-expanded="false" aria-controls="chat-panel">Quick demo</button></div><p class="note-small">Local scripted demo · No live AI connection</p></div>
<div class="mock-chat reveal" aria-hidden="true">
<div class="mock-chat__bar"><span><img src="/assets/brand/zolaigpt-icon-64.webp" width="28" height="28" alt="">ZoLaiGPT</span><span class="badge badge--preview">Preview</span></div>
<p class="bubble bubble--user">What is ZoLaiGPT?</p>
<p class="bubble bubble--bot">${esc(translations.en.aboutbody)}</p>
<p class="bubble bubble--user" lang="my">ဘယ်ဘာသာစကားတွေ ရလဲ။</p>
<p class="bubble bubble--bot">${esc(translations.en.f1d)}</p>
<div class="mock-chat__composer"><span>Ask about ZoLaiGPT…</span><i>↑</i></div>
</div>
</div>
</section>

<section class="section" id="learn" aria-labelledby="learn-title">
<div class="container">
<div class="section-head section-head--split"><div class="stack"><p class="eyebrow">Learning &amp; developer resources</p><h2 class="h-lg" id="learn-title">Go beyond the headline.</h2></div><div class="stack"><p>Free, practical English guides. Learn how to verify information before you rely on it.</p><a class="text-link" href="/guides/">All learning guides <span class="arrow">→</span></a></div></div>
<div class="bento">
<a class="card card--link span-3 reveal" href="/guides/source-zip-verification"><div class="card__icon">${icon('hash')}</div><p class="eyebrow eyebrow--plain">Developer safety</p><h3 class="mt-4">Verify downloads with SHA-256</h3><p>Calculate a checksum on your device and understand what a matching hash does — and doesn't — prove.</p></a>
<a class="card card--link span-3 reveal" style="--delay:.06s" href="/guides/multilingual-ai-review"><div class="card__icon">${icon('languages')}</div><p class="eyebrow eyebrow--plain">AI language literacy</p><h3 class="mt-4">Review multilingual AI answers</h3><p>Check language match, factual accuracy and the need for native-speaker review.</p></a>
<a class="card card--link span-3 reveal" href="/guides/check-app-availability"><div class="card__icon">${icon('download')}</div><p class="eyebrow eyebrow--plain">Download safety</p><h3 class="mt-4">Source, beta or real release?</h3><p>Tell a signed app release apart from a source archive or an announcement.</p></a>
<a class="card card--link span-3 reveal" style="--delay:.06s" href="/guides/editorial-standards"><div class="card__icon">${icon('book')}</div><p class="eyebrow eyebrow--plain">Transparency</p><h3 class="mt-4">Editorial standards</h3><p>How guides are drafted with AI assistance, reviewed and corrected.</p></a>
</div>
</div>
</section>

<section class="section section--tight" id="updates" aria-labelledby="updates-title">
<div class="container">
<div class="section-head"><p class="eyebrow">${t('updatebadge')}</p><h2 class="h-lg" id="updates-title">Latest verified updates</h2><p>Only changes that actually happened. Dates come from the project's public history.</p></div>
<div class="updates">${upd}</div>
</div>
</section>

<section class="section" id="about" aria-labelledby="about-title">
<div class="container mission">
<div class="stack" style="--stack:1.5rem"><p class="eyebrow">${t('aboutlabel')}</p><blockquote id="about-title">${t('abouttitle')}</blockquote></div>
<div class="mission__body"><p>${t('aboutbody')}</p><p class="muted" style="font-size:var(--step-0)">ZoLaiGPT is an independent project run by an individual publisher. It is not an incorporated or registered company. <a class="text-link" href="/about/">Read more about the project <span class="arrow">→</span></a></p></div>
</div>
</section>

<section class="section section--tight" id="faq" aria-labelledby="faq-title">
<div class="container">
<div class="section-head"><p class="eyebrow">Questions, answered</p><h2 class="h-lg" id="faq-title">Before you begin.</h2></div>
<div class="faq">
<details><summary>Which languages are in focus?</summary><div><p>${t('f1d')}</p></div></details>
<details><summary>Is the chat connected to live AI?</summary><div><p>No. Both the quick demo and the <a class="text-link" href="/chat/">AI Chat workspace</a> use scripted replies based on existing website content. Messages stay in the current tab and are cleared on refresh.</p></div></details>
<details><summary>Can I download a ZoLaiGPT app?</summary><div><p>Yes — ZoLaiGPT for Android is available as a beta APK in the <a class="text-link" href="/apps/zolaigpt-android/">Apps directory</a>, with its version, release notes and SHA-256 checksum. Download it only from there.</p></div></details>
<details><summary>Who runs ZoLaiGPT?</summary><div><p>ZoLaiGPT is an independent project operated by an individual publisher, as described on the <a class="text-link" href="/about/">About page</a> and in the draft Privacy Policy.</p></div></details>
</div>
</div>
</section>

<section class="section section--tight" id="contact" aria-labelledby="contact-title">
<div class="container"><div class="cta-band reveal"><p class="eyebrow">${t('contactlabel')}</p><h2 class="h-lg" id="contact-title" style="max-width:20ch">${t('contacttitle')}</h2><p class="muted" style="max-width:40rem">${t('contactbody')}</p><div class="cluster"><a class="btn btn--light" href="/contact/">Contact ZoLaiGPT ${icon('arrow')}</a><a class="btn" href="https://github.com/Piangpi1997" target="_blank" rel="noopener noreferrer">${t('github')} ${icon('external')}</a></div></div></div>
</section>`;
  return page({
    title: 'ZoLaiGPT — Official Website', active: 'home', adsense: true, preloadDisplay: true, quickChat: true,
    description: 'ZoLaiGPT is an independent multilingual AI and technology project for English, Myanmar and Zomi (Tedim): apps, learning guides and an honest chat preview.',
    canonical: `${SITE}/`,
    jsonld: [
      {'@context': 'https://schema.org', '@type': 'WebSite', name: 'ZoLaiGPT Official Website', url: `${SITE}/`, inLanguage: ['en', 'my', 'ctd']},
      {'@context': 'https://schema.org', '@type': 'Organization', name: 'ZoLaiGPT', url: `${SITE}/`, logo: `${SITE}/assets/brand/icon-512.png?v=mono`, sameAs: social.filter(s => s.href.startsWith('https')).map(s => s.href)},
    ],
  }, body);
}

function appsPage() {
  const filters = [['all', 'All'], ['android', 'Android'], ['ios', 'iOS'], ['web', 'Web'], ['live', 'Available'], ['preview', 'Preview'], ['in-development', 'In development']]
    .map(([v, l], i) => `<button class="filter" type="button" data-filter="${v}" aria-pressed="${i === 0}">${l}</button>`).join('');
  const featured = apps.filter(a => a.featured);
  const cats = [...new Set(apps.map(a => a.category))];
  const body = `${pageHero({eyebrow: 'Apps Platform', title: 'Apps by <span class="text-gradient">ZoLaiGPT</span>', lead: 'The official directory of ZoLaiGPT products. Every listing shows its real release status — downloads show their SHA-256 checksum and whether they are a release build or a developer test build.', crumbs: [{label: 'Apps'}]})}
<section class="section section--tight" aria-labelledby="featured-title" style="padding-top:1rem">
<div class="container">
<h2 class="h-md" id="featured-title">Featured</h2>
<div class="app-grid mt-5">${featured.map(a => appCard(a, {shot: true})).join('')}</div>
</div>
</section>
<section class="section section--tight" aria-labelledby="all-title">
<div class="container">
<div class="section-head section-head--split"><div class="stack"><h2 class="h-md" id="all-title">All apps</h2><p class="note-small" id="app-count" aria-live="polite">${apps.length} apps shown</p></div><p class="note-small">Categories: ${cats.map(esc).join(' · ')}</p></div>
<div class="filters" id="app-filters" role="group" aria-label="Filter apps">${filters}</div>
<div class="app-grid" id="app-grid">${apps.map(a => appCard(a)).join('')}</div>
<p class="empty-note mt-5" id="app-empty" hidden>No apps match this filter yet.</p>
</div>
</section>
<section class="section section--tight" aria-labelledby="policy-title">
<div class="container"><div class="two-col">
<div class="card"><div class="card__icon">${icon('shield')}</div><h2 class="h-sm" id="policy-title">Our download policy</h2><ul class="feature-list mt-4"><li>Downloads are release-signed builds, official store listings, or developer test builds that are clearly labelled as such.</li><li>Direct downloads always show a SHA-256 checksum, the signing certificate and installation notes.</li><li>Source archives are never presented as installable apps.</li><li>Products from separate projects are not rebranded as ZoLaiGPT.</li></ul></div>
<div class="card"><div class="card__icon">${icon('info')}</div><h2 class="h-sm">Status labels</h2><dl class="spec-list mt-4" style="background:none;border:0;gap:.75rem">${Object.entries(STATUS).map(([k, v]) => `<div style="background:none;padding:0"><dt>${statusBadge(k)}</dt><dd class="muted mt-4" style="font-weight:400">${{live: 'Released and usable now.', preview: 'A working demo; not a finished product.', beta: 'Test release; may change or break.', 'in-development': 'Being built. No release or download yet.', archived: 'No longer maintained; kept for reference.'}[k]}</dd></div>`).join('')}</dl></div>
</div></div>
</section>`;
  return page({
    title: 'Apps — ZoLaiGPT', active: 'apps', description: 'The official ZoLaiGPT apps directory: release status, platforms, versions and safe download information for every ZoLaiGPT product.',
    canonical: `${SITE}/apps/`,
    jsonld: [{'@context': 'https://schema.org', '@type': 'CollectionPage', name: 'ZoLaiGPT Apps', url: `${SITE}/apps/`},
      breadcrumbLd([['Apps', '/apps/']])],
  }, body);
}

function breadcrumbLd(items) {
  return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ...items].map(([name, p], i) => ({'@type': 'ListItem', position: i + 1, name, item: `${SITE}${p}`}))};
}

function appDetailPage(app) {
  const rel = latestRelease(app);
  const shots = (app.screenshots || []).filter(s => exists(s.src));
  const heroShot = shots[0];
  const dl = app.downloads?.filter(d => d.url && d.signed && (d.type === 'store' || d.sha256)) || [];
  const primary = app.launchUrl
    ? `<a class="btn btn--primary" href="${app.launchUrl}">${esc(app.launchLabel || 'Open')} ${icon('arrow')}</a>`
    : dl.length ? '' : `<span class="btn" aria-disabled="true">${icon('download')} Not available yet</span>`;
  // /download/android always serves the newest release; the page refreshes these from /download/android.json.
  const live = d => d.url === '/download/android';
  const downloads = dl.map(d => `<a class="btn btn--primary" href="${esc(d.url)}"${d.type === 'store' ? ' target="_blank" rel="noopener noreferrer"' : ' download'}>${icon('download')} <span${live(d) ? ' data-latest="label"' : ''}>${esc(d.label)}</span></a>`).join('');
  const specs = [
    ['Status', statusBadge(app.status)],
    ['Version', rel ? (dl.some(live) ? `<span data-latest="version">${esc(rel.version)}</span>` : esc(rel.version)) : 'Not released'],
    ['Release date', rel ? `<time datetime="${rel.date}">${fmtDate(rel.date)}</time>` : '—'],
    ['Pricing', app.pricing === 'free' ? 'Free' : app.pricing === 'paid' ? 'Paid' : 'Not announced'],
    ['Category', esc(app.category)],
    ['Support', `<a href="mailto:${esc(app.supportEmail)}">${esc(app.supportEmail)}</a>`],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  const checksums = dl.filter(d => d.sha256).map(d => `<div><dt>SHA-256 · <span${live(d) ? ' data-latest="label"' : ''}>${esc(d.label)}</span></dt><dd class="mono"${live(d) ? ' data-latest="sha256"' : ''}>${esc(d.sha256)}</dd></div>`).join('');
  const signing = dl.filter(d => d.certificate).map(d => `<div><dt>Signing certificate</dt><dd>${esc(d.certificate)}${d.signing === 'debug' ? ' — <strong>Android debug key (test build)</strong>' : ''}<br><span class="mono note-small">SHA-256 ${esc(d.certificateSha256 || '')}</span></dd></div>`).join('');
  const testBuild = dl.some(d => d.signing === 'debug');
  const body = `<section class="page-hero">${backdrop(false)}<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/apps/">Apps</a></li><li><span aria-current="page">${esc(app.name)}</span></li></ol></nav>
<div class="app-hero mt-6">
<div>
${app.icon ? `<img class="app-hero__icon" src="${app.icon}" width="88" height="88" alt="">` : `<span class="app-icon app-icon--glyph app-hero__icon" aria-hidden="true">${icon(app.glyph || 'grid')}</span>`}
<div class="cluster">${statusBadge(app.status)}${pricingBadge(app.pricing)}</div>
<h1 style="margin-top:1rem">${esc(app.name)}</h1>
<p class="lead">${esc(app.tagline)}</p>
<div class="cluster mt-6">${primary}${downloads}<a class="btn btn--ghost" href="/apps/">All apps</a></div>
<div class="mt-5">${platformList(app)}</div>
</div>
<div class="app-hero__media">${heroShot ? `<img src="${heroShot.src}" alt="${esc(heroShot.alt)}" width="1200" height="750" fetchpriority="high">` : `<div class="app-hero__placeholder"><img src="${app.icon || '/assets/brand/zolaigpt-icon-256.webp'}" width="96" height="96" alt=""><p>No screenshots yet.<br>Screenshots are added only from real builds.</p></div>`}</div>
</div></div></section>

<section class="section section--tight" style="padding-top:1rem"><div class="container">
${app.status === 'in-development' ? `<div class="notice">${icon('alert')}<p><strong>Not released.</strong> There is no official download, store listing or beta for this app yet. Do not trust files or websites claiming otherwise.</p></div>` : ''}
${app.status === 'preview' ? `<div class="notice notice--info">${icon('info')}<p><strong>Preview.</strong> This is a working demo, not a finished product. It is not connected to a live AI service.</p></div>` : ''}
${testBuild ? `<div class="notice">${icon('alert')}<p><strong>Developer test build.</strong> This APK is signed with the Android <em>debug</em> key, not a private release key, and debugging is enabled. It is for testing only. A release-signed build will replace it; you will need to uninstall the test build once before installing that release.</p></div>` : ''}
<dl class="spec-list mt-6">${specs}${checksums}${signing}</dl>
</div></section>

<section class="section section--tight"><div class="container two-col">
<div class="card"><h2 class="h-sm">About</h2><p class="mt-4">${esc(app.description)}</p></div>
<div class="card"><h2 class="h-sm">Features</h2><ul class="feature-list mt-4">${app.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
</div></section>

${shots.length ? `<section class="section section--tight" aria-labelledby="shots-title"><div class="container"><h2 class="h-md" id="shots-title">Screenshots</h2><div class="shots mt-5" tabindex="0" aria-label="Screenshots, scroll horizontally">${shots.map(s => `<figure><img src="${s.src}" alt="${esc(s.alt)}" loading="lazy" decoding="async" width="1200" height="750"><figcaption>${esc(s.caption || '')}</figcaption></figure>`).join('')}</div></div></section>` : ''}

<section class="section section--tight"><div class="container two-col">
<div class="card"><h2 class="h-sm">Requirements &amp; installation</h2>${app.requirements.length ? `<ul class="feature-list mt-4">${app.requirements.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : '<p class="mt-4">Requirements will be published with the first release.</p>'}${app.installation.length ? `<ul class="feature-list mt-4">${app.installation.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}${dl.some(d => d.sha256) ? `<p class="note-small mt-4">Before installing, compare the SHA-256 checksum above. <a class="text-link" href="/guides/source-zip-verification">How to verify</a></p>` : ''}</div>
<div class="card"><h2 class="h-sm">Privacy &amp; support</h2><p class="mt-4">${esc(app.privacyNote)}</p><ul class="feature-list mt-4">${app.privacyUrl ? `<li><a class="text-link" href="${app.privacyUrl}">Privacy Policy (draft)</a></li>` : '<li>App privacy notice: not yet published</li>'}${app.termsUrl ? `<li><a class="text-link" href="${app.termsUrl}">Terms of Use (draft)</a></li>` : ''}<li>Support: <a class="text-link" href="mailto:${esc(app.supportEmail)}">${esc(app.supportEmail)}</a></li></ul></div>
</div></section>

<section class="section section--tight" aria-labelledby="changelog-title"><div class="container">
<h2 class="h-md" id="changelog-title">Version history</h2>
${app.releases.length ? `<ol class="changelog mt-5">${app.releases.map(r => `<li><header><h3>${esc(r.version)}</h3><span class="badge badge--${r.channel === 'stable' ? 'live' : r.channel === 'beta' ? 'beta' : 'preview'}">${esc(r.channel)}</span><time datetime="${r.date}">${fmtDate(r.date)}</time></header><ul>${r.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></li>`).join('')}</ol>` : '<p class="empty-note mt-5">No releases yet.</p>'}
</div></section>

${app.faq?.length ? `<section class="section section--tight"><div class="container"><h2 class="h-md">FAQ</h2><div class="faq mt-5">${app.faq.map(f => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('')}</div></div></section>` : ''}`;
  const ld = {'@context': 'https://schema.org', '@type': 'SoftwareApplication', name: app.name, applicationCategory: app.category, description: app.description, url: `${SITE}/apps/${app.slug}/`,
    operatingSystem: Object.entries(app.platforms).filter(([, v]) => v === 'available' || v === 'beta').map(([k]) => PLATFORM_LABEL[k]).join(', ') || undefined};
  if (rel) { ld.softwareVersion = rel.version; ld.datePublished = rel.date; }
  if (app.pricing === 'free' && app.status !== 'in-development') ld.offers = {'@type': 'Offer', price: '0', priceCurrency: 'USD'};
  return page({
    title: `${app.name} — ZoLaiGPT Apps`, active: 'apps', description: app.tagline, canonical: `${SITE}/apps/${app.slug}/`,
    jsonld: app.status === 'in-development' ? [breadcrumbLd([['Apps', '/apps/'], [app.name, `/apps/${app.slug}/`]])] : [ld, breadcrumbLd([['Apps', '/apps/'], [app.name, `/apps/${app.slug}/`]])],
  }, body);
}

function aboutPage() {
  const body = `${pageHero({eyebrow: t('aboutlabel'), title: t('abouttitle'), lead: t('aboutbody'), crumbs: [{label: 'About'}]})}
<section class="section section--tight"><div class="container">
<div class="bento">
<article class="card span-3 reveal"><div class="card__icon">${icon('compass')}</div><h2 class="h-sm">Mission</h2><p class="mt-4">Make technology understand more of us — by building and documenting multilingual AI experiences for English, Myanmar and Zomi (Tedim) speakers, and by teaching people how to evaluate AI and software claims responsibly.</p></article>
<article class="card span-3 reveal" style="--delay:.06s"><div class="card__icon">${icon('info')}</div><h2 class="h-sm">Independent-project status</h2><p class="mt-4">ZoLaiGPT is the public brand of an independent AI and technology project, operated by <strong>Thang Piang</strong> as an individual publisher. It is <strong>not</strong> an incorporated company and is not registered with SSM (Companies Commission of Malaysia).</p></article>
<article class="card span-2 reveal"><div class="card__icon">${icon('layers')}</div><h2 class="h-sm">What exists today</h2><ul class="feature-list mt-4"><li>This website and learning guides</li><li>A local, scripted chat demo</li><li>A browser SHA-256 tool</li></ul></article>
<article class="card span-2 reveal" style="--delay:.06s"><div class="card__icon">${icon('code')}</div><h2 class="h-sm">In development</h2><ul class="feature-list mt-4"><li>ZoLaiGPT for Android (unreleased)</li><li>A secured server-side AI backend (not connected)</li></ul></article>
<article class="card span-2 reveal" style="--delay:.12s"><div class="card__icon">${icon('shield')}</div><h2 class="h-sm">Honesty rules</h2><ul class="feature-list mt-4"><li>No fake downloads or reviews</li><li>Demos are labelled as demos</li><li>Draft legal text is labelled draft</li></ul></article>
</div>
</div></section>
<section class="section section--tight"><div class="container prose" style="margin-inline:0">
<h2>Languages and translation</h2>
<p>English is the primary language of this website. Myanmar interface text comes from the original reviewed dictionary. Zomi (Tedim) text is a draft that requires fluent-speaker review, and newer text remains in English until reviewed. We would rather show English than an unverified translation.</p>
<h2>Advertising</h2>
<p>The homepage and learning guides include Google's AdSense code and an ownership-verification tag for the site's existing AdSense account. Advertising decisions, eligibility and approval are made by Google; nothing on this site promises approval or income. See the <a href="/privacy-policy.html">Privacy Policy (draft)</a>.</p>
<h2>Corrections</h2>
<p>Found something inaccurate? Please <a href="/contact/">contact us</a> — see our <a href="/guides/editorial-standards">editorial standards</a> for how corrections are handled.</p>
</div></section>`;
  return page({title: 'About ZoLaiGPT — Independent multilingual AI project', active: 'about', description: 'About ZoLaiGPT: mission, independent-project status, what exists today and what is still in development.', canonical: `${SITE}/about/`, jsonld: [breadcrumbLd([['About', '/about/']])]}, body);
}

function contactPage() {
  const pick = n => social.find(s => s.name === n);
  const email = pick('Email');
  const body = `${pageHero({eyebrow: t('contactlabel'), title: 'Get in touch.', lead: 'Questions, corrections, privacy requests or partnership ideas — email is the most reliable way to reach the ZoLaiGPT project.', crumbs: [{label: 'Contact'}]})}
<section class="section section--tight"><div class="container">
<div class="contact-grid">
<a class="card card--link contact-card reveal" href="${esc(email.href)}"><div class="card__icon">${icon('mail')}</div><h2 class="h-sm">Email</h2><p>Best for questions, corrections and privacy requests.</p><span class="value">${esc(email.href.replace('mailto:', ''))}</span></a>
<a class="card card--link contact-card reveal" style="--delay:.06s" href="${esc(pick('GitHub').href)}" target="_blank" rel="noopener noreferrer"><div class="card__icon">${icon('code')}</div><h2 class="h-sm">GitHub</h2><p>Source code and technical feedback.</p><span class="value">github.com/Piangpi1997</span></a>
<a class="card card--link contact-card reveal" style="--delay:.12s" href="${esc(pick('Discord').href)}" target="_blank" rel="noopener noreferrer"><div class="card__icon">${icon('message')}</div><h2 class="h-sm">Discord</h2><p>Community conversation. Invite links can expire.</p><span class="value">Join the server ↗</span></a>
</div>
<div class="card mt-6"><h2 class="h-sm">Social profiles</h2><p class="mt-4">${t('contactbody')}</p><div class="socials">${social.map(s => `<a href="${esc(s.href)}" aria-label="${esc(s.name)}" title="${esc(s.name)}"${s.href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"'}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${s.path}"/></svg></a>`).join('')}</div></div>
<div class="notice notice--info mt-6">${icon('info')}<p>Please do not send passwords, ID documents or payment details. ZoLaiGPT never asks for them. Messages you send by email or social platforms are handled under those services' own privacy policies and the draft <a class="text-link" href="/privacy-policy.html">ZoLaiGPT Privacy Policy</a>.</p></div>
</div></section>`;
  return page({title: 'Contact — ZoLaiGPT', active: 'contact', description: 'Contact the ZoLaiGPT project by email, GitHub, Discord or social media.', canonical: `${SITE}/contact/`, jsonld: [breadcrumbLd([['Contact', '/contact/']])]}, body);
}

function legacyPage(file) {
  const raw = read(`src/legacy/${file}`);
  const m = raw.match(/^<!--meta (\{.*\}) -->\n/);
  const meta = JSON.parse(m[1]);
  let content = raw.slice(m[0].length);
  const scripts = meta.scripts.map(s => `<script src="${s}" defer></script>`).join('');
  const isGuideIndex = meta.out === 'guides/index.html';
  const crumbs = meta.section === 'learn'
    ? (isGuideIndex ? [['Learn', null]] : [['Learn', '/guides/'], [meta.title.split('|')[0].trim(), null]])
    : [[meta.title.split('|')[0].trim(), null]];
  const bc = `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${crumbs.map(([l, h]) => h ? `<li><a href="${h}">${esc(l)}</a></li>` : `<li><span aria-current="page">${esc(l)}</span></li>`).join('')}</ol></nav>`;
  const body = `<section class="page-hero" style="padding-bottom:0">${backdrop(false)}<div class="container">${bc}</div></section>
<div class="section section--tight" style="padding-top:2rem"><div class="container"><div class="prose ${meta.mainClass}" lang="${meta.lang}">
${content}
</div></div></div>${scripts}`;
  const out = page({title: meta.title, description: meta.description, canonical: meta.canonical, robots: meta.robots, adsense: meta.adsense, lang: meta.lang, active: meta.section === 'learn' ? 'learn' : null}, body);
  return [meta.out, out, meta];
}

function notFoundPage() {
  const body = `<section class="page-hero">${backdrop(false)}<div class="container"><p class="eyebrow">Error 404</p><h1>This page drifted off.</h1><p class="lead">The page you requested does not exist or may have moved.</p><div class="cluster mt-6"><a class="btn btn--primary" href="/">Homepage ${icon('arrow')}</a><a class="btn" href="/apps/">Apps</a><a class="btn" href="/guides/">Learning guides</a></div></div></section>`;
  return page({title: 'Page not found | ZoLaiGPT', description: 'The page you requested could not be found on the ZoLaiGPT official website.', robots: 'noindex'}, body);
}

// ---------------------------------------------------------------- build
write('index.html', homePage());
write('apps/index.html', appsPage());
for (const app of apps) write(`apps/${app.slug}/index.html`, appDetailPage(app));
write('about/index.html', aboutPage());
write('contact/index.html', contactPage());
write('404.html', notFoundPage());
const legacy = [];
for (const f of fs.readdirSync(path.join(ROOT, 'src/legacy')).filter(f => f.endsWith('.html')).sort()) {
  const [out, html, meta] = legacyPage(f); write(out, html); legacy.push(meta);
}

// Sitemap: indexable pages only (legal drafts, chat and QA routes stay noindex).
const urls = [
  ['/', BUILD_DATE], ['/apps/', BUILD_DATE], ...apps.map(a => [`/apps/${a.slug}/`, BUILD_DATE]), ['/about/', BUILD_DATE], ['/contact/', BUILD_DATE],
  ...legacy.filter(m => !m.robots?.includes('noindex') && m.canonical).map(m => [m.canonical.replace(SITE, ''), BUILD_DATE]),
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `  <url><loc>${SITE}${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}
</urlset>
`);
write('site.webmanifest', JSON.stringify({name: 'ZoLaiGPT', short_name: 'ZoLaiGPT', start_url: '/', display: 'standalone', background_color: '#06050b', theme_color: '#06050b',
  icons: [{src: '/assets/brand/icon-192.png', sizes: '192x192', type: 'image/png'}, {src: '/assets/brand/icon-512.png', sizes: '512x512', type: 'image/png'}]}, null, 2) + '\n');
console.log(`Built ${written.length} files:\n  ${written.join('\n  ')}`);
