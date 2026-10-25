from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[1];d=r/'dist'
d.mkdir(exist_ok=True)
for item in d.iterdir():
 if item.is_dir():shutil.rmtree(item)
 else:item.unlink()
for name in ['assets','vendor','chat','guides','features','tools','about','pricing','help','contact']:
 dest=d/name
 if dest.exists():shutil.rmtree(dest)
 shutil.copytree(r/name,dest,ignore=shutil.ignore_patterns('*.py','*.md','.gitkeep'))
for name in ['index.html','404.html','logo.png','hero-orb.js','privacy-policy.html','privacy-bm.html','terms-of-use.html','legal-original.css','google27cd9c0b1b99680c.html','robots.txt','sitemap.xml','ads.txt','_headers','_redirects']:
 shutil.copy2(r/name,d/name)
print('Packaged deployable website in dist/')
