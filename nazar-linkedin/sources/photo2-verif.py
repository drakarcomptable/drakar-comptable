# -*- coding: utf-8 -*-
"""Test decisif : le detourage, recompose sur le fond gris d'origine, doit
redonner la photo de depart. S'il la redonne, ce qu'on voit sur fond sombre
est la chevelure reelle et non un defaut de traitement."""
import numpy as np, sys, os
sys.path.insert(0, '.')
from PIL import Image, ImageFilter
import compose as C

masque = Image.open('decoupe.png').convert('RGBA')
al0 = np.asarray(masque)[..., 3].astype(np.float32)
rgb = np.asarray(Image.open('source.webp').convert('RGB')).astype(np.float32)
fond = np.median(rgb[al0 < 4], axis=0)
couleur = C.decontamine(rgb, al0, fond)
al = np.clip((al0 / 255.0 - 0.18) / 0.82, 0, 1)

# recomposition sur le gris d'origine
recompo = couleur * al[..., None] + fond * (1 - al[..., None])
ecart = np.abs(recompo - rgb)
print('ecart a la photo de depart : moyen %.1f  median %.1f  p99 %.1f sur 255'
      % (ecart.mean(), np.median(ecart), np.percentile(ecart, 99)))
Image.fromarray(np.clip(recompo, 0, 255).astype(np.uint8)).save('recompose-gris.png')

# et sur un gris moyen, pour juger la structure sans l'effet du contraste
for nom, f in (('clair', np.array([236., 234., 230.])),
               ('moyen', np.array([128., 128., 128.])),
               ('nuit',  np.array([0., 48., 62.]))):
    im = couleur * al[..., None] + f * (1 - al[..., None])
    Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).crop((150, 40, 560, 290)) \
         .resize((820, 500), Image.LANCZOS).save('sur-%s.png' % nom)
print('vignettes ecrites')
