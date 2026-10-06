# -*- coding: utf-8 -*-
"""Pose le portrait detoure sur le fond de la banniere.

Trois precautions :
  - le feuillage que le masque a laisse passer est retire sur un critere de
    teinte, puis le vert qui deteint sur les bords est neutralise ;
  - les epaules touchent les bords de la photo d'origine : elles y sont
    estompees, sinon le cadre de la source apparait en trait net ;
  - le cadrage descend jusqu'au bas de la source et place le sommet des
    cheveux a 17 % du haut, pour que le cercle d'affichage de LinkedIn ne
    rogne ni les cheveux ni le menton.
"""
import math
import numpy as np
from PIL import Image, ImageFilter

COTE = 1200
NUIT, PROF, HAUT = (0x00,0x21,0x2c), (0x00,0x30,0x3f), (0x0a,0x4a,0x60)
ACC = (0x7f,0xd8,0xee)

def fond(n=COTE):
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    cx, cy = n*.82, n*.10
    r = np.clip(np.sqrt(((x-cx)/(n*1.25))**2 + ((y-cy)/(n*1.35))**2), 0, 1)
    img = np.zeros((n, n, 3), np.float32)
    for i in range(3):
        a, b, c = HAUT[i], PROF[i], NUIT[i]
        img[..., i] = np.where(r < .42, a + (b-a)*(r/.42), b + (c-b)*((r-.42)/.58))
    lignes = np.zeros((n, n), np.float32)
    for k in range(30):
        t = k/29.0
        base = -n*.22 + t*n*1.34
        amp = n*(.055 + .04*math.sin(t*math.pi))
        d = np.abs(y - (base + amp*np.sin(x/n*5.1 + t*2.3) - t*n*.04))
        lignes += np.clip(1.0 - d/1.7, 0, 1) * (.30 + .34*math.sin(t*math.pi))
    lignes = np.clip(lignes, 0, 1)
    for i in range(3):
        img[..., i] = img[..., i]*(1 - lignes*.20) + ACC[i]*lignes*.20
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))

def nettoie(im, marge=34):
    a = np.asarray(im).astype(np.float32)
    rgb, al = a[..., :3], a[..., 3]
    r, v, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h, w = al.shape

    # Seuils releves sur l'image elle-meme. Le rapport vert/bleu separe le
    # feuillage (1,73 a 1,80) de tout le reste : peau 1,05, barbe 1,09,
    # boucle d'oreille 1,28, chaine 1,00, blazer 0,59, tee-shirt 0,88. Le
    # rapport vert/rouge ecarte en plus la boucle d'oreille, seule a flirter
    # avec le premier seuil.
    feuillage = (v > b*1.26) & (v > r*0.94) & (al > 0)
    m = Image.fromarray(np.where(feuillage, 0, 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))
    al = np.minimum(al, np.asarray(m).astype(np.float32))

    # estompage le long des bords de la source, la ou le sujet est coupe net
    ramp = np.ones((h, w), np.float32)
    g = np.clip(np.arange(w)/float(marge), 0, 1)
    ramp *= np.minimum(g, g[::-1])[None, :]
    gb = np.clip((h-1-np.arange(h))/float(marge), 0, 1)
    ramp *= np.maximum(gb, 0)[:, None] * 0 + 1.0  # bas conserve : il touche le bord du cadre
    al *= ramp

    # Sous la machoire droite, un bouquet de feuillage clair touche la barbe :
    # le modele le rattache au sujet et sa couleur ne le distingue plus des
    # poils chauds. Sur cette seule zone, tout ce qui n'est pas pleinement
    # opaque est ecarte. La barbe y est deja dense, le bord franc ne se voit
    # pas, alors que la touffe jaune, elle, n'etait faite que de demi-teintes.
    zx0, zy0, zx1, zy1 = 520, 596, 660, 742
    coin = al[zy0:zy1, zx0:zx1]
    coin[coin < 250] = 0
    al[zy0:zy1, zx0:zx1] = np.asarray(
        Image.fromarray(coin.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))
    ).astype(np.float32)

    # Des poils de barbe en bordure ont capte la lumiere jaune-vert du
    # feuillage. Ils appartiennent au sujet, on ne peut donc pas les retirer :
    # on leur retire leur dominante. Le rapport vert/rouge sert de garde-fou,
    # il met hors d'atteinte tout ce qui est chair ou dore : peau 0,81,
    # barbe 0,75, dents 0,64, boucle d'oreille 0,86, chaine 0,84, alors que
    # la lumiere parasite est a 1,03.
    teinte = (al > 4) & (v > b*1.18) & (v > r*0.92)
    v[teinte] = np.minimum(v[teinte], b[teinte]*1.05)
    a[..., 1] = v
    a[..., 3] = al
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

def cadre(im, hauteur_src):
    al = np.asarray(im)[..., 3]
    ys, xs = np.where(al > 24)
    y0 = ys.min(); y1 = ys.max()
    bande = al[y0:y0 + int((y1-y0)*.45)]
    bxs = np.where(bande.max(axis=0) > 24)[0]
    cxv = (bxs.min() + bxs.max())/2.0
    tete = bxs.max() - bxs.min()
    cote = tete*2.52
    # le bas du cadre coincide avec le bas de la source : pas de vide sous le buste
    gy = hauteur_src - cote
    gx = cxv - cote/2.0
    print('   tete %d px, cote %d, sommet des cheveux a %.0f %% du haut'
          % (tete, cote, (y0-gy)/cote*100))
    return (int(round(gx)), int(round(gy)), int(round(gx+cote)), int(round(gy+cote)))

def fabrique(src_png, sortie):
    brut = Image.open(src_png).convert('RGBA')
    im = nettoie(brut)
    g = cadre(im, brut.size[1])
    toile = Image.new('RGBA', (g[2]-g[0], g[3]-g[1]), (0, 0, 0, 0))
    toile.paste(im, (-g[0], -g[1]))
    toile = toile.resize((COTE, COTE), Image.LANCZOS)

    base = fond().convert('RGBA')
    ombre = Image.new('RGBA', (COTE, COTE), (0, 0, 0, 0))
    ombre.putalpha(toile.getchannel('A').filter(ImageFilter.GaussianBlur(30))
                        .point(lambda v: int(v*.38)))
    base.paste((0, 11, 17), (0, 12), ombre.getchannel('A'))
    base.alpha_composite(toile)
    base.convert('RGB').save(sortie, quality=95)
    print('->', sortie)

for nom in ('isnet-general-use', 'u2net_human_seg', 'u2net'):
    print(nom)
    fabrique('decoupe-%s.png' % nom, 'portrait-%s.jpg' % nom)
