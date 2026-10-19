# -*- coding: utf-8 -*-
import numpy as np
from PIL import Image
from rembg import remove, new_session
im = Image.open('source.webp').convert('RGB')
s = new_session('isnet-general-use')
out = remove(im, session=s, alpha_matting=True, alpha_matting_foreground_threshold=250,
             alpha_matting_background_threshold=15, alpha_matting_erode_size=4)
out.save('decoupe.png')
al = np.asarray(out)[..., 3]
rgb = np.asarray(im).astype(np.float32)
ys, xs = np.where(al > 24)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
bande = al[y0:y0 + int((y1 - y0) * .45)]
bxs = np.where(bande.max(axis=0) > 24)[0]
print('image : %dx%d' % (al.shape[1], al.shape[0]))
print('sujet : x %d..%d  y %d..%d' % (x0, x1, y0, y1))
print('tete  : largeur %d px, centre x %.0f' % (bxs.max() - bxs.min(), (bxs.min() + bxs.max()) / 2))
f = rgb[al < 4]
print('fond : moyenne %s, ecart-type %s, coins %s %s %s %s'
      % (f.mean(0).round(1), f.std(0).round(2), rgb[2,2], rgb[2,-3], rgb[-3,2], rgb[-3,-3]))
cl = .299*rgb[...,0]+.587*rgb[...,1]+.114*rgb[...,2]
print('clarte : fond %.0f, sujet %.0f, bande %.0f (95e %.0f)'
      % (np.median(cl[al<4]), np.median(cl[al>250]), np.median(cl[(al>4)&(al<250)]), np.percentile(cl[(al>4)&(al<250)],95)))
