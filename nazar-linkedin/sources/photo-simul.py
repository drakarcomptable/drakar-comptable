# -*- coding: utf-8 -*-
"""Reconstitue l'en-tete du profil pour juger du raccord : la banniere telle
qu'elle est chargee, la carte blanche en dessous, et le disque de la photo
a la position relevee sur la capture."""
import numpy as np
from PIL import Image, ImageDraw

BAN = '../lk/NAZAR-profil-D.png'
CX, CY, R = 207.2, 363.7, 153.2      # en coordonnees de banniere
LISERE = 6.0

def simule(photo, sortie, marge_bas=190):
    ban = Image.open(BAN).convert('RGB')
    L, H = ban.size
    page = Image.new('RGB', (L, H + marge_bas), (255, 255, 255))
    page.paste(ban, (0, 0))

    k = 4                                   # on travaille en suréchantillonné
    d = int(round(2*(R + LISERE)*k))
    disque = Image.new('RGBA', (d, d), (0, 0, 0, 0))
    ph = Image.open(photo).convert('RGB').resize((int(round(2*R*k)),)*2, Image.LANCZOS)
    m = Image.new('L', (d, d), 0); ImageDraw.Draw(m).ellipse((0, 0, d-1, d-1), fill=255)
    blanc = Image.new('RGBA', (d, d), (255, 255, 255, 255)); blanc.putalpha(m)
    disque.alpha_composite(blanc)
    mp = Image.new('L', ph.size, 0); ImageDraw.Draw(mp).ellipse((0, 0, ph.size[0]-1, ph.size[1]-1), fill=255)
    o = int(round(LISERE*k))
    disque.paste(ph, (o, o), mp)
    disque = disque.resize((int(round(d/float(k))),)*2, Image.LANCZOS)

    page.paste(disque, (int(round(CX-R-LISERE)), int(round(CY-R-LISERE))), disque)
    page.save(sortie, quality=95)
    print(sortie)

simule('NAZAR-photo-profil.jpg', 'simul-nouveau.jpg')
