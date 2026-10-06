# -*- coding: utf-8 -*-
"""Declinaison claire des bannieres, sur le bleu glace du site.

Meme geometrie et memes logos que la version sombre, palette inversee : le
fond prend le `--ice` du site, les lignes de niveau passent en bleu petrole,
le texte devient encre. Sur fond clair, la pastille blanche des logos recoit
un cerne : sans lui, les marques pales se diluent dans le fond.
"""
import io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen                                   # logos, pastilles, vagues, police

ICI = os.path.dirname(os.path.abspath(__file__))

SOCLE = u"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
@font-face{font-family:'PJS';src:url(data:font/woff2;base64,__POLICE__) format('woff2');
  font-weight:200 800;font-style:normal;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:__L__px;height:__H__px;overflow:hidden}
body{font-family:'PJS',sans-serif;-webkit-font-smoothing:antialiased;
  background:#e3f7fe;position:relative}
.fond{position:absolute;inset:0;
  background:radial-gradient(130% 150% at 16% 8%,#f6fcff 0%,#e2f4fd 44%,#c3e2f4 100%)}
.vg{position:absolute;inset:0;display:block}
.voile{position:absolute;inset:0;
  background:linear-gradient(280deg,rgba(255,255,255,.80) 0%,rgba(255,255,255,.34) 36%,rgba(255,255,255,0) 64%)}
.bloc{position:absolute;z-index:3}
.chips{display:flex;align-items:center}
.chip{display:inline-flex;align-items:center;justify-content:center;
  background:#fff;border-radius:26%;border:1px solid rgba(0,67,88,.16);
  box-shadow:0 3px 10px rgba(0,67,88,.13)}
h1{color:#00212c;font-weight:800;letter-spacing:-.025em;line-height:1.08;
  text-transform:uppercase}
h1 .acc{color:#0a7fa0}
.sous{color:#44798a;font-weight:600;letter-spacing:.02em}
.filet{background:#0a7fa0;border-radius:2px}
</style></head><body>
<div class="fond"></div>__VAGUES__<div class="voile"></div>
__CORPS__
</body></html>"""

def page(L, H, corps, n=26):
    v = gen.vagues(L, H, n, opac=.30).replace('stroke="#7fd8ee"', 'stroke="#15607a"')
    return (SOCLE.replace('__POLICE__', gen.POLICE).replace('__L__', str(L))
                 .replace('__H__', str(H)).replace('__VAGUES__', v)
                 .replace('__CORPS__', corps))

def entreprise_A(L=1128, H=191):
    return page(L, H, u"""
    <div class="bloc" style="right:56px;top:50%;transform:translateY(-50%);
         display:flex;align-items:center;gap:26px">
      <h1 style="font-size:28px;text-align:right">Vos prochains clients<br>vous cherchent <span class="acc">sur les IA.</span></h1>
      <span class="filet" style="width:3px;height:52px"></span>
      """ + gen.pastilles(40, 23, 11) + u"</div>", 20)

def entreprise_B(L=1128, H=191):
    return page(L, H, u"""
    <div class="bloc" style="right:56px;top:50%;transform:translateY(-50%);text-align:right">
      <h1 style="font-size:27px">Être trouvé sur Google ne suffit <span class="acc">plus.</span></h1>
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:18px;margin-top:16px">
        <span class="sous" style="font-size:13px;letter-spacing:.14em">SEO &amp; GEO</span>
        """ + gen.pastilles(36, 21, 10) + u"</div></div>", 20)

def entreprise_C(L=1128, H=191):
    return page(L, H, u"""
    <div class="bloc" style="right:56px;top:50%;transform:translateY(-50%);
         display:flex;align-items:center;gap:24px">
      <h1 style="font-size:25px;text-align:right;line-height:1.16">La force de frappe d’une agence<br>
        dans un <span class="acc">collectif SEO &amp; GEO</span></h1>
      <span class="filet" style="width:3px;height:50px"></span>
      """ + gen.pastilles(38, 22, 10) + u"</div>", 20)

def profil_D(L=1584, H=396):
    return page(L, H, u"""
    <div class="bloc" style="right:84px;top:50%;transform:translateY(-50%);
         display:flex;align-items:center;gap:30px">
      <h1 style="font-size:40px;text-align:right;line-height:1.14">Vos prochains clients<br>vous cherchent <span class="acc">sur les IA.</span></h1>
      <span class="filet" style="width:3px;height:74px"></span>
      """ + gen.pastilles(56, 32, 14) + u"</div>")

JEUX = [('entreprise-claire-A', entreprise_A, 1128, 191),
        ('entreprise-claire-B', entreprise_B, 1128, 191),
        ('entreprise-claire-C', entreprise_C, 1128, 191),
        ('profil-clair-D',      profil_D,     1584, 396)]

if __name__ == '__main__':
    gen.ecrire(JEUX)
