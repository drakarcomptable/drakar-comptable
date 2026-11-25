/* Mesure, sur la page 3 rendue, si chaque pastille verte est bien enfermee
   dans un cadre rouge, et de combien son centre s'ecarte du centre du cadre.

   On ne regroupe pas les pixels rouges en amas : les bords d'un cadre sont
   fins et se fragmentent. On tire quatre rayons depuis la pastille et on
   cherche le premier bord rouge dans chaque direction. */
const { chromium } = require('playwright');
const img = process.argv[2];
const PORTEE = 400;   // px, au-dela on considere qu'il n'y a pas de bord

(async () => {
  const nav = await chromium.launch();
  const pg = await nav.newPage({ viewport: { width: 1200, height: 800 } });
  await pg.goto('http://127.0.0.1:8779/');
  const r = await pg.evaluate(async (src) => {
    const im = new Image();
    im.src = src;
    await im.decode();
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    const W = c.width, H = c.height;
    const at = (xx, yy) => { const i = (yy * W + xx) * 4; return [d[i], d[i+1], d[i+2]]; };
    const vert  = (xx, yy) => { const [r,g,b] = at(xx,yy); return g > 180 && r < 120 && b < 120; };
    const rouge = (xx, yy) => { const [r,g,b] = at(xx,yy); return r > 170 && g < 80 && b < 80; };

    // centres des pastilles vertes
    const vus = new Set(), pastilles = [];
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
      if (!vert(xx, y) || vus.has(y * W + xx)) continue;
      let sx = 0, sy = 0, n = 0;
      const pile = [[xx, y]];
      while (pile.length) {
        const [px, py] = pile.pop();
        const k = py * W + px;
        if (px < 0 || py < 0 || px >= W || py >= H || vus.has(k) || !vert(px, py)) continue;
        vus.add(k); sx += px; sy += py; n++;
        pile.push([px+1,py],[px-1,py],[px,py+1],[px,py-1]);
      }
      if (n > 30) pastilles.push({ cx: Math.round(sx/n), cy: Math.round(sy/n), n });
    }
    return { W, H, pastilles, data: null };
  }, 'http://127.0.0.1:8779/' + img);

  // deuxieme passe : les rayons, cote navigateur pour garder l'acces aux pixels
  const res = await pg.evaluate(async (a) => {
    const [src, pastilles, PORTEE] = a;
    const im = new Image(); im.src = src; await im.decode();
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    const W = c.width, H = c.height;
    const rouge = (xx, yy) => { const i = (yy*W+xx)*4;
      return d[i] > 170 && d[i+1] < 80 && d[i+2] < 80; };
    return pastilles.map(p => {
      const tir = (dx, dy) => {
        for (let k = 4; k < PORTEE; k++) {
          const xx = p.cx + dx*k, yy = p.cy + dy*k;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) return null;
          if (rouge(xx, yy)) return k;
        }
        return null;
      };
      return { cx: p.cx, cy: p.cy,
               g: tir(-1,0), dr: tir(1,0), h: tir(0,-1), b: tir(0,1) };
    });
  }, ['http://127.0.0.1:8779/' + img, r.pastilles, PORTEE]);

  await nav.close();

  console.log('page rendue : ' + r.W + 'x' + r.H);
  console.log('pastilles trouvees : ' + res.length);
  let bons = 0;
  res.forEach((p, i) => {
    const ferme = p.g && p.dr && p.h && p.b;
    if (!ferme) {
      console.log('  RATE pastille ' + (i+1) + ' (' + p.cx + ',' + p.cy +
        ') : bords gauche=' + p.g + ' droit=' + p.dr + ' haut=' + p.h + ' bas=' + p.b);
      return;
    }
    const ex = (p.dr - p.g) / 2, ey = (p.b - p.h) / 2;   // ecart au centre du cadre
    const lx = p.g + p.dr, ly = p.h + p.b;
    const px = Math.abs(ex) / lx * 100, py = Math.abs(ey) / ly * 100;
    const juste = px < 4 && py < 4;
    if (juste) bons++;
    console.log('  ' + (juste ? 'OK  ' : 'RATE') + ' pastille ' + (i+1) +
      ' (' + p.cx + ',' + p.cy + ') encadree ' + lx + 'x' + ly + ' px, ' +
      'decalee de ' + px.toFixed(1) + '% en x et ' + py.toFixed(1) + '% en y');
  });
  console.log('');
  console.log('  ' + bons + ' / ' + res.length + ' pastilles centrees dans leur cadre');
  process.exit(bons === res.length && res.length > 0 ? 0 : 1);
})();
