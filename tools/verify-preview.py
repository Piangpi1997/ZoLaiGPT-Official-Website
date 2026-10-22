"""Run with Python 3 from any directory. Checks public local links and token contrast."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self): super().__init__();self.ids=[];self.refs=[];self.social=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for attr in ('src','href'):
   if attr in a:self.refs.append(a[attr])
  if tag=='a' and a.get('aria-label') in ('Facebook','Instagram','Threads','TikTok','X / Twitter','Discord','LinkedIn','GitHub','WhatsApp','Email'):self.social.append((a.get('aria-label'),a.get('href')))
errors=[];count=0
for path in [ROOT/'index.html',ROOT/'privacy-policy.html',ROOT/'terms-of-use.html',ROOT/'chat/index.html',ROOT/'qa-reference.html']:
 p=Page();p.feed(path.read_text());count+=len(p.refs)
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{path.name}: duplicate IDs')
 for ref in p.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  if not u.path:
   if u.fragment and u.fragment not in p.ids:errors.append(f'{path.name}: anchor {ref}')
   continue
  target=(ROOT/u.path.lstrip('/')) if u.path.startswith('/') else path.parent/unquote(u.path)
  if target.is_dir():target/='index.html'
  if not target.is_file():errors.append(f'{path.relative_to(ROOT)}: missing {ref}')
for path in (ROOT/'assets/css').glob('*.css'):
 for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)',path.read_text()):
  if not urlsplit(ref).scheme and not (path.parent/ref).is_file():errors.append(f'CSS missing {ref}')
roots=sum(p.read_text().count(':root{') for p in (ROOT/'assets/css').glob('*.css'))
if roots!=1:errors.append(f'Expected one homepage token root, found {roots}')
def luminance(c):
 vals=[int(c[i:i+2],16)/255 for i in (1,3,5)]
 vals=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in vals]
 return sum(a*b for a,b in zip(vals,[.2126,.7152,.0722]))
def contrast(a,b):
 a,b=sorted([luminance(a),luminance(b)]);return (b+.05)/(a+.05)
ratios={x:round(contrast(x,'#0c0a16'),2) for x in ['#f5f6fb','#b3b8d2','#969bb8','#baa3ff']}
if any(x<4.5 for x in ratios.values()):errors.append('Body text token contrast below 4.5')
index=Page();index.feed((ROOT/'index.html').read_text())
if len(index.social)!=10:errors.append('Expected exactly 10 original social/contact links')
print(json.dumps({'html_references_checked':count,'homepage_token_roots':roots,'solid_background_contrast_ratios':ratios,'social_contact_links':len(index.social),'errors':errors},indent=2))
raise SystemExit(bool(errors))
