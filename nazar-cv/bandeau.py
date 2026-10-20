# -*- coding: utf-8 -*-
"""Le bandeau qui coiffe le CV : meme composition que la banniere entreprise,
remise au format tres allonge du haut de page (1024 x 123, soit 8,3 pour 1).

Il est fabrique a partir du meme socle que les bannieres LinkedIn, donc le
degrade, les lignes de niveau et les logos viennent du site lui-meme. Les
cotes sont ceux releves sur le bandeau du CV d'origine : marge droite 56,
pastilles de 36 espacees de 9, filet de 2 sur 46, texte finissant a 712.
"""
import io, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
GEN = os.environ.get('NAZAR_GEN', os.path.join(ICI, '..', 'nazar-linkedin', 'sources'))
sys.path.insert(0, GEN)
import gen

def bandeau(L=1024, H=123, police=26):
    corps = u"""
    <div class="bloc" style="right:56px;top:50%%;transform:translateY(-50%%);
         display:flex;align-items:center;gap:19px">
      <h1 style="font-size:%(p)dpx;text-align:right;line-height:1.14">Vos prochains clients<br>vous cherchent <span class="acc">sur les IA.</span></h1>
      <span class="filet" style="width:2px;height:46px"></span>
      %(chips)s
    </div>""" % {'p': police, 'chips': gen.pastilles(36, 21, 9)}
    return gen.page(L, H, corps, 14)

if __name__ == '__main__':
    io.open(os.path.join(ICI, 'bandeau-cv.html'), 'w', encoding='utf-8').write(bandeau())
    print('ecrit bandeau-cv.html')
