// Rend le gabarit dans un vrai navigateur, pour que les polices et les
// couleurs soient exactement celles du site. Les fichiers sont servis
// depuis nazar-site/ pour que la police et le logo se chargent.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');

const ICI = __dirname;
const SITE = path.join(ICI, 'nazar-site');
const cartes = JSON.parse(fs.readFileSync(path.join(ICI, 'og-cartes.json'), 'utf8'));
const gabarit = fs.readFileSync(path.join(ICI, 'og-gabarit.html'), 'utf8');

const TYPES = { '.woff2':'font/woff2', '.png':'image/png', '.html':'text/html; charset=utf-8' };

(async () => {
  const srv = http.createServer((req, res) => {
    const nom = decodeURIComponent(req.url.split('?')[0].slice(1));
    if (nom === '__carte') { res.writeHead(200, {'Content-Type':TYPES['.html']}); return res.end(gabarit); }
    const f = path.join(SITE, nom);
    if (!f.startsWith(SITE) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(8791);

  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{ width:1200, height:630 }, deviceScaleFactor:1 });
  for (const c of cartes) {
    await p.goto('http://127.0.0.1:8791/__carte', { waitUntil:'networkidle' });
    await p.evaluate(({kick, titre, cl}) => {
      document.querySelector('.kick').textContent = kick;
      const h = document.querySelector('h1');
      h.textContent = titre;
      h.className = cl;
    }, c);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(SITE, 'og', c.slug + '.jpg'), type: 'jpeg', quality: 92 });
  }
  await b.close(); srv.close();
})();
