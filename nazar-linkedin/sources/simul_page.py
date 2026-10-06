# -*- coding: utf-8 -*-
"""Reconstitue l'en-tete de la page entreprise : la banniere, la carte
blanche, et la pastille du logo a la position relevee sur la capture."""
import os
from PIL import Image

LOGO = '/home/user/drakar-comptable/nazar-site/logo.png'
X, Y, COTE = 38, 106, 171          # en coordonnees de banniere 1128 x 191

def simule(ban, sortie, bas=150):
    b = Image.open(ban).convert('RGB')
    L, H = b.size
    page = Image.new('RGB', (L, H + bas), (255, 255, 255))
    page.paste(b, (0, 0))
    k = 4
    tuile = Image.new('RGB', (COTE*k, COTE*k), (0xe3, 0xf7, 0xfe))
    lg = Image.open(LOGO).convert('RGBA')
    m = int(COTE*k*0.74)
    lg = lg.resize((m, m), Image.LANCZOS)
    tuile.paste(lg, ((COTE*k-m)//2, (COTE*k-m)//2), lg)
    page.paste(tuile.resize((COTE, COTE), Image.LANCZOS), (X, Y))
    page.save(sortie, quality=95)
    print(sortie)

for n in ('A', 'B', 'C'):
    simule('NAZAR-entreprise-claire-%s.png' % n, 'simul-page-%s.jpg' % n)
