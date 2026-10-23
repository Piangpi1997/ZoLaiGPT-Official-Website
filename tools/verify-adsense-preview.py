#!/usr/bin/env python3
"""Offline source checks for the AdSense readiness PREVIEW only.
Run: python3 tools/verify-adsense-preview.py
NOT an AdSense approval, live browser, privacy, or external link audit.
"""
from html.parser import HTMLParser
from pathlib import Path
from collections import Counter
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'guides/index.html',
         'guides/source-zip-verification.html',
         'guides/multilingual-ai-review.html',
         'guides/check-app-availability.html',
         'guides/editorial-standards.html']
errors = []

class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.refs = []
        self.ads = []

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if a.get('id'):
            self.ids.append(a['id'])
        for key in ('href', 'src'):
            if a.get(key):
                self.refs.append(a[key])
        if tag == 'script' and 'adsbygoogle' in (a.get('src') or ''):
            self.ads.append(a['src'])

def local_target(path, ref):
    if ref.startswith(('#', '//')):
        return None
    u = urlsplit(ref)
    if u.scheme or u.netloc or not u.path:
        return None
    p = unquote(u.path)
    return ROOT / p.lstrip('/') if p.startswith('/') else path.parent / p

for name in PAGES:
    path = ROOT / name
    if not path.is_file():
        errors.append('Missing page: ' + name)
        continue
    html = path.read_text(encoding='utf-8')
    doc = Document()
    doc.feed(html)
    for value, count in Counter(doc.ids).items():
        if count > 1:
            errors.append(f'Duplicate ID: {name} #{value}')
    for ref in doc.refs:
        target = local_target(path, ref)
        if target is None:
            continue
        if target.is_dir():
            target = target / 'index.html'
        if not target.is_file():
            errors.append(f'Broken local reference: {name} -> {ref}')
    if 'name="robots" content="noindex,nofollow"' not in html:
        errors.append('Missing preview robots meta: ' + name)
    if doc.ads:
        errors.append('Ad script embedded in preview: ' + name)
    if name != 'index.html' and name != 'guides/index.html' and 'Editorial review needed' not in html:
        errors.append('Missing human review disclaimer: ' + name)

headers = ROOT / '_headers'
if not headers.is_file() or '/*\n  X-Robots-Tag: noindex, nofollow' not in headers.read_text(encoding='utf-8'):
    errors.append('PREVIEW-only global noindex header absent')
styles = ROOT / 'styles.css'
if not styles.is_file() or 'knowledge-guides.css' not in styles.read_text(encoding='utf-8'):
    errors.append('Guide stylesheet import absent')
config = ROOT / 'assets/js/site-config.js'
if not config.is_file() or "channel:'Audit Preview'" not in config.read_text(encoding='utf-8'):
    errors.append('Audit Preview version label absent')

print('ZoLaiGPT AdSense PREVIEW source validation:',len(PAGES),'HTML pages')
for e in errors:
    print('FAIL:',e)
print('NOTE: External links, deployed response headers, mobile QA, ZIP checksum, privacy and AdSense approval require separate checks.')
print('Source errors:',len(errors))
sys.exit(1 if errors else 0)
