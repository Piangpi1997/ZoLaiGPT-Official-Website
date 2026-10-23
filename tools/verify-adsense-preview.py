#!/usr/bin/env python3
"""Offline QA for the ZoLaiGPT AdSense-readiness PREVIEW (no network).
Run from the repository: python3 tools/verify-adsense-preview.py
This cannot establish Google approval, live headers, human review or mobile-browser PASS.
"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    'index.html',
    'guides/index.html',
    'guides/source-zip-verification.html',
    'guides/multilingual-ai-review.html',
    'guides/check-app-availability.html',
    'guides/about-this-website.html',
    'guides/privacy-and-advertising.html',
    'guides/editorial-standards.html',
]
errors = []
links_checked = 0

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.references, self.metas, self.scripts = [], [], [], []

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if a.get('id'):
            self.ids.append(a['id'])
        for key in ('href', 'src'):
            if a.get(key):
                self.references.append(a[key])
        if tag == 'meta':
            self.metas.append(a)
        if tag == 'script' and a.get('src'):
            self.scripts.append(a['src'])

def resolve_reference(page, ref):
    if ref.startswith(('#', '//')):
        return None
    u = urlsplit(ref)
    if u.scheme or u.netloc or not u.path:
        return None
    path = unquote(u.path)
    target = ROOT / path.lstrip('/') if path.startswith('/') else page.parent / path
    target = target.resolve()
    if not target.is_relative_to(ROOT.resolve()):
        errors.append(f'Reference escapes the repository: {page.relative_to(ROOT)} -> {ref}')
        return None
    if target.is_dir():
        target /= 'index.html'
    return target

parsed = {}
for name in PAGES:
    page = ROOT / name
    if not page.is_file():
        errors.append('Missing required page: ' + name)
        continue
    text = page.read_text(encoding='utf-8')
    parser = PageParser()
    parser.feed(text)
    parsed[name] = (text, parser)
    for id_value, count in Counter(parser.ids).items():
        if count > 1:
            errors.append(f'Duplicate HTML ID: {name}#{id_value} ({count})')
    for ref in parser.references:
        target = resolve_reference(page, ref)
        if target is not None:
            links_checked += 1
            if not target.is_file():
                errors.append(f'Broken local link or asset: {name} -> {ref}')
    if not any(m.get('name', '').lower() == 'robots'
               and 'noindex' in m.get('content', '').lower()
               for m in parser.metas):
        errors.append('Missing preview noindex meta: ' + name)
    if any('adsbygoogle' in value or 'googlesyndication.com' in value
           for value in parser.scripts):
        errors.append('Unexpected Google ad script on preview: ' + name)
    if name.startswith('guides/') and name != 'guides/index.html':
        if not ('Editorial review needed' in text or 'Preview disclosure:' in text):
            errors.append('Missing human-review or preview notice: ' + name)
    if name.startswith('guides/') and not re.search(r'<h1(?:\\s|>)', text, re.I):
        errors.append('Missing guide H1: ' + name)

headers = ROOT / '_headers'
if not headers.is_file() or not re.search(
        r'(?m)^/\\*\\s*\\n\\s*X-Robots-Tag:\\s*noindex,\\s*nofollow',
        headers.read_text(encoding='utf-8')):
    errors.append('Preview-wide X-Robots-Tag noindex header is absent')
styles = ROOT / 'styles.css'
if not styles.is_file():
    errors.append('styles.css is missing')
else:
    entry = styles.read_text(encoding='utf-8')
    if 'knowledge-guides.css' not in entry:
        errors.append('Guide stylesheet missing from CSS imports')
    for import_name in re.findall(r"@import\\s+url\\(['\\\"]([^'\\\"]+)", entry):
        target = resolve_reference(styles, import_name)
        if target is not None and not target.is_file():
            errors.append('Missing imported CSS file: ' + import_name)
config = ROOT / 'assets/js/site-config.js'
if not config.is_file() or "channel:'Audit Preview'" not in config.read_text(encoding='utf-8'):
    errors.append('Audit Preview version label is missing')

# The local file checker must show the exact checksum on the source download page.
guide = (ROOT / 'guides/source-zip-verification.html')
download = (ROOT / 'downloads/melmuh-tongluan/index.html')
checker = (ROOT / 'guides/local-sha256.js')
if not checker.is_file():
    errors.append('Local SHA-256 checker script missing')
elif guide.is_file() and download.is_file():
    widget = guide.read_text(encoding='utf-8')
    source = download.read_text(encoding='utf-8')
    m = re.search(r'id="local-hash-expected">\\s*([0-9a-f]{64})', widget, re.I)
    if not m:
        errors.append('Local checker reference digest missing')
    elif m.group(1).lower() not in source.lower():
        errors.append('Local checker digest differs from download page')
    if 'src="local-sha256.js"' not in widget:
        errors.append('Local checker is not loaded by guide')
    script = checker.read_text(encoding='utf-8')
    if "crypto.subtle.digest('SHA-256'" not in script:
        errors.append('Browser checker does not use Web Crypto SHA-256')
    # Do not infer no-network privacy from comments. Check executable requests.
    if re.search(r'\\b(?:fetch|XMLHttpRequest|sendBeacon)\\s*\\(', script):
        errors.append('Local checker includes a possible outbound request')
else:
    errors.append('Cannot compare published and on-device SHA-256 references')

# Current route-specific typography matters for accurate privacy copy.
legal = ROOT / 'legal-original.css'
tokens = ROOT / 'assets/css/tokens.css'
if not legal.is_file() or 'fonts.googleapis.com' not in legal.read_text(encoding='utf-8'):
    errors.append('Unexpected legal-page font import: update privacy data inventory')
if not tokens.is_file() or "../fonts/" not in tokens.read_text(encoding='utf-8'):
    errors.append('Unexpected homepage font configuration: update privacy data inventory')

print(f'AdSense PREVIEW static source QA: {len(PAGES)} pages; {links_checked} local references')
for err in errors:
    print('FAIL:', err)
print('Source QA result:', 'PASS' if not errors else f'{len(errors)} issue(s)')
print('LIMITS: External URLs, actual HTTP headers, device accessibility, third-party settings,')
print('real ZIP checksum, legal approval and Google AdSense status require separate verification.')
sys.exit(bool(errors))
