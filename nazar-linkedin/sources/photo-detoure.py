# -*- coding: utf-8 -*-
"""Detoure le portrait. Le modele general sert de base, l'alpha matting
rattrape les tresses, ou un masque binaire laisserait un lisere vert."""
import io, sys, os
from PIL import Image
from rembg import remove, new_session

src = Image.open('source.webp').convert('RGB')
print('source', src.size)
for nom in ('isnet-general-use', 'u2net_human_seg', 'u2net'):
    try:
        s = new_session(nom)
        out = remove(src, session=s, alpha_matting=True,
                     alpha_matting_foreground_threshold=250,
                     alpha_matting_background_threshold=15,
                     alpha_matting_erode_size=8)
        out.save('decoupe-%s.png' % nom)
        print('ok', nom, out.size)
    except Exception as e:
        print('echec', nom, type(e).__name__, str(e)[:160])
