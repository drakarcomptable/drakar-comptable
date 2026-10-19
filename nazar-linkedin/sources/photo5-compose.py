# -*- coding: utf-8 -*-
"""Pose le cinquieme portrait sur la portion de banniere que le cercle de
LinkedIn recouvre.

Particularite : la source n'est pas une photo mais un avatar deja fabrique,
le sujet detoure sur un disque turquoise uni. Le disque est trop petit pour le
cadrage voulu : les epaules sont coupees par son bord, 5786 pixels du sujet
sont poses sur le rayon 336. Repose tel quel sur le bleu nuit, cela dessinerait
un arc de cercle en bas de l'image.

Le buste est donc prolonge. La silhouette des epaules est extrapolee a partir
des rangees encore intactes, et le tee-shirt, uni, est reconstitue rangee par
rangee a partir de sa couleur mesuree au centre, avec un assombrissement vers
l'exterieur. Le cadre est choisi pour que cette reconstruction reste courte :
elle ne porte que sur les deux coins du bas.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageFilter
import fond_banniere as FB

COTE = 1200
ZONE = (54.0, 210.5, 360.3, 516.9)
HAUT_CHEVEUX = 0.19

DISQUE = np.array([0x04, 0x44, 0x5d], np.float32)   # turquoise de l'avatar
GLACE = np.array([0xe3, 0xf7, 0xfe], np.float32)    # bleu glace autour
CENTRE, RAYON = (400.0, 400.0), 336.0

PADX, PADH, PADB = 24, 72, 24

# derniere rangee ou la silhouette est encore vraie, et sa pente, relevees sur
# le masque entre y=500 et y=545 (coordonnees de la source)
Y_PROPRE = 545
G0, D0 = 144.0, 676.0
PENTE_G, PENTE_D = -1.82, 1.40
TAU = 120.0


def ravale(src_rgb, al, bande=4, rayon=9, marge=22, pente=38):
    """Retire le lisere pale que le decoupage d'origine a laisse sur le sujet.

    Mesure sur l'epaule gauche : le tee-shirt est a 90 de clarte, le bord du
    masque a 165. Ce n'est pas du vetement, c'est le fond clair de la photo
    d'origine reste colle au sujet quand quelqu'un l'a detoure avant nous.
    Sur le bleu nuit de la banniere, ce lisere se verrait comme un trait.

    Le critere est relatif : chaque pixel du bord est compare a la clarte du
    sujet qui l'entoure, relevee a l'ecart de la bande pour qu'elle ne soit
    pas tiree vers le haut par le lisere lui-meme. Le menton ou la joue, dont
    le bord est aussi clair que le coeur, ne bougent pas.
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
    """observe = a x sujet + (1 - a) x fond, inverse pour retrouver le sujet."""
    a = al[..., None] / 255.0
    return np.clip(np.where(a > 0.25, (src_rgb - (1 - a) * fond) / np.maximum(a, 1e-6),
                            src_rgb), 0, 255)


def prolonge_lateral(couleur, propre, y0, y1, chute=.16, portee=230.0, lisse=21):
    """Prolonge le vetement vers l'exterieur, rangee par rangee.

    Le remplissage est un miroir : chaque pixel manquant prend la couleur de
    son symetrique par rapport au bord encore propre de sa rangee. La jonction
    est donc exacte par construction, et le tissu garde ses plis au lieu de
    devenir une plage unie.

    Deux essais avant celui-la. Un etalement par flous successifs laissait des
    arcs concentriques la ou le rayon changeait. Une couleur unique par rangee,
    relevee au bord, etalait sur toute l'epaule le reflet clair qui ne court en
    realite que le long de la couture : cela donnait un liston pale.

    La bordure s'assombrit legerement avec la distance, comme une epaule qui
    s'eloigne de la lumiere.
    """
    H, W = propre.shape
    xg = np.zeros(H, np.float32); xd = np.zeros(H, np.float32)
    vu = np.zeros(H, bool)
    for yy in range(y0, y1):
        s = np.where(propre[yy])[0]
        if len(s) < 40:
            continue
        xg[yy], xd[yy], vu[yy] = s.min(), s.max(), True
    idx = np.where(vu)[0]
    if len(idx) < 10:
        raise SystemExit('pas assez de vetement visible')
    for t in (xg, xd):
        t[:idx[0]] = t[idx[0]]; t[idx[-1] + 1:] = t[idx[-1]]
        for yy in np.where(~vu)[0]:
            if idx[0] < yy < idx[-1]:
                t[yy] = t[yy - 1]
    noyau = np.exp(-np.linspace(-2, 2, lisse) ** 2); noyau /= noyau.sum()
    m = lisse // 2
    for t in (xg, xd):
        t[:] = np.convolve(np.pad(t, m, mode='edge'), noyau, 'valid')

    x = np.arange(W, dtype=np.float32)[None, :]
    g, d = xg[:, None], xd[:, None]
    # symetrique du pixel manquant, ramene dans la zone saine
    xs = np.where(x < g, np.minimum(2 * g - x, d), np.where(x > d, np.maximum(2 * d - x, g), x))
    xs = np.clip(np.rint(xs), 0, W - 1).astype(np.intp)
    reflet = np.take_along_axis(couleur, xs[..., None].repeat(3, 2), axis=1)
    loin = np.clip((np.maximum(g - x, x - d)) / portee, 0, 1)
    return reflet * (1 - chute * loin)[..., None]


