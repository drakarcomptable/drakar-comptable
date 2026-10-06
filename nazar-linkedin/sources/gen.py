# -*- coding: utf-8 -*-
"""Fabrique les bannieres LinkedIn de NAZAR.

Le fond, les couleurs et les logos sont repris tels quels du site pour que les
deux supports soient indissociables. Les logos des moteurs sont poses sur des
pastilles claires : sur le bleu nuit de la marque, les couleurs officielles
ressortent alors toutes, y compris celle de Perplexity qui s'y noierait sinon.
"""
import io, json, math, os, re, subprocess, sys

ICI = os.path.dirname(os.path.abspath(__file__))
SITE = '/tmp/claude-0/-home-user-drakar-comptable/053d6a3d-6ce3-51d7-a083-05ef634a21f1/scratchpad/nazar-geo.html'

# --- recuperation des logos officiels deja embarques dans le site ------------
src = io.open(SITE, encoding='utf-8').read()
m = re.search(r'window\.NZ = (\{.*?\});', src, re.S)
NZ = json.loads(m.group(1))
mh = re.search(r'window\.NZ\.Copilot\.hue = "(.*?)";\s*</script>', src, re.S)
HUE = mh.group(1).encode('utf-8').decode('unicode_escape')

POLICE = io.open(os.path.join(ICI, 'pjs.b64'), encoding='ascii').read()

def logo(nom, taille):
    """Un logo de moteur, a sa couleur officielle, dans un carre de `taille`."""
    if nom == 'Copilot':
        pref = 'cp' + str(abs(hash(nom + str(taille))) % 99999) + '-'
        corps = HUE.replace('@g', pref)
        return ('<svg viewBox="0 0 24 24" width="%d" height="%d">%s</svg>'
                % (taille, taille, corps))
    e = NZ[nom]
    fr = ' fill-rule="evenodd"' if e.get('fr') else ''
    return ('<svg viewBox="0 0 24 24" width="%d" height="%d">'
            '<path d="%s" fill="%s"%s/></svg>' % (taille, taille, e['d'], e['c'], fr))

def vagues(larg, haut, n=26, opac=.16):
    """Les lignes de niveau de la charte, redessinees a la taille demandee."""
    out = []
    for i in range(n):
        t = i / float(n - 1)
        base = -haut * .34 + t * haut * 1.46
        amp = haut * (.085 + .055 * math.sin(t * math.pi))
        pts = []
        pas = larg / 7.0
        for k in range(8):
            x = k * pas
            y = base + amp * math.sin(k * .82 + t * 2.1) - t * haut * .05
            pts.append((x, y))
        d = 'M%.1f %.1f' % pts[0]
        for k in range(1, len(pts)):
            x0, y0 = pts[k - 1]; x1, y1 = pts[k]
            d += ' C%.1f %.1f %.1f %.1f %.1f %.1f' % (
                x0 + pas * .45, y0, x1 - pas * .45, y1, x1, y1)
        o = opac * (.45 + .55 * math.sin(t * math.pi))
        out.append('<path d="%s" fill="none" stroke="#7fd8ee" stroke-opacity="%.3f" stroke-width="1.6"/>' % (d, o))
    return ('<svg class="vg" viewBox="0 0 %d %d" width="%d" height="%d" '
            'preserveAspectRatio="none">%s</svg>' % (larg, haut, larg, haut, ''.join(out)))

MOTEURS = ['ChatGPT', 'Gemini', 'Claude', 'Copilot', 'Perplexity']

def pastilles(taille_chip, taille_logo, ecart, moteurs=None):
    cs = []
    for n in (moteurs or MOTEURS):
        cs.append('<span class="chip" style="width:%dpx;height:%dpx">%s</span>'
                  % (taille_chip, taille_chip, logo(n, taille_logo)))
    return '<div class="chips" style="gap:%dpx">%s</div>' % (ecart, ''.join(cs))

SOCLE = u"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
@font-face{font-family:'PJS';src:url(data:font/woff2;base64,%(police)s) format('woff2');
  font-weight:200 800;font-style:normal;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:%(L)dpx;height:%(H)dpx;overflow:hidden}
