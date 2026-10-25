from pathlib import Path
from html.parser import HTMLParser
import hashlib,base64
class Scripts(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=False);self.inline=False;self.content='';self.values=[]
 def handle_starttag(self,tag,attrs):
  if tag=='script':
   a=dict(attrs);self.inline='src' not in a and a.get('type','')!='application/ld+json';self.content=''
 def handle_data(self,data):
  if self.inline:self.content+=data
 def handle_endtag(self,tag):
  if tag=='script' and self.inline:
   if self.content:self.values.append(self.content)
   self.inline=False
hashes=set()
for f in Path('chat').rglob('*.html'):
 p=Scripts();p.feed(f.read_text())
 for code in p.values:hashes.add("'sha256-"+base64.b64encode(hashlib.sha256(code.encode()).digest()).decode()+"'")
p=Path('_headers');s=p.read_text();start=s.index("script-src ");end=s.index(';',start);s=s[:start]+"script-src 'self' "+' '.join(sorted(hashes))+s[end:];p.write_text(s)
print('CSP allows',len(hashes),'known static hydration script hashes; no general inline JavaScript permission.')
