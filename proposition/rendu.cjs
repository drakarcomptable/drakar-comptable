/* Fabrique le PDF de proposition : quatre pages, une par prospect.

   Deux etapes : une capture du site du prospect, puis le rendu. La
   capture demande un acces reseau sortant ; si elle echoue, un cadre
   muet prend sa place et le PDF se fabrique quand meme. Le message
   d'erreur part dans la console, jamais sur la page : un detail
   technique n'a rien a faire sur un document envoye a un prospect.

   Aucun nom de client n'apparait dans ce fichier. Les references sont
   designees par leur nom d'image, comme sur le site. La correspondance
   vit dans NAZAR-CORRESPONDANCE-LOGOS.md, hors du dossier publie. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ICI = __dirname;
const SITE = path.join(ICI, '..', 'nazar-site');
const SORTIE = path.join(ICI, 'sortie');
const p = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const IA = JSON.parse(fs.readFileSync(path.join(ICI, 'logos-ia.json'), 'utf8'));

const L = 1280, H = 720;
const ech = n => n.toLocaleString('fr-FR');
const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Les quatre references affichees en bas de la page 3. Le texte decrit
   le secteur, jamais le client ; le logo est une image. */
const CAS = [
  { kd: 'B2C local',  lg: 'cas-logo-01.webp', ti: '+192 %',
    sb: 'de leads issus du SEO pour un chasseur immobilier parisien, passé premier sur sa requête principale.' },
  { kd: 'Agence',     lg: 'cas-logo-02.svg',  ti: 'Top 1',
    sb: 'sur « agence powerpoint », repris en un mois de mission et tenu depuis un an.' },
  { kd: 'IoT B2B',    lg: 'cas-logo-03.webp', ti: '9 RDV',
    sb: 'générés chaque mois en moyenne, sur des paniers moyens à 32 000 €.' },
  { kd: 'E-commerce', lg: 'cas-logo-04.webp', ti: '1 M',
    sb: 'de visites annuelles issues du SEO, sur le marché français de la sneaker.' },
];

