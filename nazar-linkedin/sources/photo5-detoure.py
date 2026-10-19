# -*- coding: utf-8 -*-
import numpy as np
from PIL import Image
from rembg import remove, new_session
im = Image.open('source.jpg').convert('RGB')
s = new_session('isnet-general-use')
out = remove(im, session=s, alpha_matting=True, alpha_matting_foreground_threshold=250,
             alpha_matting_background_threshold=15, alpha_matting_erode_size=8)
out.save('decoupe.png')
al = np.asarray(out)[..., 3]
ys, xs = np.where(al > 24)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
bande = al[y0:y0 + int((y1-y0)*.45)]
bxs = np.where(bande.max(axis=0) > 24)[0]
print('sujet : x %d..%d  y %d..%d' % (x0, x1, y0, y1))
print('tete  : largeur %d px, centre x %.0f' % (bxs.max()-bxs.min(), (bxs.min()+bxs.max())/2))
# le sujet touche-t-il le bord du disque ?
yy, xx = np.mgrid[0:800, 0:800]
r = np.sqrt((xx-400.)**2 + (yy-400.)**2)
print('sur le bord du disque (rayon 330 a 336) : %d pixels du sujet'
      % ((al > 24) & (r > 330) & (r <= 336)).sum())
