# -*- coding: utf-8 -*-
"""Reproduit en calcul le fond de la banniere, pour pouvoir l'evaluer
n'importe ou, y compris sous son bord bas.

Le navigateur ne sait dessiner que les 1584 x 396 de la banniere. Or le
cercle de la photo de profil deborde en dessous. Il faut donc la meme
formule, mais prolongeable. Elle est verifiee contre le rendu du navigateur
avant d'etre utilisee.
"""
import math
import numpy as np

L, H = 1584.0, 396.0                      # dimensions de la banniere
NUIT, PROF, HAUT = (0x00,0x21,0x2c), (0x00,0x30,0x3f), (0x0a,0x4a,0x60)
ACC = (0x7f, 0xd8, 0xee)
VOILE = (0, 33, 44)

def _degrade(x, y):
    """radial-gradient(130% 150% at 88% 12%, #0a4a60 0%, #00303f 42%, #00212c 100%)"""
    cx, cy, rx, ry = .88*L, .12*H, 1.30*L, 1.50*H
    t = np.clip(np.sqrt(((x-cx)/rx)**2 + ((y-cy)/ry)**2), 0, 1)
    img = np.empty(x.shape + (3,), np.float64)
    for i in range(3):
        a, b, c = HAUT[i], PROF[i], NUIT[i]
        img[..., i] = np.where(t < .42, a + (b-a)*(t/.42), b + (c-b)*((t-.42)/.58))
    return img

def _courbe(i, n, xs):
    """Ordonnee de la i-eme ligne de niveau, aux abscisses xs.

    Les beziers du SVG ont leurs points de controle a la meme ordonnee que
    leurs extremites : on les echantillonne puis on interpole, plutot que de
    les rasteriser."""
    t = i/float(n-1)
    base = -H*.34 + t*H*1.46
    amp = H*(.085 + .055*math.sin(t*math.pi))
    pas = L/7.0
    px, py = [], []
    for k in range(8):
        px.append(k*pas)
        py.append(base + amp*math.sin(k*.82 + t*2.1) - t*H*.05)
    ex, ey = [], []
    u = np.linspace(0, 1, 160)
    for k in range(1, 8):
        x0, y0, x1, y1 = px[k-1], py[k-1], px[k], py[k]
        c0x, c1x = x0 + pas*.45, x1 - pas*.45
        bx = (1-u)**3*x0 + 3*(1-u)**2*u*c0x + 3*(1-u)*u**2*c1x + u**3*x1
        by = (1-u)**3*y0 + 3*(1-u)**2*u*y0 + 3*(1-u)*u**2*y1 + u**3*y1
        ex.append(bx); ey.append(by)
    ex = np.concatenate(ex); ey = np.concatenate(ey)
    o = np.argsort(ex)
    return np.interp(xs, ex[o], ey[o]), .16*(.45 + .55*math.sin(t*math.pi))

def _lignes(img, x, y, n=26, epaisseur=1.6):
    xs = x[0] if x.ndim == 2 else x
    for i in range(n):
        yc, o = _courbe(i, n, xs)
        d = np.abs(y - yc[None, :])
        couv = np.clip(epaisseur/2.0 + .5 - d, 0, 1) * o
        for c in range(3):
            img[..., c] = img[..., c]*(1-couv) + ACC[c]*couv
    return img

def _voile(img, x, y):
    """linear-gradient(100deg, rgba(0,33,44,.92), rgba(0,33,44,.55) 34%, rgba(0,33,44,0) 62%)"""
    a = math.radians(100.0)
    dx, dy = math.sin(a), -math.cos(a)
    lg = abs(L*math.sin(a)) + abs(H*math.cos(a))
    p = .5 + ((x - L/2)*dx + (y - H/2)*dy)/lg
    al = np.where(p < 0, .92,
         np.where(p < .34, .92 + (.55-.92)*(p/.34),
         np.where(p < .62, .55 + (0-.55)*((p-.34)/.28), 0.0)))
    for c in range(3):
        img[..., c] = img[..., c]*(1-al) + VOILE[c]*al
    return img

def rendu(x0, y0, x1, y1, taille):
    """Le fond de la banniere sur le rectangle demande, en `taille` pixels."""
    xs = x0 + (np.arange(taille) + .5)*(x1-x0)/taille
    ys = y0 + (np.arange(taille) + .5)*(y1-y0)/taille
    x, y = np.meshgrid(xs, ys)
    img = _degrade(x, y)
    img = _lignes(img, x, y)
    img = _voile(img, x, y)
    return np.clip(img, 0, 255)