async function capture(nav) {
  const f = path.join(SORTIE, p.slug + '-site.jpg');
  const c = await nav.newContext({ viewport: { width: 1440, height: 900 },
                                   deviceScaleFactor: 2 });
  const pg = await c.newPage();
  try {
    await pg.goto(p.url, { waitUntil: 'load', timeout: 20000 });
    await pg.waitForTimeout(2500);
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

const ico = k => `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="${IA[k].d}" fill="${IA[k].c}"/></svg>`;

function pages(cap) {
  const e = p.estimation;
  const qui = p.marche === 'B2C' ? 'De potentiels consommateurs'
                                 : 'Des professionnels';
  const marque = p.exemple ? '<div class="exemple">Données d’exemple</div>' : '';
  const total = (p.annotations && p.annotations.length) ? 5 : 4;
  const pied = n => `<div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span>
    <span>0${n} / 0${total}</span></div>`;

  const diag = (p.annotations && p.annotations.length && cap.ok) ? `
<section class="pg">
  ${marque}
  <h2 class="q">Ce que nous avons vu sur votre site</h2>
  <p class="rep">${p.annotations.length} points qui vous
    <b>coûtent ces recherches.</b></p>
  <div class="diag">
    <img src="/__capture" alt="">
    ${p.annotations.map((a, i) => `
      <span class="box" style="left:${a.x}%;top:${a.y}%;width:${a.w}%;height:${a.h}%">
        <i class="num">${i + 1}</i>
        <i class="fl fl-${a.cote === 'gauche' ? 'g' : 'd'}"></i>
        <i class="lab lab-${a.cote === 'gauche' ? 'g' : 'd'}">${esc(a.texte)}</i>
      </span>`).join('')}
  </div>
  ${pied(3)}
</section>` : '';

  const lignes = p.requetes.map(r => `<tr>
      <td>${esc(r.mot)}</td>
      <td class="n">${ech(r.volume)}</td>
      <td class="i i-${esc(r.intention || 'commerciale').toLowerCase()}">${esc(r.intention || 'Commerciale')}</td>
    </tr>`).join('');

  const cartes = CAS.map(c => `<article class="cas">
      <span class="kd">${esc(c.kd)}</span>
      <span class="plaque"><img src="/${c.lg}" alt=""></span>
      <b>${esc(c.ti)}</b>
      <span class="sb">${esc(c.sb)}</span>
    </article>`).join('');

  const logos = (p.logos || ['ref-01.webp','ref-02.webp','ref-03.webp','ref-04.webp',
                             'ref-08.webp','ref-09.webp','ref-10.webp','ref-11.webp'])
    .map(f => `<img src="/${f}" alt="">`).join('');

  return `
<section class="pg couv">
  ${marque}
  <div class="fond">${cap.ok ? '<img src="/__capture" alt="">' : '<div class="vide"></div>'}</div>
  <div class="txt">
    <img class="lg" src="/logo.png" alt="">
    <h1>Proposition<br>d’audit GEO<br><span class="acc">pour ${esc(p.entreprise)}</span></h1>
  </div>
  ${pied(1)}
</section>

<section class="pg">
  ${marque}
  <h2 class="q">Pourquoi nous vous avons contacté ?</h2>
  <p class="rep">${qui} <b>ont recherché vos services.</b></p>
  <div class="tab">
    <div class="tab-tete">
      <span class="ia">${ico('Gemini')}${ico('ChatGPT')}${ico('Claude')}</span>
      <span class="tt">Volume de recherche dans les réponses des IA</span>
    </div>
    <table>
      <thead><tr><th>Mots-clés potentiels à exploiter</th>
        <th class="n">Vol/mois</th><th>Intention</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>
  </div>
  <p class="concl">Cela pourrait générer entre <b>${e.bas} et ${e.haut} leads par mois</b>
    chez ${esc(p.entreprise)}.<span class="hyp">${ech(e.volume)} recherches mensuelles,
    à un taux de prise de contact de ${String(e.taux * 100).replace('.', ',')} %.
    Hypothèse de travail : c’est ce que l’audit sert à établir.</span></p>
  ${pied(2)}
</section>

${diag}

<section class="pg sombre">
  ${marque}
  <h2 class="q">Qui sommes-nous ?</h2>
  <p class="rep">NAZAR est un collectif spécialisé en
    <b>référencement sur les IA.</b></p>
  <div class="trio">
    <div class="st"><b>+ de 4 ans</b><span>d’existence</span></div>
    <div class="st"><b>10 ans</b><span>d’expérience en interne</span></div>
    <div class="st"><b>+ de 50</b><span>clients accompagnés</span></div>
  </div>
  <p class="anciens">Anciens consultants chez
    <b>Welcome to the Jungle</b>, <b>Sanofi</b> et <b>Canal+</b>.</p>
  <p class="kick kick-cas">Nous sommes fiers d’avoir contribué à ces projets</p>
  <div class="cas-grille">${cartes}</div>
  ${pied(total - 1)}
</section>

<section class="pg">
  ${marque}
  <h2 class="q big">Pouvons-nous prendre <span class="acc">9 minutes</span><br>
    pour vous donner l’audit GEO gratuit complet ?</h2>
  <a class="cta" href="${esc(p.agenda)}">Réserver un créneau ici</a>
  <p class="but">Le but sera de vous demander <b>qui sont vos concurrents</b>,
    <b>votre cible de clients</b> et <b>vos paniers moyens</b>, afin de calculer
    le retour sur investissement.</p>
  <p class="coord">${esc(p.nazar.mail)} · ${esc(p.nazar.tel)} · ${esc(p.nazar.site)}</p>
  <p class="kick kick-logos">Les entreprises que nous accompagnons</p>
  <div class="logos">${logos}</div>
  ${pied(total)}
</section>`;
}

const STYLE = `
@font-face{font-family:'JK';src:url(/police-jakarta.woff2) format('woff2');font-weight:200 800;font-display:block}
@font-face{font-family:'MO';src:url(/police-mono-600.woff2) format('woff2');font-weight:600;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'JK',sans-serif;color:#004358;-webkit-font-smoothing:antialiased}
.pg{position:relative;width:${L}px;height:${H}px;overflow:hidden;background:#f4fbff;
  padding:58px 70px 74px;page-break-after:always;display:flex;flex-direction:column}
.pg:last-child{page-break-after:auto}
.pg.sombre{background:#00212c;color:#dff2f9}
.acc{color:#1a7f9e}.sombre .acc,.couv .acc{color:#7fd8ee}
.kick{font-family:'MO',monospace;font-size:10px;letter-spacing:.2em;
  text-transform:uppercase;color:#44798a}
.sombre .kick{color:#7fd8ee}
.q{font-size:40px;line-height:1.08;font-weight:800;letter-spacing:-.034em;color:#004358}
.sombre .q{color:#fff}
.q.big{font-size:44px;max-width:21ch}
.q .acc{white-space:nowrap}
.rep{margin-top:16px;font-size:25px;line-height:1.3;font-weight:400;color:#44798a}
.rep b{color:#004358;font-weight:800}
.sombre .rep{color:#8fb6c4}.sombre .rep b{color:#fff}
.pied{position:absolute;left:70px;right:70px;bottom:28px;display:flex;
  justify-content:space-between;font-family:'MO',monospace;font-size:9.5px;
  letter-spacing:.16em;text-transform:uppercase;color:#8fb6c4;
  border-top:1px solid rgba(0,67,88,.13);padding-top:13px}
.sombre .pied{color:rgba(223,242,249,.46);border-color:rgba(255,255,255,.13)}
.exemple{position:absolute;top:0;right:0;background:#b3261e;color:#fff;
  font-family:'MO',monospace;font-size:9.5px;letter-spacing:.18em;
  text-transform:uppercase;padding:7px 15px;z-index:9}

/* 1 */
.couv{background:#00212c;color:#fff;padding:0;display:block}
.couv .fond{position:absolute;inset:0}
.couv .fond img{width:100%;height:100%;object-fit:cover;object-position:top center;opacity:.62}
.couv .fond .vide{width:100%;height:100%;background:linear-gradient(135deg,#0a3544,#052b38)}
.couv::after{content:"";position:absolute;inset:0;
  background:linear-gradient(100deg,#00212c 46%,rgba(0,33,44,.9) 61%,rgba(0,33,44,.3) 100%)}
.couv .txt{position:absolute;inset:0;z-index:2;padding:58px 70px;
  display:flex;flex-direction:column;justify-content:center}
.couv .lg{width:56px;margin-bottom:38px}
.couv h1{font-size:60px;line-height:1.04;font-weight:800;letter-spacing:-.035em;color:#fff}
.couv .pied{z-index:3;color:rgba(223,242,249,.66);border-color:rgba(255,255,255,.2)}

/* 2 */
.tab{margin-top:26px;border-radius:12px;overflow:hidden;
  box-shadow:0 20px 50px -34px rgba(0,67,88,.55)}
.tab-tete{display:flex;align-items:center;gap:20px;background:#1c5570;padding:14px 22px}
.tab-tete .ia{display:flex;gap:9px}
.tab-tete .ia svg{width:26px;height:26px;background:#fff;border-radius:50%;padding:5px}
.tab-tete .tt{font-size:17px;font-weight:800;letter-spacing:.012em;color:#fff;
  text-transform:uppercase}
.tab table{width:100%;border-collapse:collapse;background:#fff;font-size:14px}
.tab th{background:#1c5570;color:#fff;font-size:10.5px;font-weight:800;
  letter-spacing:.05em;text-transform:uppercase;text-align:left;padding:9px 22px}
.tab td{padding:9px 22px;border-bottom:1px solid #eaf4f8;color:#0e4e62;font-weight:600}
.tab tbody tr:nth-child(even) td{background:#f6fbfd}
.tab .n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.tab td.i{font-weight:800}
.i-commerciale{color:#1b63c4}.i-transactionnelle{color:#108a7a}
.i-informationnelle{color:#7a4bc4}.i-resolution{color:#c2681a}
.i-creation{color:#1f8a3b}.i-personnalisation{color:#c2186b}
.concl{margin-top:auto;font-size:20px;line-height:1.4;color:#004358}
.concl b{font-weight:800}
.concl .hyp{display:block;margin-top:9px;font-size:11.5px;line-height:1.6;color:#6d93a1}

/* 3 */
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:26px}
.st{background:#0a3544;border-radius:13px;padding:19px 20px}
.st b{display:block;font-size:25px;font-weight:800;letter-spacing:-.03em;color:#7fd8ee}
.st span{display:block;margin-top:5px;font-size:12.5px;color:#dff2f9;opacity:.74}
.anciens{margin-top:17px;margin-bottom:auto;font-size:16px;color:#dff2f9;opacity:.9}
.anciens b{color:#fff;font-weight:800}
.kick-cas{padding-top:4px}
.cas-grille{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:11px}
.cas{background:#0a3544;border-radius:13px;padding:15px 15px 17px;
  display:flex;flex-direction:column;gap:7px}
.cas .kd{font-family:'MO',monospace;font-size:8px;letter-spacing:.14em;
  text-transform:uppercase;color:#7fd8ee}
.cas .plaque{background:#fff;border-radius:6px;padding:5px 8px;
  align-self:flex-start;display:flex;margin:1px 0}
.cas .plaque img{height:17px;width:auto;max-width:128px;object-fit:contain}
.cas b{font-size:22px;font-weight:800;letter-spacing:-.03em;color:#fff;line-height:1}
.cas .sb{font-size:10.5px;line-height:1.45;color:#dff2f9;opacity:.72}

/* diagnostic */
.diag{position:relative;margin-top:24px;border-radius:12px;overflow:hidden;
  box-shadow:0 22px 54px -34px rgba(0,67,88,.6);flex:1;min-height:0}
.diag>img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.diag .box{position:absolute;border:2.5px solid #e01b24;border-radius:7px;
  box-shadow:0 0 0 3px rgba(224,27,36,.16)}
.diag .num{position:absolute;top:-11px;left:-11px;width:22px;height:22px;
  border-radius:50%;background:#e01b24;color:#fff;font-size:11px;font-weight:800;
  font-style:normal;display:grid;place-items:center}
.diag .fl{position:absolute;top:50%;height:2px;background:#e01b24;width:26px}
.diag .fl-d{left:100%}.diag .fl-g{right:100%}
.diag .lab{position:absolute;top:50%;transform:translateY(-50%);
  background:#e01b24;color:#fff;font-style:normal;font-size:11.5px;font-weight:700;
  padding:6px 11px;border-radius:5px;white-space:nowrap}
.diag .lab-d{left:calc(100% + 26px)}
.diag .lab-g{right:calc(100% + 26px)}

/* 4 */
.cta{display:inline-block;margin-top:30px;background:#00212c;color:#dff2f9;
  text-decoration:none;font-weight:800;font-size:18px;padding:19px 36px;
  border-radius:999px;align-self:flex-start}
.but{margin-top:20px;font-size:16px;line-height:1.62;color:#0e4e62;max-width:74ch}
.but b{color:#004358;font-weight:800}
.coord{margin-top:14px;font-size:13.5px;color:#44798a}
.kick-logos{margin-top:auto;padding-top:22px}
.logos{display:grid;grid-template-columns:repeat(8,1fr);gap:26px;
  align-items:center;margin-top:13px}
.logos img{width:100%;height:auto;max-height:28px;object-fit:contain}`;

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
  await page.goto('http://127.0.0.1:8793/__vide', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(SORTIE, p.slug + '.pdf'),
                   width: L + 'px', height: H + 'px', printBackground: true });
  await page.close();
  srv.close();
  await nav.close();
})();
