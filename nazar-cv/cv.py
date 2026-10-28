# -*- coding: utf-8 -*-
"""Refabrique le CV NAZAR a l'identique, en HTML puis en PDF A4.

Le PDF d'origine etait un cul-de-sac : polices de type 3 sans nom, tout cale
au pixel entier, rien de modifiable. Les cotes ci-dessous sont ceux releves
dedans, convertis en pixels CSS (1 px = 0,75 pt), si bien que la page se
reconstruit au meme endroit, au pixel pres.

Ce qui change, et en mieux : le bandeau de tete est refabrique a partir du
meme socle que les bannieres LinkedIn, donc a 290 points par pouce au lieu de
145, et les logos des moteurs viennent du site lui-meme.
"""
import io, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
import contenu

# --- cotes relevees dans le PDF d'origine, en pixels CSS ---------------------
PAGE_L, PAGE_H = 794, 1123          # A4 a 96 points par pouce
MARGE = 57                          # 42,75 pt
HAUT = 45                           # haut du bandeau
BANDEAU_H = 82
COL_G, ECART, COL_D = 421, 12, 248  # colonnes de gauche, gouttiere, droite

ENCRE = '#111827'                   # titres, filets
CORPS = '#1f2937'                   # texte courant
DOUX = '#374151'                    # ligne de contact

STYLE = u"""
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:%(PL)dpx}
body{font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;
  color:%(CORPS)s;background:#fff}
.page{position:relative;width:%(PL)dpx;height:%(PH)dpx;
  padding:%(HAUT)dpx %(M)dpx 0 %(M)dpx;overflow:hidden}

.bandeau{height:%(BH)dpx;border:1px solid %(ENCRE)s;border-radius:4px;
  overflow:hidden;line-height:0}
.bandeau img{width:100%%;height:100%%;display:block}

.tete{display:flex;align-items:flex-start;justify-content:space-between;
  margin-top:12px}
h1{font-size:20px;font-weight:bold;line-height:1;color:%(ENCRE)s;
  text-transform:uppercase}
.role{font-size:12px;font-weight:bold;color:%(ENCRE)s;margin-top:10px;
  line-height:1}
.contact{font-size:11px;color:%(DOUX)s;margin-top:11px;line-height:1}
.contact span{padding:0 7px}
.portrait{width:56px;height:56px;display:block;border:1px solid %(ENCRE)s;
  border-radius:4px;object-fit:cover}

.epais{height:2px;background:%(ENCRE)s;border:0;margin-top:6px}

h2{font-size:12px;font-weight:bold;color:%(ENCRE)s;line-height:1;
  padding-bottom:5px;border-bottom:1px solid %(ENCRE)s;margin-top:11px}
.profil{font-size:11px;line-height:15px;text-align:justify;margin-top:4px}

.cols{display:flex;margin-top:13px}
.cols h2{margin-top:9px}
.cols>div>h2:first-child{margin-top:0}
.gauche{width:%(CG)dpx}
.droite{width:%(CD)dpx;margin-left:%(EC)dpx}

.poste{display:flex;justify-content:space-between;align-items:baseline;
  font-size:10.5px;font-weight:bold;color:%(ENCRE)s;line-height:1}
.poste .quand{font-size:10.5px;white-space:nowrap}
.societe{font-size:10px;font-weight:bold;color:%(CORPS)s;margin-top:4px;
  line-height:1}
.exp{margin-top:13px}
.exp:first-child{margin-top:5px}

ul{list-style:none;margin-top:5px}
.gauche ul{margin-top:2px}
li{position:relative;padding-left:12px;font-size:10.5px;line-height:14.5px}
li:before{content:'';position:absolute;left:-1px;top:5.5px;
  width:3px;height:3px;border-radius:50%%;background:%(CORPS)s}
.droite li{line-height:14px;margin-bottom:3px}
.droite li:before{top:5px}

.lot{margin-top:5px}
.lot .ligne{font-size:10.5px;font-weight:bold;color:%(ENCRE)s;line-height:1;
  margin-top:9px}
.lot .ligne:first-child{margin-top:0}
.lot .sous{font-size:10.5px;color:%(CORPS)s;line-height:1;margin-top:5px}

.pied{position:absolute;left:%(M)dpx;right:%(M)dpx;top:1074px;height:1px;
  background:%(ENCRE)s}
.pastilles{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.pastilles span{display:inline-flex;align-items:center;height:18px;padding:0 5px;
  border:1px solid %(ENCRE)s;border-radius:3px;font-size:9.5px;font-weight:bold;
  color:%(ENCRE)s;line-height:1}
""" % {'PL': PAGE_L, 'PH': PAGE_H, 'M': MARGE, 'HAUT': HAUT, 'BH': BANDEAU_H,
       'CG': COL_G, 'CD': COL_D, 'EC': ECART,
       'ENCRE': ENCRE, 'CORPS': CORPS, 'DOUX': DOUX}


