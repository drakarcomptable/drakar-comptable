# -*- coding: utf-8 -*-
"""Pose le portrait sur la portion de banniere que le cercle de LinkedIn
recouvre, comme pour les trois precedents.

Nouveaute ici : le fond d'origine n'est ni uni ni en simple degrade vertical.
Il y a un mur clair a gauche et un tableau sombre a droite. Il est donc estime
localement, pixel par pixel, en prolongeant le fond environnant sous le sujet.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageFilter
import fond_banniere as FB

COTE = 1200
ZONE = (54.0, 210.5, 360.3, 516.9)
HAUT_CHEVEUX = 0.19

def carte_du_fond(src_rgb, al, rayons=(5, 12, 30, 70)):
    """Prolonge le fond sous le sujet, pour savoir quelle couleur retirer.

    Mur clair d'un cote, tableau sombre de l'autre : ni une couleur unique ni
    un degrade vertical ne conviennent. Le fond connu est donc etale sous le
    sujet, en divisant son flou par le flou de son propre masque, ce qui
    l'empeche d'etre contamine par le sujet absent du calcul.

    L'etalement se fait du plus serre au plus large, et chaque pixel retient
    la premiere estimation disposant d'assez de fond autour de lui. Un rayon
    unique et large melangeait le mur et le tableau juste au-dessus de la
    tete : il sous-estimait la clarte du fond, et la couleur reconstituee
    partait vers le blanc, d'ou un lisere pale sur le bleu nuit.
    """
    dehors = (al < 4).astype(np.float32)
    estime = None
    acquis = None
    for r in rayons:
        poids = np.asarray(Image.fromarray((dehors * 255).astype(np.uint8))
                           .filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255.0
        canaux = [np.asarray(Image.fromarray((src_rgb[..., c] * dehors).astype(np.uint8))
                             .filter(ImageFilter.GaussianBlur(r))).astype(np.float32)
                  for c in range(3)]
        couche = np.stack(canaux, axis=2) / np.maximum(poids, 1e-3)[..., None]
        bon = (poids > 0.05)[..., None]
        if estime is None:
            estime, acquis = couche, bon
        else:
            estime = np.where(acquis, estime, couche)
            acquis = acquis | bon
    secours = np.median(src_rgb[al < 4], axis=0)
    return np.where(acquis, np.clip(estime, 0, 255), secours)

def decontamine(src_rgb, al, fond):
    """observe = a x sujet + (1 - a) x fond, inverse pour retrouver le sujet."""
    a = al[..., None] / 255.0
    sujet = np.clip(np.where(a > 0.25, (src_rgb - (1 - a) * fond) / np.maximum(a, 1e-6),
                             src_rgb), 0, 255)
    def clarte(x):
        return .299 * x[..., 0] + .587 * x[..., 1] + .114 * x[..., 2]
    plein = np.where(al > 240, clarte(src_rgb), 0).astype(np.uint8)
    voisin = np.asarray(Image.fromarray(plein).filter(ImageFilter.MaxFilter(11))).astype(np.float32)
    cl = clarte(sujet)
    trop = (al > 4) & (al < 250) & (cl > voisin * 1.06) & (voisin > 0)
    f = np.where(trop, (voisin * 1.06) / np.maximum(cl, 1e-6), 1.0)
    return np.clip(sujet * f[..., None], 0, 255)

def nettoie(im, marge=18):
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3]
    w = al.shape[1]
    g = np.clip(np.arange(w) / float(marge), 0, 1)
    al *= np.minimum(g, g[::-1])[None, :]
    a[..., 3] = al
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

def cadre(im, h_src):
    al = np.asarray(im)[..., 3]
    ys, xs = np.where(al > 24)
    y0, y1 = ys.min(), ys.max()
    bande = al[y0:y0 + int((y1 - y0) * .45)]
    bxs = np.where(bande.max(axis=0) > 24)[0]
    cxv = (bxs.min() + bxs.max()) / 2.0
    tete = bxs.max() - bxs.min()
    cote = min((h_src - y0) / (1.0 - HAUT_CHEVEUX), tete * 2.52)
    gy = h_src - cote
    gx = cxv - cote / 2.0
    print('   tete %d px, cote %.0f (%.2f x tete), sommet des cheveux a %.0f %%'
          % (tete, cote, cote / tete, (y0 - gy) / cote * 100))
    return (int(round(gx)), int(round(gy)), int(round(gx + cote)), int(round(gy + cote)))

def fabrique(src_png, sortie, src_brut='source.webp'):
    al = np.asarray(Image.open(src_png).convert('RGBA'))[..., 3].astype(np.float32)
    rgb = np.asarray(Image.open(src_brut).convert('RGB')).astype(np.float32)
    fond = carte_du_fond(rgb, al)
    print('   fond estime localement : #%02x%02x%02x a gauche, #%02x%02x%02x a droite'
          % (tuple(fond[20, 10].astype(int)) + tuple(fond[20, -10].astype(int))))
    couleur = decontamine(rgb, al, fond)
    # meme seuil que la decontamination : ce qu'on ne sait pas corriger, on
    # l'ecarte, au prix de cheveux legerement plus fins
    al = np.clip((al / 255.0 - 0.26) / 0.74, 0, 1) * 255.0
    brut = Image.fromarray(np.clip(np.concatenate([couleur, al[..., None]], 2), 0, 255).astype(np.uint8), 'RGBA')
    im = nettoie(brut)
    g = cadre(im, brut.size[1])
    toile = Image.new('RGBA', (g[2] - g[0], g[3] - g[1]), (0, 0, 0, 0))
    toile.paste(im, (-g[0], -g[1]))
    toile = toile.resize((COTE, COTE), Image.LANCZOS)

    base = Image.fromarray(FB.rendu(*ZONE, COTE).astype(np.uint8)).convert('RGBA')
    ombre = Image.new('RGBA', (COTE, COTE), (0, 0, 0, 0))
    ombre.putalpha(toile.getchannel('A').filter(ImageFilter.GaussianBlur(34)).point(lambda v: int(v * .16)))
    base.paste((0, 11, 17), (0, 12), ombre.getchannel('A'))
    base.alpha_composite(toile)
    base.convert('RGB').save(sortie, quality=95)
    print('->', sortie)

fabrique('decoupe.png', 'NAZAR-photo-profil-4.jpg')
