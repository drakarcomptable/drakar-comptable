# -*- coding: utf-8 -*-
"""Pose un portrait detoure sur la portion de banniere que le cercle de
LinkedIn recouvre, comme pour la premiere photo.

Difference avec la precedente : la source est carree et le sujet y touche
les trois bords. Le cadrage ne peut donc pas s'elargir autant. Il est calcule
pour que le sommet des cheveux tombe a la meme hauteur relative, le buste
atteignant toujours le bas du cadre : c'est ce qui evite un buste flottant.
"""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageFilter
import fond_banniere as FB

COTE = 1200
ZONE = (54.0, 210.5, 360.3, 516.9)   # releve sur une capture du profil
HAUT_CHEVEUX = 0.19                  # part du cadre laissee au-dessus de la tete

def decontamine(src_rgb, al, fond):
    """Retire du bord la couleur du fond d'origine.

    Un pixel de bord n'est ni le sujet ni le fond, mais leur melange :
      observe = a x sujet + (1 - a) x fond
    Le fond est ici un gris uniforme, mesure a #f0eae3 avec un ecart type de
    5,6 : il est donc connu, et la vraie couleur du sujet se retrouve par
    calcul. Sans cela, les meches gardent la clarte du studio et dessinent un
    halo pale des qu'on les pose sur du bleu nuit.

    En dessous de 25 % d'opacite la division amplifie le bruit du masque
    plutot qu'elle ne retire le gris : ces pixels sont laisses tels quels.
    """
    a = al[..., None] / 255.0
    sujet = np.where(a > 0.25, (src_rgb - (1 - a) * fond) / np.maximum(a, 1e-6), src_rgb)
    sujet = np.clip(sujet, 0, 255)

    # La division reste instable entre un quart et la moitie d'opacite : quand
    # le pixel observe depasse a peine le fond, la couleur reconstituee part
    # vers le blanc et les meches ressortent blanchies. On la plafonne donc par
    # celle du sujet voisin : un pixel de bord ne peut pas etre plus clair que
    # le plus clair des pixels pleins qui l'entourent.
    def clarte(x):
        return .299 * x[..., 0] + .587 * x[..., 1] + .114 * x[..., 2]
    plein = np.where(al > 240, clarte(src_rgb), 0).astype(np.uint8)
    voisin = np.asarray(Image.fromarray(plein).filter(ImageFilter.MaxFilter(15))).astype(np.float32)
    cl = clarte(sujet)
    trop = (al > 4) & (al < 250) & (cl > voisin * 1.06) & (voisin > 0)
    facteur = np.where(trop, (voisin * 1.06) / np.maximum(cl, 1e-6), 1.0)
    return np.clip(sujet * facteur[..., None], 0, 255)

def nettoie(im, marge=34):
    """Estompe le sujet le long des bords de la source, la ou il est coupe net.

    Pas de filtre de teinte ici : le fond d'origine est un gris uniforme, il
    ne deteint pas, et les cheveux roux auraient ete les premiers a souffrir
    d'une regle calibree sur du feuillage vert.
    """
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3]
    h, w = al.shape
    g = np.clip(np.arange(w) / float(marge), 0, 1)
    al *= np.minimum(g, g[::-1])[None, :]
    gb = np.clip(np.arange(h)[::-1] / float(marge), 0, 1)
    al *= np.maximum(gb, 0)[:, None] * 0 + 1.0   # bas conserve : il borde le cadre
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
    # le bas du cadre colle au bas de la source ; de la decoule la seule taille
    # de cadre qui place le sommet des cheveux a la hauteur voulue
    cote = (h_src - y0) / (1.0 - HAUT_CHEVEUX)
    cote = min(cote, tete * 2.52)        # jamais plus large que la premiere photo
    gy = h_src - cote
    gx = cxv - cote / 2.0
    print('   tete %d px, cote %.0f (%.2f x tete), sommet des cheveux a %.0f %%'
          % (tete, cote, cote / tete, (y0 - gy) / cote * 100))
    return (int(round(gx)), int(round(gy)), int(round(gx + cote)), int(round(gy + cote)))

def fabrique(src_png, sortie, src_brut='source.webp'):
    masque = Image.open(src_png).convert('RGBA')
    al = np.asarray(masque)[..., 3].astype(np.float32)
    rgb = np.asarray(Image.open(src_brut).convert('RGB')).astype(np.float32)
    fond = np.median(rgb[al < 4], axis=0)
    print('   fond d\'origine mesure : #%02x%02x%02x' % tuple(fond.astype(int)))
    couleur = decontamine(rgb, al, fond)
    # Le masque est bruite dans les meches fines : une nuee de pixels a tres
    # faible opacite, que la decontamination laisse au gris du studio faute de
    # pouvoir les corriger. Ils n'apportent que du voile sur fond sombre. Le
    # bas de l'echelle d'opacite est donc ramene a zero, et le reste reetale :
    # les cheveux perdent un peu d'epaisseur, le halo disparait.
    al = np.clip((al / 255.0 - 0.18) / 0.82, 0, 1) * 255.0
    propre = np.concatenate([couleur, al[..., None]], axis=2)
    brut = Image.fromarray(np.clip(propre, 0, 255).astype(np.uint8), 'RGBA')
    im = nettoie(brut)
    g = cadre(im, brut.size[1])
    toile = Image.new('RGBA', (g[2] - g[0], g[3] - g[1]), (0, 0, 0, 0))
    toile.paste(im, (-g[0], -g[1]))
    toile = toile.resize((COTE, COTE), Image.LANCZOS)

    base = Image.fromarray(FB.rendu(ZONE[0], ZONE[1], ZONE[2], ZONE[3], COTE)
                             .astype(np.uint8)).convert('RGBA')
    ombre = Image.new('RGBA', (COTE, COTE), (0, 0, 0, 0))
    ombre.putalpha(toile.getchannel('A').filter(ImageFilter.GaussianBlur(34))
                        .point(lambda v: int(v * .16)))
    base.paste((0, 11, 17), (0, 12), ombre.getchannel('A'))
    base.alpha_composite(toile)
    base.convert('RGB').save(sortie, quality=95)
    print('->', sortie)

fabrique('decoupe.png', 'NAZAR-photo-profil-2.jpg')
