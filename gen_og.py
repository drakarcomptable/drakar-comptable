# -*- coding: utf-8 -*-
"""Images de partage, une par page.

Les douze pages partageaient la meme vignette, le logo. Un lien pose sur
LinkedIn avait donc toujours la meme apparence, quel que soit son sujet.

Le gabarit est du HTML rendu par le navigateur, pour reprendre exactement
les polices et les couleurs du site. Les images produites sont des fichiers
statiques commites : Vercel ne sait pas faire tourner un navigateur pendant
sa construction.

A relancer quand un titre de page change : python3 gen_og.py
"""

import io
import json
import os
import subprocess
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
from pages_nazar import PAGES  # noqa: E402

SORTIE = os.path.join(ICI, 'nazar-site', 'og')

# Le titre de la vignette n'est pas la balise <title>, qui porte des
# suffixes utiles au moteur mais inutiles a l'oeil. On reprend le H1.
def carte(p):
    return {'slug': ('blog-' + p['slug']) if p.get('parent') == 'blog' else p['slug'],
            'kick': p['kick'],
            'titre': p['h1']}


GABARIT = u'''<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
@font-face{font-family:'JK';src:url(police-jakarta.woff2) format('woff2');
  font-weight:200 800;font-display:block}
@font-face{font-family:'MO';src:url(police-mono-600.woff2) format('woff2');
  font-weight:600;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#00212c;
  font-family:'JK',sans-serif;color:#fff;position:relative}
.halo{position:absolute;width:760px;height:760px;right:-230px;top:-290px;
  border-radius:50%;background:radial-gradient(circle,rgba(127,216,238,.22),transparent 68%)}
.halo2{position:absolute;width:520px;height:520px;left:-190px;bottom:-240px;
  border-radius:50%;background:radial-gradient(circle,rgba(14,78,98,.55),transparent 70%)}
.c{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;
  justify-content:space-between;padding:66px 72px}
.haut{display:flex;align-items:center;gap:16px}
.haut img{width:58px;height:58px}
.haut b{font-size:25px;font-weight:700;letter-spacing:.02em}
.kick{font-family:'MO',monospace;font-size:16px;letter-spacing:.22em;
  text-transform:uppercase;color:#7fd8ee;margin-bottom:22px}
h1{font-size:62px;line-height:1.08;font-weight:700;letter-spacing:-.032em;
  max-width:17ch;text-wrap:balance}
h1.court{font-size:70px}
h1.long{font-size:52px;max-width:20ch}
.bas{display:flex;align-items:center;justify-content:space-between;
  font-size:19px;color:#8fb6c4}
.trait{position:absolute;left:0;right:0;bottom:0;height:7px;
  background:linear-gradient(90deg,#7fd8ee,#0e4e62)}
</style></head><body>
<div class="halo"></div><div class="halo2"></div>
<div class="c">
  <div class="haut"><img src="logo.png" alt=""><b>NAZAR</b></div>
  <div>
    <p class="kick">__KICK__</p>
    <h1 class="__CL__">__TITRE__</h1>
  </div>
  <div class="bas"><span>nazar-seo.fr</span><span>SEO &amp; GEO</span></div>
</div>
<div class="trait"></div>
</body></html>'''


def main():
    if not os.path.isdir(SORTIE):
        os.makedirs(SORTIE)
    cartes = [carte(p) for p in PAGES]
    for c in cartes:
        n = len(c['titre'])
        c['cl'] = 'court' if n < 34 else ('long' if n > 58 else '')
    io.open(os.path.join(ICI, 'og-cartes.json'), 'w', encoding='utf-8').write(
        json.dumps(cartes, ensure_ascii=False))
    io.open(os.path.join(ICI, 'og-gabarit.html'), 'w', encoding='utf-8').write(GABARIT)
    subprocess.check_call(['node', os.path.join(ICI, 'gen_og.cjs')])
    os.remove(os.path.join(ICI, 'og-cartes.json'))
    os.remove(os.path.join(ICI, 'og-gabarit.html'))
    for c in cartes:
        f = os.path.join(SORTIE, c['slug'] + '.jpg')
        print('  og/%-40s %6d octets' % (c['slug'] + '.jpg', os.path.getsize(f)))


if __name__ == '__main__':
    main()
