"""Stitch the single-page build (app/showcase.html: app and demo views) into one self-contained HTML file.

Usage (from this folder):
  npm run build:showcase   (inside app/)
  python -I package_showcase.py
Writes publish/potluck.html: <title>, the pre-paint theme script, the inlined stylesheet (fonts are data URIs),
the root element and the inlined module script. No external requests.
"""
import glob
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'app', 'dist-showcase')

html = open(os.path.join(DIST, 'showcase.html'), encoding='utf-8').read()
css = open(glob.glob(os.path.join(DIST, 'assets', '*.css'))[0], encoding='utf-8').read()
js = open(glob.glob(os.path.join(DIST, 'assets', '*.js'))[0], encoding='utf-8').read()

theme = re.search(r'<script>(.*?)</script>', html, re.S).group(1).strip()
assert 'url(/' not in css and 'url("/' not in css, 'an asset was not inlined'

# Keep inline code from closing its own tag early
js = js.replace('</script', '<\\/script')
css = css.replace('</style', '<\\/style')

page = f'''<meta charset="utf-8">
<title>Potluck</title>
<script>{theme}</script>
<style>{css}</style>
<div id="root"></div>
<script type="module">{js}</script>
'''
out = os.path.join(HERE, 'publish', 'potluck.html')
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w', encoding='utf-8', newline='\n').write(page)
print(out, f'{len(page.encode("utf-8")) / 1024:.0f} KB')