def nettoie(a, marge=18):
    al = a[..., 3]
    w = al.shape[1]
    g = np.clip(np.arange(w) / float(marge), 0, 1)
    a[..., 3] = al * np.minimum(g, g[::-1])[None, :]
    return a


def fabrique(src_png, src_brut, sortie, apercu=None):
    al0 = np.asarray(Image.open(src_png).convert('RGBA'))[..., 3].astype(np.float32)
    rgb0 = np.asarray(Image.open(src_brut).convert('RGB')).astype(np.float32)

    # le cadre est mesure sur le masque d'origine, avant prolongement : sinon
    # les epaules reconstruites passeraient pour de la tete
    m0 = al0 > 24
    ys, xs = np.where(m0)
    y0 = ys.min()
    bande = m0[y0:y0 + int((ys.max() - y0) * .45)]
    bxs = np.where(bande.max(axis=0))[0]
    tete = float(bxs.max() - bxs.min())
    cxv = (bxs.min() + bxs.max()) / 2.0
    cote = tete * 2.52
    gx, gy = cxv - cote / 2.0, y0 - HAUT_CHEVEUX * cote
    print('   tete %.0f px, cote %.0f, cadre x %.0f..%.0f  y %.0f..%.0f'
          % (tete, cote, gx, gx + cote, gy, gy + cote))

    al = np.pad(al0, ((PADH, PADB), (PADX, PADX)))
    rgb = np.pad(rgb0, ((PADH, PADB), (PADX, PADX), (0, 0)), mode='edge')
    H, W = al.shape
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = CENTRE[0] + PADX, CENTRE[1] + PADH
    r = np.hypot(x - cx, y - cy)

    # le fond d'origine est connu exactement : disque uni dedans, glace dehors
    fond = np.where((r < RAYON)[..., None], DISQUE, GLACE)
    # pas de ravalement ici : mesure faite, le contour des cheveux ne porte
    # aucun lisere clair (coeur a 52 de clarte, bande a 57, 95e centile 80).
    # L'epaule pale n'est pas un reste de fond, c'est le tee-shirt en pleine
    # lumiere. Le ravaler ne faisait que denteler le bord.
    couleur = decontamine(rgb, al, fond)

    # silhouette prolongee : l'ecart aux rangees intactes decroit en
    # exponentielle, les epaules s'elargissent puis s'assagissent
    yp = Y_PROPRE + PADH
    k = TAU * (1.0 - np.exp(-np.maximum(y - yp, 0) / TAU))
    gauche = G0 + PADX + PENTE_G * k
    droite = D0 + PADX + PENTE_D * k
    al_synth = np.where(y >= yp,
                        np.clip(np.minimum(x - gauche, droite - x) + .5, 0, 1) * 255.0, 0.0)

    # le releve va jusqu'au bord du disque, a trois pixels pres : plus au
    # centre, l'ancre serait prise en pleine lumiere et le prolongement
    # ressortait en clair sur l'epaule, qui est dans l'ombre
    propre = (al > 250) & (r < 330)
    rempli = prolonge_lateral(couleur, propre & (y > 470 + PADH),
                              int(480 + PADH), H)

    # ce qui est remplace, ce n'est pas une couronne de rayon donne : ce sont
    # exactement les pixels que le decoupage d'origine n'a pas rendus pleins.
    # Juge au rayon, il restait un coin sombre la ou le bord du disque entrait
    # dans la silhouette prolongee.
    brut = np.where(y >= yp - 10, np.clip((252.0 - al) / 90.0, 0, 1), 0.0)
    poids = (np.asarray(Image.fromarray((brut * 255).astype(np.uint8))
                        .filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32) / 255.0)[..., None]
    couleur = couleur * (1 - poids) + rempli * poids

    al = np.where(y >= yp, np.maximum(al_synth, np.where(r < 330, al, 0.0)), al)

    a = nettoie(np.concatenate([couleur, al[..., None]], 2))
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')

    g = tuple(int(round(v)) for v in (gx + PADX, gy + PADH,
                                      gx + PADX + cote, gy + PADH + cote))
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
        from PIL import ImageDraw
        ImageDraw.Draw(rond).ellipse((0, 0, COTE - 1, COTE - 1), fill=255)
        vue = Image.new('RGB', (COTE, COTE), (0x00, 0x21, 0x2c))
        vue.paste(base.convert('RGB'), (0, 0), rond)
        vue.save(apercu, quality=92)
        print('->', apercu)


if __name__ == '__main__':
    fabrique('decoupe.png', 'source.jpg', 'NAZAR-photo-profil-5.jpg', 'apercu-5.jpg')
