/* Prepare les visuels du PDF.

   Chromium ne sait pas recopier une image WebP telle quelle dans un PDF :
   il la decode et la re-encode sans compression. Les quatre photos de cas
   pesaient 184 Ko en WebP et ressortaient a 3,2 Mo dans le fichier. En
   JPEG, il les recopie sans y toucher.

   Les portraits, eux, sont des carres de 1200 px affiches a 66 px. Les
   reduire ne change rien a l'ecran et allege d'autant.

   Lancement :  node proposition/visuels.cjs
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ICI = path.dirname(path.resolve(__filename));
const SITE = path.join(ICI, '..', 'nazar-site');
const EQUIPE = path.join(ICI, 'equipe');
const SORTIE = path.join(ICI, 'visuels');

// source, destination, largeur voulue, qualite
const TRAVAUX = [
  { de: [SITE, 'cas-01.webp'], vers: 'cas-01.jpg', l: 720, q: 0.82 },
  { de: [SITE, 'cas-02.webp'], vers: 'cas-02.jpg', l: 720, q: 0.82 },
  { de: [SITE, 'cas-03.webp'], vers: 'cas-03.jpg', l: 720, q: 0.82 },
  { de: [SITE, 'cas-04.webp'], vers: 'cas-04.jpg', l: 720, q: 0.82 },
  { de: [EQUIPE, 'mael.jpg'], vers: 'mael.jpg', l: 220, q: 0.86 },
  { de: [EQUIPE, 'clement.jpg'], vers: 'clement.jpg', l: 220, q: 0.86 },
  { de: [EQUIPE, 'francois.jpg'], vers: 'francois.jpg', l: 220, q: 0.86 },
  { de: [EQUIPE, 'florian.jpg'], vers: 'florian.jpg', l: 220, q: 0.86 },
  { de: [EQUIPE, 'celine.jpg'], vers: 'celine.jpg', l: 220, q: 0.86 },
];

(async () => {
  if (!fs.existsSync(SORTIE)) fs.mkdirSync(SORTIE, { recursive: true });

  const a_faire = TRAVAUX.filter(t => {
    if (fs.existsSync(path.join(t.de[0], t.de[1]))) return true;
    console.log('  source absente, ignoree : ' + t.de[1]);
    return false;
  });

  const TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
  const srv = http.createServer((rq, rs) => {
    const t = a_faire.find(x => '/' + x.de[1] === rq.url);
    if (!t) { rs.writeHead(404); return rs.end(); }
    rs.writeHead(200, { 'Content-Type': TYPES[path.extname(t.de[1])] });
    fs.createReadStream(path.join(t.de[0], t.de[1])).pipe(rs);
  }).listen(8791);

  const nav = await chromium.launch();
  const pg = await nav.newPage();
  await pg.goto('http://127.0.0.1:8791/', { waitUntil: 'domcontentloaded' })
          .catch(() => {});

  let avant = 0, apres = 0;
  for (const t of a_faire) {
    const b64 = await pg.evaluate(async ([nom, large, q]) => {
      const im = new Image();
      im.src = '/' + nom;
      await im.decode();
      const e = Math.min(1, large / im.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(im.naturalWidth * e);
      c.height = Math.round(im.naturalHeight * e);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', q).split(',')[1];
    }, [t.de[1], t.l, t.q]);

    const donnee = Buffer.from(b64, 'base64');
    fs.writeFileSync(path.join(SORTIE, t.vers), donnee);
    const pds = fs.statSync(path.join(t.de[0], t.de[1])).size;
    avant += pds; apres += donnee.length;
    console.log('  ' + t.de[1].padEnd(16) + ' -> ' + t.vers.padEnd(14) +
      Math.round(pds / 1024) + ' Ko -> ' + Math.round(donnee.length / 1024) + ' Ko');
  }

  await nav.close();
  srv.close();
  console.log('');
  console.log('  total ' + Math.round(avant / 1024) + ' Ko -> ' +
              Math.round(apres / 1024) + ' Ko');
})();