body{font-family:'PJS',sans-serif;-webkit-font-smoothing:antialiased;
  background:#00212c;position:relative}
.fond{position:absolute;inset:0;
  background:radial-gradient(130%% 150%% at 88%% 12%%,#0a4a60 0%%,#00303f 42%%,#00212c 100%%)}
.vg{position:absolute;inset:0;display:block}
.voile{position:absolute;inset:0;
  background:linear-gradient(100deg,rgba(0,33,44,.92) 0%%,rgba(0,33,44,.55) 34%%,rgba(0,33,44,0) 62%%)}
.bloc{position:absolute;z-index:3}
.chips{display:flex;align-items:center}
.chip{display:inline-flex;align-items:center;justify-content:center;
  background:#fff;border-radius:26%%;
  box-shadow:0 2px 10px rgba(0,0,0,.26)}
h1{color:#fff;font-weight:800;letter-spacing:-.025em;line-height:1.08;
  text-transform:uppercase}
h1 .acc{color:#7fd8ee}
.sous{color:#9ec6d4;font-weight:600;letter-spacing:.02em}
.filet{background:#7fd8ee;border-radius:2px}
</style></head><body>
<div class="fond"></div>%(vagues)s<div class="voile"></div>
%(corps)s
</body></html>"""

def page(L, H, corps, n_vagues=26):
    return SOCLE % {'police': POLICE, 'L': L, 'H': H,
                    'vagues': vagues(L, H, n_vagues), 'corps': corps}

# ---------------------------------------------------------------- variantes --
def profil_A(L=1584, H=396):
    corps = u"""
    <div class="bloc" style="right:84px;top:50%%;transform:translateY(-50%%);
         text-align:right;max-width:980px">
      <h1 style="font-size:60px">Vos prochains clients<br>vous cherchent <span class="acc">sur les IA.</span></h1>
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:22px;margin-top:30px">
        <span class="sous" style="font-size:17px">Référencement SEO &amp; GEO</span>
        <span class="filet" style="width:28px;height:3px"></span>
        %(chips)s
      </div>
    </div>""" % {'chips': pastilles(50, 28, 13)}
    return page(L, H, corps)

def profil_B(L=1584, H=396):
    corps = u"""
    <div class="bloc" style="right:84px;top:50%%;transform:translateY(-50%%);
         text-align:right;max-width:1010px">
      <div class="sous" style="font-size:16px;letter-spacing:.17em;margin-bottom:20px">
        COLLECTIF DE CONSULTANTS SEO &amp; GEO
      </div>
      <h1 style="font-size:56px">Être trouvé sur Google<br>ne suffit <span class="acc">plus.</span></h1>
      <div style="display:flex;justify-content:flex-end;margin-top:32px">%(chips)s</div>
    </div>""" % {'chips': pastilles(54, 30, 15)}
    return page(L, H, corps)

def profil_C(L=1584, H=396):
    corps = u"""
    <div class="bloc" style="right:84px;top:50%%;transform:translateY(-50%%);
         text-align:right;max-width:1020px">
      <h1 style="font-size:50px;line-height:1.14">La force de frappe d’une agence<br>
        dans un <span class="acc">collectif SEO &amp; GEO</span></h1>
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:20px;margin-top:30px">
        <span class="sous" style="font-size:16px">Présents là où vos clients cherchent</span>
        <span class="filet" style="width:26px;height:3px"></span>
        %(chips)s
      </div>
    </div>""" % {'chips': pastilles(48, 27, 12)}
    return page(L, H, corps)

def entreprise_A(L=1128, H=191):
    corps = u"""
    <div class="bloc" style="right:56px;top:50%%;transform:translateY(-50%%);
         display:flex;align-items:center;gap:26px">
      <h1 style="font-size:28px;text-align:right">Vos prochains clients<br>vous cherchent <span class="acc">sur les IA.</span></h1>
      <span class="filet" style="width:3px;height:52px"></span>
      %(chips)s
    </div>""" % {'chips': pastilles(40, 23, 11)}
    return page(L, H, corps, 20)

def entreprise_B(L=1128, H=191):
    corps = u"""
    <div class="bloc" style="right:56px;top:50%%;transform:translateY(-50%%);
         text-align:right">
      <h1 style="font-size:27px">Être trouvé sur Google ne suffit <span class="acc">plus.</span></h1>
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:18px;margin-top:16px">
        <span class="sous" style="font-size:13px;letter-spacing:.14em">SEO &amp; GEO</span>
        %(chips)s
      </div>
    </div>""" % {'chips': pastilles(36, 21, 10)}
    return page(L, H, corps, 20)

def entreprise_C(L=1128, H=191):
    corps = u"""
    <div class="bloc" style="right:56px;top:50%%;transform:translateY(-50%%);
         display:flex;align-items:center;gap:24px">
      <h1 style="font-size:25px;text-align:right;line-height:1.16">La force de frappe d’une agence<br>
        dans un <span class="acc">collectif SEO &amp; GEO</span></h1>
      <span class="filet" style="width:3px;height:50px"></span>
      %(chips)s
    </div>""" % {'chips': pastilles(38, 22, 10)}
    return page(L, H, corps, 20)

JEUX = [
    ('profil-A', profil_A, 1584, 396),
    ('profil-B', profil_B, 1584, 396),
    ('profil-C', profil_C, 1584, 396),
    ('entreprise-A', entreprise_A, 1128, 191),
    ('entreprise-B', entreprise_B, 1128, 191),
    ('entreprise-C', entreprise_C, 1128, 191),
]

for nom, fn, L, H in JEUX:
    chemin = os.path.join(ICI, nom + '.html')
    io.open(chemin, 'w', encoding='utf-8').write(fn(L, H))
    print('ecrit', nom, L, H)
