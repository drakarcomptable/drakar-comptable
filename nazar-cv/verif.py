# -*- coding: utf-8 -*-
"""Compare la refabrication au PDF d'origine, ligne par ligne.

Pour chaque ligne de texte commune aux deux, l'ecart de largeur dit si le
corps est bon, et l'ecart de hauteur si les marges le sont.
"""
import os, statistics, sys
import pymupdf
ICI = os.path.dirname(os.path.abspath(__file__))

def lignes(f):
    d = pymupdf.open(f); out = {}
    for b in d[0].get_text('dict')['blocks']:
        if b['type']: continue
        for l in b['lines']:
            t = ''.join(s['text'] for s in l['spans']).strip()
            if t:
                out.setdefault(t, (l['bbox'][0], l['bbox'][2], l['bbox'][1]))
    return out

def compare(origine, mien, detail=True):
    a, b = lignes(origine), lignes(mien)
    comm = [t for t in a if t in b]
    print('%d lignes communes (origine %d, refabrication %d)' % (len(comm), len(a), len(b)))
    dl, dy, dx = [], [], []
    for t in sorted(comm, key=lambda t: a[t][2]):
        wa, wb = a[t][1] - a[t][0], b[t][1] - b[t][0]
        if wa > 30:
            dl.append(wb / wa - 1)
        dy.append(b[t][2] - a[t][2])
        dx.append(b[t][0] - a[t][0])
        if detail and (abs(b[t][2] - a[t][2]) > 3 or (wa > 30 and abs(wb/wa - 1) > .04)):
            print('  %+5.1f%% larg  %+6.1f pt haut  %+5.1f pt gauche  %s'
                  % ((wb/wa - 1) * 100 if wa > 30 else 0,
                     b[t][2] - a[t][2], b[t][0] - a[t][0], t[:52]))
    print('largeur : median %+.2f%%, pire %+.1f%%' % (statistics.median(dl) * 100,
          max(dl, key=abs) * 100))
    print('hauteur : median %+.1f pt, pire %+.1f pt' % (statistics.median(dy),
          max(dy, key=abs)))
    print('gauche  : median %+.1f pt, pire %+.1f pt' % (statistics.median(dx),
          max(dx, key=abs)))

if __name__ == '__main__':
    compare(os.environ.get('CV_ORIGINE', os.path.join(ICI, 'CV-Clement-Marinho-origine.pdf')),
            os.path.join(ICI, 'CV-Clement-Marinho.pdf'))
