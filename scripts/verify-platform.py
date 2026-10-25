from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,subprocess
root=Path(__file__).resolve().parents[1];dist=root/'dist'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=set();self.h1=0;self.duplicate=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if 'id' in a:
   if a['id'] in self.ids:self.duplicate.append(a['id'])
   self.ids.add(a['id'])
  for k in ['src','href']:
   if k in a and a[k] and not a[k].startswith(('http:','https:','mailto:','tel:','data:','blob:')):self.refs.append(a[k])
errors=[];refs=0
pages={}
for p in dist.rglob('*.html'):
 if p.name.startswith('qa'):continue
 d=Page();d.feed(p.read_text());pages[p.resolve()]=d
 if d.duplicate:errors.append(f'{p.relative_to(dist)}: duplicate IDs {d.duplicate}')
for p,doc in pages.items():
 for ref in doc.refs:
  u=urlsplit(ref);path=unquote(u.path)
  target=(dist/path.lstrip('/')) if path.startswith('/') else (p.parent/path if path else p)
  if target.is_dir():target=target/'index.html'
  elif not target.exists() and target.with_suffix('.html').exists():target=target.with_suffix('.html')
  refs+=1
  if not target.exists():errors.append(f'{p.relative_to(dist)} -> missing {ref}')
  elif u.fragment and target.resolve() in pages and u.fragment not in pages[target.resolve()].ids:errors.append(f'{p.relative_to(dist)} -> missing anchor {ref}')
for route in ['index.html','features/index.html','tools/index.html','about/index.html','pricing/index.html','help/index.html','contact/index.html']:
 if pages[(dist/route).resolve()].h1!=1:errors.append(f'{route}: expected one h1')
for p in [root/'assets/js/platform.js',root/'hero-orb.js']:
 result=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
 if result.returncode:errors.append(result.stderr)
for p in [dist/'index.html',dist/'features/index.html',dist/'tools/index.html']:
 s=p.read_text()
 if 'data-my=' not in s:errors.append(f'{p}: missing Myanmar translations')
 if 'https://zolaigptofficial.com/' not in s:errors.append(f'{p}: missing production canonical')
print(json.dumps({'html_pages':len(pages),'references_checked':refs,'errors':errors},indent=2))
raise SystemExit(bool(errors))
