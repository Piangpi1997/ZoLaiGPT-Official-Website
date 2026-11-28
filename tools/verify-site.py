"""Static checks for the ZoLaiGPT website. Run: python3 tools/verify-site.py
Checks every generated HTML page for broken local links/anchors, duplicate IDs, missing alt
attributes, CSS asset references, token contrast, AdSense/ads.txt preservation, sitemap
targets, app release safety rules and leftover globe/orb code."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, json
ROOT = Path(__file__).resolve().parents[1]
SKIP = ('chat-workspace', 'node_modules', '.git', 'docs', 'src')

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids = []; self.refs = []; self.social = []; self.imgs_no_alt = 0; self.h1 = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h1': self.h1 += 1
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'img' and 'alt' not in a: self.imgs_no_alt += 1
        for attr in ('src', 'href'):
            if attr in a and a[attr] is not None: self.refs.append(a[attr])
        if tag == 'a' and a.get('aria-label') in ('Facebook','Instagram','Threads','TikTok','X / Twitter','Discord','LinkedIn','GitHub','WhatsApp','Email'):
            self.social.append(a.get('aria-label'))

def resolve(page, ref):
    u = urlsplit(ref)
    p = unquote(u.path)
    t = (ROOT / p.lstrip('/')) if p.startswith('/') else page.parent / p
    if t.is_dir(): t = t / 'index.html'
    elif not t.exists() and t.with_suffix('.html').is_file(): t = t.with_suffix('.html')  # Pages serves /x as /x.html
    return t, u.fragment

errors, checked, pages = [], 0, []
for path in sorted(ROOT.rglob('*.html')):
    rel = path.relative_to(ROOT)
    if rel.parts[0] in SKIP or (rel.parts[0] == 'chat' and rel.name != 'index.html') or rel.parts[0] == 'chat' and len(rel.parts) > 2: continue
    pages.append(path)
cache = {}
def parse(path):
    if path not in cache:
        p = Page(); p.feed(path.read_text(encoding='utf8')); cache[path] = p
    return cache[path]
for path in pages:
    p = parse(path); rel = path.relative_to(ROOT)
    if len(p.ids) != len(set(p.ids)): errors.append(f'{rel}: duplicate IDs {sorted({i for i in p.ids if p.ids.count(i)>1})}')
    if p.imgs_no_alt: errors.append(f'{rel}: {p.imgs_no_alt} <img> without alt')
    if rel.parts[0] != 'chat' and not rel.name.startswith('qa') and p.h1 != 1 and rel.name != 'google27cd9c0b1b99680c.html': errors.append(f'{rel}: expected one <h1>, found {p.h1}')
    for ref in p.refs:
        checked += 1
        u = urlsplit(ref)
        if u.scheme or u.netloc or ref.startswith('mailto:'): continue
        if not u.path:
            if u.fragment and u.fragment not in p.ids: errors.append(f'{rel}: missing anchor #{u.fragment}')
            continue
        # Routes served by a Cloudflare Pages Function (functions/<path>.js) are not files.
        if u.path.startswith('/') and (ROOT / 'functions' / (u.path.strip('/') + '.js')).is_file(): continue
        target, frag = resolve(path, ref)
        if not target.is_file(): errors.append(f'{rel}: missing {ref}'); continue
        if frag and target.suffix == '.html' and frag not in parse(target).ids: errors.append(f'{rel}: missing anchor {ref}')
for css in (ROOT / 'assets/css').glob('*.css'):
    for ref in re.findall(r"url\(['\"]?([^)'\"]+)", css.read_text()):
        if not ref.startswith('data:') and not urlsplit(ref).scheme and not (css.parent / urlsplit(ref).path).is_file(): errors.append(f'{css.name}: missing {ref}')
def lum(c):
    v = [int(c[i:i+2], 16) / 255 for i in (1, 3, 5)]
    v = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in v]
    return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]
def contrast(a, b):
    a, b = sorted([lum(a), lum(b)]); return (b + .05) / (a + .05)
tokens = {}
for k, v in re.findall(r'--(text|text-soft|muted|faint|bg|bg-raised):(#[0-9a-f]{6})', (ROOT / 'assets/css/tokens.css').read_text()): tokens.setdefault(k, v)  # default theme only
ratios = {k: round(contrast(tokens[k], tokens['bg']), 2) for k in ('text', 'text-soft', 'muted', 'faint')}
ratios_raised = {k: round(contrast(tokens[k], tokens['bg-raised']), 2) for k in ('text', 'muted', 'faint')}
for k in ('text', 'text-soft', 'muted'):
    if ratios[k] < 4.5: errors.append(f'token --{k} contrast {ratios[k]} < 4.5')
if ratios_raised['faint'] < 4.5: errors.append(f'token --faint contrast {ratios_raised["faint"]} < 4.5 on raised surfaces')
home = (ROOT / 'index.html').read_text()
if '<meta name="google-adsense-account" content="ca-pub-7075005129832926">' not in home: errors.append('AdSense ownership meta missing on homepage')
if (ROOT / 'ads.txt').read_text().strip() != 'google.com, pub-7075005129832926, DIRECT, f08c47fec0942fa0': errors.append('ads.txt changed')
if '<ins class="adsbygoogle"' in ''.join(p.read_text() for p in pages): errors.append('Manual ad units found; ad serving must stay off until approved')
if len(parse(ROOT / 'index.html').social) != 9: errors.append('Expected the 9 social/contact links on the homepage')
for loc in re.findall(r'<loc>https://zolaigptofficial.com(/[^<]*)</loc>', (ROOT / 'sitemap.xml').read_text()):
    t, _ = resolve(ROOT / 'index.html', loc)
    if not t.is_file(): errors.append(f'sitemap: missing {loc}')
    elif 'noindex' in t.read_text(): errors.append(f'sitemap lists noindex page {loc}')
for f in (ROOT / 'content/apps').glob('*.json'):
    app = json.loads(f.read_text())
    for d in app.get('downloads', []):
        if d.get('type') != 'store' and not re.fullmatch(r'[0-9a-f]{64}', d.get('sha256', '')): errors.append(f'{f.name}: direct download without SHA-256')
        if not d.get('signed'): errors.append(f'{f.name}: download is not signed')
        if d.get('type') != 'store' and d.get('signing') not in ('release', 'debug'): errors.append(f'{f.name}: download must state signing (release or debug)')
        if d.get('signing') == 'debug' and 'test' not in d.get('label', '').lower(): errors.append(f'{f.name}: debug-signed download must be labelled as a test build')
    if app['status'] == 'in-development' and app.get('downloads'): errors.append(f'{f.name}: unreleased app lists downloads')
leftovers = [str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and not set(p.relative_to(ROOT).parts) & {'.git', 'node_modules', 'docs', '.next', 'out', 'tools'}
             and p.suffix in ('.html', '.js', '.css', '.tsx', '.mjs') and re.search(r'zolaigpt-orb|three\.module|hero-orb|universe-orb|globe\.js|orb-stage', p.read_text(errors='ignore'))]
if leftovers: errors.append(f'globe/orb references remain: {leftovers}')
print(json.dumps({'pages_checked': len(pages), 'references_checked': checked, 'contrast_on_bg': ratios, 'contrast_on_raised': ratios_raised, 'errors': errors}, indent=2))
raise SystemExit(bool(errors))