def bloc_experience(e):
    puces = u''.join(u'<li>%s</li>' % p for p in e['puces'])
    return (u'<div class="exp"><div class="poste"><span>%s</span>'
            u'<span class="quand">%s</span></div>'
            u'<div class="societe">%s</div><ul>%s</ul></div>'
            % (e['poste'], e['dates'], e['societe'], puces))


def lot(paires):
    out = []
    for titre, sous in paires:
        out.append(u'<div class="ligne">%s</div><div class="sous">%s</div>'
                   % (titre, sous))
    return u'<div class="lot">%s</div>' % u''.join(out)


def page(d, bandeau='bandeau-cv.png'):
    contact = u'<span>•</span>'.join(d['contact'])
    gauche = u''.join(bloc_experience(e) for e in d['experiences'])
    comp = u''.join(u'<li>%s</li>' % c for c in d['competences'])
    refs = u''.join(u'<li>%s</li>' % c for c in d['references'])
    outils = u''.join(u'<span>%s</span>' % o for o in d['outils'])
    # second jeu de pastilles, facultatif : les CMS de Florian, par exemple
    bis = u''
    if d.get('outils_bis'):
        bis = (u'<h2>%s</h2><div class="pastilles">%s</div>'
               % (d.get('titre_outils_bis', u'AUTRES OUTILS'),
                  u''.join(u'<span>%s</span>' % o for o in d['outils_bis'])))
    return u"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>%(nom)s — CV</title><style>%(style)s</style></head><body>
<div class="page">
  <div class="bandeau"><img src="%(bandeau)s" alt=""></div>
  <div class="tete">
    <div>
      <h1>%(nom)s</h1>
      <div class="role">%(titre)s</div>
      <div class="contact">%(contact)s</div>
    </div>
    <img class="portrait" src="%(photo)s" alt="">
  </div>
  <hr class="epais">
  <h2>PROFIL &amp; EXPERTISE</h2>
  <p class="profil">%(profil)s</p>
  <div class="cols">
    <div class="gauche">
      <h2>EXPÉRIENCES PROFESSIONNELLES</h2>
      %(gauche)s
    </div>
    <div class="droite">
      <h2>COMPÉTENCES CLÉS</h2>
      <ul>%(comp)s</ul>
      <h2>PRINCIPALES RÉFÉRENCES</h2>
      <ul>%(refs)s</ul>
      <h2>%(titre_outils)s</h2>
      <div class="pastilles">%(outils)s</div>
      %(outils_bis)s
      <h2>FORMATION</h2>
      %(formation)s
      <h2>%(titre_certifs)s</h2>
      %(certifs)s
    </div>
  </div>
  <div class="pied"></div>
</div></body></html>""" % {
        'style': STYLE, 'bandeau': bandeau, 'nom': d['nom'], 'titre': d['titre'],
        'contact': contact, 'photo': d['photo'], 'profil': d['profil'],
        'gauche': gauche, 'comp': comp, 'refs': refs, 'outils': outils,
        'formation': lot(d['formation']), 'certifs': lot(d['certifications']),
        'titre_certifs': d.get('titre_certifications', 'CERTIFICATIONS'),
        'titre_outils': d.get('titre_outils', u'OUTILS &amp; STACK'),
        'outils_bis': bis}


if __name__ == '__main__':
    qui = sys.argv[1].upper() if len(sys.argv) > 1 else 'CLEMENT'
    d = getattr(contenu, qui)
    chemin = os.path.join(ICI, d['fichier'] + '.html')
    io.open(chemin, 'w', encoding='utf-8').write(page(d))
    print('ecrit', chemin)
