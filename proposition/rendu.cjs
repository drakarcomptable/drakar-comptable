/* Fabrique le PDF de proposition.
   Deux etapes : une capture du site du prospect, puis le rendu des quatre
   pages. La capture demande un acces reseau sortant ; si elle echoue, un
   cadre d'attente prend sa place et le PDF se fabrique quand meme. Un
   generateur qui s'arrete parce qu'une image manque ne sert a rien. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ICI = __dirname;
const SITE = path.join(ICI, '..', 'nazar-site');
const SORTIE = path.join(ICI, 'sortie');
const p = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const L = 1280, H = 720;                       // 16:9, le format d'un ecran
const ech = n => n.toLocaleString('fr-FR');
const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function capture(nav) {
  const f = path.join(SORTIE, p.slug + '-site.jpg');
  const c = await nav.newContext({ viewport: { width: 1440, height: 900 },
                                   deviceScaleFactor: 2 });
  const pg = await c.newPage();
  try {
    await pg.goto(p.url, { waitUntil: 'load', timeout: 20000 });
    await pg.waitForTimeout(2500);
    // les bandeaux de consentement masquent le haut de page : on tente de
    // les ecarter, sans insister si le site n'en a pas
    for (const t of ['Tout accepter', 'Accepter', 'J’accepte', 'Accept all']) {
      const b = pg.getByRole('button', { name: t });
      if (await b.count()) { await b.first().click({ timeout: 1500 }).catch(() => {}); break; }
    }
    await pg.waitForTimeout(800);
    await pg.screenshot({ path: f, type: 'jpeg', quality: 86 });
    await c.close();
    return { ok: true, fichier: f };
  } catch (e) {
    await c.close();
    return { ok: false, raison: String(e.message || e).split('\n')[0] };
  }
}

function pages(cap) {
  const e = p.estimation;
  const qui = p.marche === 'B2C' ? 'De potentiels consommateurs'
                                 : 'Des professionnels';
  const cadre = cap.ok
    ? `<img class="shot" src="/__capture" alt="">`
    : `<div class="shot vide"></div>`;

  const lignes = p.requetes.map(r => `<tr>
      <td>${esc(r.mot)}</td>
      <td class="n">${ech(r.volume)}</td>
    </tr>`).join('');

  const logos = (p.logos || ['ref-01.webp', 'ref-02.webp', 'ref-03.webp',
                             'ref-04.webp', 'ref-08.webp', 'ref-09.webp'])
    .map(f => `<img src="/${f}" alt="">`).join('');

  const marque = p.exemple
    ? '<div class="exemple">Données d’exemple</div>' : '';

  return `
<!-- 1. page de garde -->
<section class="pg couv">
  ${marque}
  <div class="couv-fond">${cadre}</div>
  <div class="couv-txt">
    <img class="lg" src="/logo.png" alt="">
    <p class="kick">Proposition · ${esc(p.date)}</p>
    <h1>Audit GEO gratuit<br><span class="acc">pour ${esc(p.entreprise)}</span></h1>
    <p class="sous">Nous avons relevé ce que les moteurs génératifs répondent
      aux questions d’achat de votre marché. Voici ce que nous y avons vu.</p>
  </div>
  <div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span><span>01 / 04</span></div>
</section>

<!-- 2. pourquoi nous vous avons contacte -->
<section class="pg">
  ${marque}
  <p class="kick">Pourquoi nous vous avons contacté</p>
  <h2>${qui} cherchent<br>vos services <span class="acc">chaque mois</span></h2>
  <div class="duo">
    <div>
      <table class="req">
        <thead><tr><th>Requête</th><th class="n">Recherches / mois</th></tr></thead>
        <tbody>${lignes}</tbody>
        <tfoot><tr><td>Total</td><td class="n">${ech(e.volume)}</td></tr></tfoot>
      </table>
    </div>
    <div class="chiffre">
      <b>${e.bas} à ${e.haut}</b>
      <span>demandes entrantes par mois</span>
      <p class="hyp">${ech(e.volume)} recherches mensuelles sur ces
        ${p.requetes.length} requêtes, à un taux de prise de contact de
        ${String(e.taux * 100).replace('.', ',')} %. Le taux est une
        hypothèse de travail, pas une mesure : c’est précisément ce que
        l’audit sert à établir.</p>
    </div>
  </div>
  <div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span><span>02 / 04</span></div>
</section>

<!-- 3. qui sommes-nous -->
<section class="pg sombre">
  ${marque}
  <p class="kick">Qui sommes-nous</p>
  <h2>NAZAR, collectif de consultants<br>en <span class="acc">référencement</span></h2>
  <div class="trio">
    <div class="st"><b>${esc(p.nazar.annees)}</b><span>d’existence</span></div>
    <div class="st"><b>${esc(p.nazar.experience)}</b><span>dans l’équipe</span></div>
    <div class="st"><b>+ de 100</b><span>entreprises B2B accompagnées</span></div>
  </div>
  <p class="maisons">Nos consultants viennent de
    ${p.nazar.maisons.map(m => `<b>${esc(m)}</b>`).join(', ')}.</p>
  <p class="corps">Nous relevons ce que ChatGPT, Perplexity, Gemini et les
    AI Overviews de Google répondent aux questions d’achat de votre marché,
    puis nous travaillons les pages et les sources qui décident de ces
    réponses. Chaque semaine, le même relevé, pour que le progrès soit
    vérifiable.</p>
  <div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span><span>03 / 04</span></div>
</section>

<!-- 4. l'invitation -->
<section class="pg">
  ${marque}
  <p class="kick">La suite</p>
  <h2>Neuf minutes pour voir<br>ce que les IA <span class="acc">disent de vous</span></h2>
  <p class="corps lead">Un consultant interroge les moteurs en direct, devant
    vous, sur les questions de votre marché. Vous repartez avec le relevé et
    les concurrents cités à votre place. Gratuit, sans engagement.</p>
  <a class="cta" href="${esc(p.agenda)}">Réserver mon créneau de 9 minutes</a>
  <p class="coord">${esc(p.nazar.mail)} · ${esc(p.nazar.tel)} · ${esc(p.nazar.site)}</p>
  <p class="kick kick2">Nous sommes fiers d’avoir contribué à ces projets</p>
  <div class="logos">${logos}</div>
  <div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span><span>04 / 04</span></div>
</section>`;
}

const STYLE = `
@font-face{font-family:'JK';src:url(/police-jakarta.woff2) format('woff2');font-weight:200 800;font-display:block}
@font-face{font-family:'MO';src:url(/police-mono-600.woff2) format('woff2');font-weight:600;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'JK',sans-serif;color:#004358;-webkit-font-smoothing:antialiased}
.pg{position:relative;width:${L}px;height:${H}px;overflow:hidden;
  background:#f4fbff;padding:62px 72px;page-break-after:always;
  display:flex;flex-direction:column}
.pg:last-child{page-break-after:auto}
.pg.sombre{background:#00212c;color:#dff2f9}
.kick{font-family:'MO',monospace;font-size:12px;letter-spacing:.2em;
  text-transform:uppercase;color:#44798a}
.sombre .kick{color:#7fd8ee}
h1{font-size:58px;line-height:1.05;font-weight:700;letter-spacing:-.03em;margin-top:18px}
h2{font-size:42px;line-height:1.1;font-weight:700;letter-spacing:-.03em;margin:14px 0 30px}
.sombre h2{color:#fff}
.acc{color:#1a7f9e}.sombre .acc,.couv .acc{color:#7fd8ee}
.pied{position:absolute;left:72px;right:72px;bottom:30px;display:flex;
  justify-content:space-between;font-family:'MO',monospace;font-size:10px;
  letter-spacing:.16em;text-transform:uppercase;color:#8fb6c4;
  border-top:1px solid rgba(0,67,88,.14);padding-top:14px}
.sombre .pied{color:rgba(223,242,249,.5);border-color:rgba(255,255,255,.14)}
.couv .pied{z-index:3;color:rgba(223,242,249,.68);border-color:rgba(255,255,255,.2)}
.exemple{position:absolute;top:0;right:0;background:#b3261e;color:#fff;
  font-family:'MO',monospace;font-size:10px;letter-spacing:.18em;
  text-transform:uppercase;padding:7px 16px;z-index:9}

/* 1 */
.couv{background:#00212c;color:#fff;padding:0;display:block}
.couv-fond{position:absolute;inset:0}
.couv-fond .shot{width:100%;height:100%;object-fit:cover;object-position:top center;opacity:.62}
.couv-fond .vide{width:100%;height:100%;
  background:linear-gradient(135deg,#0a3544,#052b38)}
.couv::after{content:"";position:absolute;inset:0;
  background:linear-gradient(100deg,#00212c 45%,rgba(0,33,44,.9) 60%,rgba(0,33,44,.32) 100%)}
.couv-txt{position:absolute;inset:0;z-index:2;padding:62px 72px;
  display:flex;flex-direction:column;justify-content:center;max-width:72%}
.couv .lg{width:52px;margin-bottom:30px}
.couv h1{color:#fff}
.couv .sous{margin-top:22px;max-width:46ch;font-size:16px;line-height:1.6;
  color:#dff2f9;opacity:.86}

/* 2 */
.duo{display:grid;grid-template-columns:1.15fr .85fr;gap:54px;align-items:start;flex:1}
table.req{width:100%;border-collapse:collapse;font-size:16px}
table.req th{font-family:'MO',monospace;font-size:10px;letter-spacing:.16em;
  text-transform:uppercase;color:#44798a;text-align:left;padding-bottom:12px;
  border-bottom:1.5px solid rgba(0,67,88,.2)}
table.req td{padding:13px 0;border-bottom:1px solid rgba(0,67,88,.1);color:#0e4e62}
table.req .n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
table.req tfoot td{font-weight:700;color:#004358;border-bottom:0;border-top:1.5px solid rgba(0,67,88,.2)}
.chiffre{background:#00212c;color:#fff;border-radius:18px;padding:34px 32px}
.chiffre b{display:block;font-size:66px;font-weight:800;letter-spacing:-.045em;
  line-height:1;color:#7fd8ee}
.chiffre>span{display:block;margin-top:10px;font-size:16px;color:#dff2f9}
.chiffre .hyp{margin-top:22px;padding-top:18px;font-size:12.5px;line-height:1.65;
  color:#dff2f9;opacity:.72;border-top:1px solid rgba(255,255,255,.16)}

/* 3 */
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-bottom:34px}
.st{background:#0a3544;border-radius:16px;padding:26px 24px}
.st b{display:block;font-size:26px;font-weight:800;letter-spacing:-.03em;color:#fff;line-height:1.15}
.st span{display:block;margin-top:9px;font-size:13.5px;color:#dff2f9;opacity:.72}
.maisons{font-size:17px;line-height:1.6;color:#dff2f9;margin-bottom:16px}
.maisons b{color:#7fd8ee;font-weight:700}
.corps{font-size:15.5px;line-height:1.72;color:#dff2f9;opacity:.86;max-width:76ch}
.pg:not(.sombre) .corps{color:#0e4e62;opacity:1}
.lead{font-size:17px;max-width:62ch}

/* 4 */
.cta{display:inline-block;margin-top:30px;background:#00212c;color:#dff2f9;
  text-decoration:none;font-weight:700;font-size:17px;padding:19px 34px;
  border-radius:999px;align-self:flex-start}
.coord{margin-top:18px;font-size:14px;color:#44798a}
.kick2{margin-top:auto;padding-top:26px}
.logos{display:flex;align-items:center;gap:42px;margin-top:18px;margin-bottom:34px}
.logos img{height:30px;width:auto;max-width:120px;object-fit:contain;
  filter:grayscale(1);opacity:.55}`;

(async () => {
  if (!fs.existsSync(SORTIE)) fs.mkdirSync(SORTIE, { recursive: true });
  const nav = await chromium.launch();
  const cap = await capture(nav);
  if (!cap.ok) console.log('  capture indisponible : ' + cap.raison);

  const TYPES = { '.woff2':'font/woff2', '.png':'image/png', '.webp':'image/webp',
                  '.svg':'image/svg+xml', '.jpg':'image/jpeg' };
  const srv = http.createServer((req, res) => {
    const nom = decodeURIComponent(req.url.split('?')[0].slice(1));
    if (nom === '__capture' && cap.ok) {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      return fs.createReadStream(cap.fichier).pipe(res);
    }
    const f = path.join(SITE, nom);
    if (!f.startsWith(SITE) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(8793);

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <style>${STYLE}</style></head><body>${pages(cap)}</body></html>`;
  const page = await nav.newPage({ viewport: { width: L, height: H } });
  await page.goto('http://127.0.0.1:8793/__vide', { waitUntil: 'domcontentloaded' })
            .catch(() => {});
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(SORTIE, p.slug + '.pdf'),
                   width: L + 'px', height: H + 'px', printBackground: true });
  await page.close();
  srv.close();
  await nav.close();
})();
