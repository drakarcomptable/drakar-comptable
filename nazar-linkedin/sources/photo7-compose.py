# -*- coding: utf-8 -*-
"""Pose le septieme portrait sur la portion de banniere que le cercle de
LinkedIn recouvre.

La source est un avatar deja fabrique, 360 x 360, detoure sur un bleu uni
mesure a #6ab0f8 (ecart-type 1,2 : il est vraiment uni). Le fond a donc une
couleur connue, et la decontamination du contour est exacte.

Deux difficultes propres a celle-ci. Le sujet est cadre tres serre : il touche
le bord droit et le bas de l'image, alors que le cadre voulu, 2,52 largeurs de
tete comme pour les six autres, mesure 446 pixels. Il manque donc une bande a
droite et en bas, prolongee tout droit depuis la derniere colonne et la
derniere rangee. Un prolongement au miroir, essaye d'abord, repliait le buste
entier et dessinait des losanges au coin : sur une image aussi serree, le
miroir ramene le visage dans la zone a combler.

Ensuite, le detourage d'origine a laisse des pixels bleus dans les boucles.
Ils sont retires sur leur couleur : ce qui est bleu et proche du bleu du fond
n'est pas du cheveu.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import fond_banniere as FB

COTE = 1200
ZONE = (54.0, 210.5, 360.3, 516.9)
HAUT_CHEVEUX = 0.19
FOND = np.array([106.0, 176.0, 248.0], np.float32)
PAD_G, PAD_D, PAD_H, PAD_B = 40, 90, 80, 50


def ravale(src_rgb, al, bande=3, rayon=7, marge=30, pente=45):
    """Retire du masque les paillettes claires restees sur le contour.

    Le detourage d'origine a laisse, le long des boucles, des pixels bleu-blanc
    que la compression a etales : ils sont pleinement opaques, donc ni le seuil
    d'opacite ni le plafond de clarte ne les attrapent. Leur clarte est de
    l'ordre de 190 la ou le cheveu est a 60.

    Le critere est relatif : chaque pixel du bord est compare a la clarte du
    sujet qui l'entoure, relevee a l'ecart de la bande pour qu'elle ne soit pas
    tiree vers le haut par les paillettes elles-memes. Au bord de la joue, le
    coeur est aussi clair que le bord : la peau ne bouge pas.
    """
    def clarte(v):
        return .299 * v[..., 0] + .587 * v[..., 1] + .114 * v[..., 2]

    bord = np.asarray(Image.fromarray(((al < 250) * 255).astype(np.uint8))
                      .filter(ImageFilter.MaxFilter(2 * bande + 1))).astype(np.float32) / 255.0
    proche = bord > 0.5
    coeur = ((al > 240) & ~proche).astype(np.float32)
    poids = np.asarray(Image.fromarray((coeur * 255).astype(np.uint8))
                       .filter(ImageFilter.GaussianBlur(rayon))).astype(np.float32) / 255.0
    somme = np.asarray(Image.fromarray((clarte(src_rgb) * coeur).astype(np.uint8))
                       .filter(ImageFilter.GaussianBlur(rayon))).astype(np.float32)
    cv = somme / np.maximum(poids, 1e-3)
    sur = poids > 0.04
    garde = np.clip(1.0 - (clarte(src_rgb) - cv - marge) / float(pente), 0.0, 1.0)
    return al * np.where(proche & sur, garde, 1.0)


def decontamine(src_rgb, al, fond):
    """observe = a x sujet + (1 - a) x fond, inverse pour retrouver le sujet.

    La division par l'opacite s'emballe quand celle-ci est faible : un pixel a
    peine opaque, presque entierement du fond, ressort en clair vif. Sur le
    contour des boucles cela donnait des paillettes bleu-blanc. La clarte
    obtenue est donc plafonnee a celle du sujet plein qui entoure le pixel.
    """
    a = al[..., None] / 255.0
    sujet = np.clip(np.where(a > 0.25, (src_rgb - (1 - a) * fond) / np.maximum(a, 1e-6),
                             src_rgb), 0, 255)

    def clarte(v):
        return .299 * v[..., 0] + .587 * v[..., 1] + .114 * v[..., 2]

    plein = np.where(al > 240, clarte(src_rgb), 0).astype(np.uint8)
    voisin = np.asarray(Image.fromarray(plein).filter(ImageFilter.MaxFilter(7))).astype(np.float32)
    cl = clarte(sujet)
    trop = (al > 4) & (al < 250) & (cl > voisin * 1.06) & (voisin > 0)
    f = np.where(trop, (voisin * 1.06) / np.maximum(cl, 1e-6), 1.0)
    return np.clip(sujet * f[..., None], 0, 255)


def nettoie(a, marge=16):
    al = a[..., 3]
    w = al.shape[1]
    g = np.clip(np.arange(w) / float(marge), 0, 1)
    a[..., 3] = al * np.minimum(g, g[::-1])[None, :]
    return a


def fabrique(src_png, src_brut, sortie, apercu=None):
    al0 = np.asarray(Image.open(src_png).convert('RGBA'))[..., 3].astype(np.float32)
    rgb0 = np.asarray(Image.open(src_brut).convert('RGB')).astype(np.float32)

    # le bleu reste accroche dans les boucles par le decoupage d'origine. Le
    # critere porte sur la teinte autant que sur la distance : un pixel bleu,
    # proche du fond, n'est pas du cheveu. La peau, dont le rouge domine, et
    # le tee-shirt marine, a 255 du fond, ne sont pas concernes.
    ecart = np.sqrt(((rgb0 - FOND) ** 2).sum(axis=2))
    bleuatre = rgb0[..., 2] > rgb0[..., 0] * 1.25
    al0 = al0 * np.where(bleuatre, np.clip(ecart / 140.0, 0, 1), 1.0)
    al0 = ravale(rgb0, al0)
    couleur0 = decontamine(rgb0, al0, FOND)
    # le halo restant est coupe net : ce qui est a moins d'un quart opaque
    # n'est plus du sujet, c'est du bleu qui s'accroche
    al0 = np.clip((al0 / 255.0 - 0.24) / 0.76, 0, 1) * 255.0

    m = al0 > 24
    ys, xs = np.where(m)
    y0 = ys.min()
    bande = m[y0:y0 + int((ys.max() - y0) * .45)]
    bxs = np.where(bande.max(axis=0))[0]
    tete = float(bxs.max() - bxs.min())
    cxv = (bxs.min() + bxs.max()) / 2.0
    cote = tete * 2.52
    gx, gy = cxv - cote / 2.0 + PAD_G, y0 - HAUT_CHEVEUX * cote + PAD_H
    print('   tete %.0f px, cote %.0f, cadre x %.0f..%.0f  y %.0f..%.0f (toile %dx%d)'
          % (tete, cote, gx, gx + cote, gy, gy + cote,
             360 + PAD_G + PAD_D, 360 + PAD_H + PAD_B))

    al = np.pad(al0, ((PAD_H, PAD_B), (PAD_G, PAD_D)), mode='edge')
    couleur = np.pad(couleur0, ((PAD_H, PAD_B), (PAD_G, PAD_D), (0, 0)), mode='edge')
    # le prolongement du masque est adouci, sinon la jonction se devine a un
    # changement net de grain
    al = np.asarray(Image.fromarray(al.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6))).astype(np.float32)

    a = nettoie(np.concatenate([couleur, al[..., None]], 2))
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')

    g = tuple(int(round(v)) for v in (gx, gy, gx + cote, gy + cote))
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
    if apercu:
        rond = Image.new('L', (COTE, COTE), 0)
        ImageDraw.Draw(rond).ellipse((0, 0, COTE - 1, COTE - 1), fill=255)
        vue = Image.new('RGB', (COTE, COTE), (0x00, 0x21, 0x2c))
        vue.paste(base.convert('RGB'), (0, 0), rond)
        vue.save(apercu, quality=92)
        print('->', apercu)


if __name__ == '__main__':
    fabrique('decoupe.png', 'source.webp', 'NAZAR-photo-profil-7.jpg', 'apercu-7.jpg')
