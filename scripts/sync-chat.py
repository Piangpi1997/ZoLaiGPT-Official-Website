from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
src=root/'chat-workspace/out';dst=root/'chat'
if not (src/'index.html').is_file():raise SystemExit('Build the workspace before synchronizing generated output.')
if dst.exists():shutil.rmtree(dst)
shutil.copytree(src,dst)
print('Synced generated workspace to chat/')
