# -*- coding: utf-8 -*-
import numpy as np
from PIL import Image
from rembg import remove, new_session
im = Image.open('source.jpg').convert('RGB')
s = new_session('isnet-general-use')
# erosion de 4 et seuils rapproches : sur cette photo, le contraste entre les
# cheveux (clarte 80) et le mur (201) est faible et la compression a brouille
# le bord. Les reglages des portraits precedents mangeaient les meches.
out = remove(im, session=s, alpha_matting=True, alpha_matting_foreground_threshold=240,
             alpha_matting_background_threshold=20, alpha_matting_erode_size=4)
out.save('decoupe.png')
al = np.asarray(out)[..., 3]
ys, xs = np.where(al > 24)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
bande = al[y0:y0 + int((y1 - y0) * .45)]
bxs = np.where(bande.max(axis=0) > 24)[0]
print('image : %dx%d' % (al.shape[1], al.shape[0]))
print('sujet : x %d..%d  y %d..%d' % (x0, x1, y0, y1))
print('tete  : largeur %d px, centre x %.0f' % (bxs.max() - bxs.min(), (bxs.min() + bxs.max()) / 2))
rgb = np.asarray(im).astype(np.float32)
cl = .299 * rgb[..., 0] + .587 * rgb[..., 1] + .114 * rgb[..., 2]
print('fond (al<4) clarte mediane %.0f ; sujet plein %.0f ; bande 4<al<250 mediane %.0f, 95e %.0f'
      % (np.median(cl[al < 4]), np.median(cl[al > 250]),
         np.median(cl[(al > 4) & (al < 250)]), np.percentile(cl[(al > 4) & (al < 250)], 95)))
