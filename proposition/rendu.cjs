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
// Les portraits de l'equipe servent a la proposition, pas au site public :
// ils vivent a cote du generateur et ne partent pas en ligne.
const EQUIPE = path.join(ICI, 'equipe');
const SORTIE = path.join(ICI, 'sortie');
const p = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let analyse = null;
const IA = JSON.parse(fs.readFileSync(path.join(ICI, 'logos-ia.json'), 'utf8'));

const L = 1280, H = 720;
const ech = n => n.toLocaleString('fr-FR');
const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Les quatre references affichees en bas de la page 3. Le texte decrit
   le secteur, jamais le client ; le logo est une image. */
const EQUIPE_NAZAR = [
  { ph: 'mael.jpg',     nom: 'Maël',     ro: 'Consultant senior SEO & GEO' },
  { ph: 'clement.jpg',  nom: 'Clément',  ro: 'Lead consultant SEO & GEO' },
  { ph: 'francois.jpg', nom: 'François', ro: '20 ans d’acquisition de trafic' },
  { ph: 'florian.jpg',  nom: 'Florian',  ro: 'Consultant SEO & GEO' },
];

const CHIFFRES = [
  { n: '+ de 80', q: 'entreprises accompagnées' },
  { n: '+ 1 265', q: 'rendez-vous B2B générés' },
  { n: '97 %',    q: 'de satisfaction client' },
  { n: '+ de 150', q: 'sites optimisés' },
];

const CAS = [
  { kd: 'B2C local',  lg: 'cas-logo-01.webp', ti: '+192 %',
    sb: 'de leads issus du SEO pour un chasseur immobilier parisien, passé premier sur sa requête principale.' },
  { kd: 'Agence',     lg: 'cas-logo-02.svg',  ti: 'Top 1', clair: true,
    sb: 'sur « agence powerpoint », repris en un mois de mission et tenu depuis un an.' },
  { kd: 'IoT B2B',    lg: 'cas-logo-03.webp', ti: '9 RDV',
    sb: 'générés chaque mois en moyenne, sur des paniers moyens à 32 000 €.' },
  { kd: 'E-commerce', lg: 'cas-logo-04.webp', ti: '1 M', clair: true,
    sb: 'de visites annuelles issues du SEO, sur le marché français de la sneaker.' },
];

function fourni(champ) {
  if (!p[champ]) return null;
  const f = path.isAbsolute(p[champ]) ? p[champ] : path.join(ICI, '..', p[champ]);
  if (!fs.existsSync(f)) {
    console.log('  image introuvable, ignoree : ' + p[champ]);
    return null;
  }
  return f;
}

async function capture(nav) {
  // une image deposee a la main l'emporte : c'est la sortie de secours
  // quand le site refuse la visite automatique
  const main = fourni('capture_accueil');
  if (main) return { ok: true, fichier: main, manuel: true };

  const f = path.join(SORTIE, p.slug + '-site.png');
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
    // PNG et non JPEG : certains lecteurs rendent un JPEG avec un espace
    // colorimetrique inattendu, ce qui vire l'image au magenta
    await pg.screenshot({ path: f, type: 'png' });
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
  const avecDiag = !!(p.annotations && p.annotations.length && (analyse || cap.ok));
  const total = avecDiag ? 5 : 4;
  const pied = n => `<div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span>
    <span>0${n} / 0${total}</span></div>`;

  const src = analyse ? '/__analyse' : '/__capture';
  const diag = avecDiag ? `
<section class="pg">
  ${marque}
  <h2 class="q">Ce que nous avons vu sur votre site</h2>
  <p class="rep">${p.annotations.length} points qui vous
    <b>coûtent ces recherches.</b></p>
  <div class="diag">
    <img src="${src}" alt="">
    ${p.annotations.map((a, i) => `
      <span class="box" data-x="${a.x}" data-y="${a.y}" data-w="${a.w}" data-h="${a.h}">
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
      <span class="plaque${c.clair ? ' sombre' : ''}"><img src="/${c.lg}" alt=""></span>
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
      <thead><tr><th>Mots-clés potentiels à exploiter <b class="ast">*</b></th>
        <th class="n">Vol/mois</th><th>Intention</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>
    <p class="extrait"><b>*</b> ${p.exemple
      ? 'Volumes donnés à titre d’illustration, à remplacer par le relevé réel avant envoi.'
      : 'Ceci est un extrait de la vraie data sur votre marché.'}</p>
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
  <div class="gens">${EQUIPE_NAZAR.map(m => `
    <figure class="g">
      <img src="/equipe/${m.ph}" alt="">
      <figcaption><b>${esc(m.nom)}</b><span>${esc(m.ro)}</span></figcaption>
    </figure>`).join('')}
    <p class="anciens">Anciens consultants chez
      <b>Welcome to the Jungle</b>, <b>Sanofi</b> et <b>Canal+</b>.</p>
  </div>
  <div class="quatre">${CHIFFRES.map(c => `
    <div class="st"><b>${esc(c.n)}</b><span>${esc(c.q)}</span></div>`).join('')}
  </div>
  <p class="kick kick-cas">Nous sommes fiers d’avoir contribué à ces projets</p>
  <div class="cas-grille">${cartes}</div>
  ${pied(total - 1)}
</section>

<section class="pg">
  ${marque}
  <h2 class="q big">Pouvons-nous prendre <span class="acc">9 minutes</span> pour vous<br>
    délivrer l’audit GEO gratuit complet ?</h2>
  <a class="cta" href="${esc(p.agenda)}">Réserver un créneau ici</a>
  <div class="bulle">
    <span class="tete">
      <img src="/hote-mael.webp" alt="Maël Gallais">
      <a class="li" href="${esc(p.nazar.linkedin_mael)}" aria-label="LinkedIn de Maël Gallais">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0a66c2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0"/></svg>
      </a>
    </span>
    <div class="dit">
      <p><b>Je m’appelle Maël Gallais.</b> Ça fait plus de 10 ans que je fais
        du SEO et du GEO. Je travaille autant avec des grands groupes qu’avec
        des TPE et des PME que j’accompagne au quotidien.</p>
      <p>Pendant ces 9 minutes, je vous demanderai <b>qui sont vos
        concurrents</b>, <b>quelle est votre cible</b> et <b>quel est votre
        panier moyen</b>. C’est ce qui me permet de calculer votre retour sur
        investissement, et pas seulement de vous montrer des courbes.</p>
      <span class="sign">${esc(p.nazar.mail)} · ${esc(p.nazar.tel)}</span>
    </div>
  </div>
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
.q.big{font-size:44px;max-width:29ch}
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
.tab .ast{color:#e01b24;font-size:15px;font-weight:800}
.extrait{display:flex;align-items:center;gap:8px;background:#fff4f3;
  border-top:1px solid #f3cdc8;padding:10px 22px;font-size:12.5px;
  font-weight:600;color:#9c2b1c}
.extrait b{color:#e01b24;font-size:16px}
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
.anciens{font-size:16px;color:#dff2f9;opacity:.9}
.anciens b{color:#fff;font-weight:800}
.kick-cas{padding-top:22px}
.cas-grille{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:11px}
.cas{background:#0a3544;border-radius:13px;padding:15px 15px 17px;
  display:flex;flex-direction:column;gap:7px}
.cas .kd{font-family:'MO',monospace;font-size:8px;letter-spacing:.14em;
  text-transform:uppercase;color:#7fd8ee}
.cas .plaque{background:#fff;border-radius:6px;padding:5px 8px;
  align-self:flex-start;display:flex;margin:1px 0}
.cas .plaque img{height:17px;width:auto;max-width:128px;object-fit:contain}
.cas .plaque.sombre{background:#06283a;box-shadow:inset 0 0 0 1px rgba(123,208,230,.22)}
.cas b{font-size:22px;font-weight:800;letter-spacing:-.03em;color:#fff;line-height:1}
.cas .sb{font-size:10.5px;line-height:1.45;color:#dff2f9;opacity:.72}

/* diagnostic */
.diag{position:relative;margin-top:24px;border-radius:12px;overflow:hidden;
  box-shadow:0 22px 54px -34px rgba(0,67,88,.6);flex:1;min-height:0}
.diag>img{width:100%;height:100%;object-fit:contain;object-position:center;display:block}
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

/* equipe et chiffres, page qui sommes-nous */
.gens{display:grid;grid-template-columns:repeat(4,1fr) 1.45fr;gap:16px;
  align-items:start;margin-top:24px;margin-bottom:auto}
.gens .g{margin:0;text-align:center}
.gens .g img{width:86px;height:86px;border-radius:50%;object-fit:cover;
  object-position:center 18%;border:2px solid rgba(123,208,230,.5);
  background:#06283a;display:block;margin:0 auto 9px}
.gens .g b{display:block;font-size:14px;font-weight:800;color:#fff;margin-bottom:2px}
.gens .g span{display:block;font-size:10.5px;line-height:1.35;color:#9fc6d8}
.gens .anciens{margin:0;align-self:center;padding-left:18px;font-size:12.5px;
  line-height:1.6;border-left:1px solid rgba(123,208,230,.28);opacity:1}

.quatre{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;
  margin-top:24px;margin-bottom:auto}
.quatre .st{background:#0a3544;border-radius:11px;padding:13px 15px}
.quatre .st b{display:block;font-size:21px;font-weight:800;letter-spacing:-.03em;
  color:#7bd0e6;line-height:1;margin-bottom:5px}
.quatre .st span{font-size:10.5px;line-height:1.35;color:#cfe6ef}

/* bulle de Mael */
.bulle{display:flex;gap:24px;align-items:flex-start;margin-top:auto;
  margin-bottom:auto;max-width:94ch}
.bulle .tete{flex:none;display:block;text-align:center}
.bulle .tete img{width:96px;height:96px;border-radius:50%;object-fit:cover;
  border:3px solid #fff;box-shadow:0 12px 30px -16px rgba(0,67,88,.6);display:block}
.bulle .li{display:inline-flex;margin-top:9px}
.bulle .li svg{width:19px;height:19px;display:block}
.bulle .dit{position:relative;background:#fff;border-radius:16px;padding:24px 28px;
  box-shadow:0 20px 48px -34px rgba(0,67,88,.5)}
.bulle .dit::before{content:"";position:absolute;left:-9px;top:28px;width:18px;
  height:18px;background:#fff;transform:rotate(45deg)}
.bulle .dit p{position:relative;font-size:15.5px;line-height:1.65;color:#0e4e62;
  margin-bottom:11px}
.bulle .dit p:last-of-type{margin-bottom:0}
.bulle .dit b{color:#004358;font-weight:800}
.bulle .sign{display:block;margin-top:13px;padding-top:11px;font-size:12px;
  color:#44798a;border-top:1px solid rgba(0,67,88,.12)}

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
  analyse = fourni('capture_analyse');   // affecte la variable du module
  if (!cap.ok) console.log('  capture indisponible : ' + cap.raison);

  const TYPES = { '.woff2':'font/woff2', '.png':'image/png', '.webp':'image/webp',
                  '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg' };
  const srv = http.createServer((req, res) => {
    const nom = decodeURIComponent(req.url.split('?')[0].slice(1));
    if (nom === '__capture' && cap.ok) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(cap.fichier)] || 'image/png' });
      return fs.createReadStream(cap.fichier).pipe(res);
    }
    if (nom === '__analyse' && analyse) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(analyse)] || 'image/png' });
      return fs.createReadStream(analyse).pipe(res);
    }
    const racine = nom.startsWith('equipe/') ? path.dirname(EQUIPE) : SITE;
    const f = path.join(racine, nom);
    if (!f.startsWith(racine) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(8793);

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <style>${STYLE}</style></head><body>${pages(cap)}</body></html>`;
  const page = await nav.newPage({ viewport: { width: L, height: H } });
  await page.goto('http://127.0.0.1:8793/__vide', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Les reperes sont donnes en pourcentage de l'IMAGE. Le cadre, lui, a le
  // rapport de la page. Sans ce recalage ils glisseraient des que la capture
  // n'a pas exactement le meme rapport que son cadre.
  await page.evaluate(() => {
    const d = document.querySelector('.diag');
    if (!d) return;
    const im = d.querySelector('img');
    if (!im || !im.naturalWidth) return;
    const cw = d.clientWidth, ch = d.clientHeight;
    const e = Math.min(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * e, h = im.naturalHeight * e;
    const gx = (cw - w) / 2, gy = (ch - h) / 2;
    d.querySelectorAll('.box').forEach(b => {
      const q = n => parseFloat(b.dataset[n]) || 0;
      b.style.left = (gx + w * q('x') / 100) + 'px';
      b.style.top = (gy + h * q('y') / 100) + 'px';
      b.style.width = (w * q('w') / 100) + 'px';
      b.style.height = (h * q('h') / 100) + 'px';
    });
  });
  await page.pdf({ path: path.join(SORTIE, p.slug + '.pdf'),
                   width: L + 'px', height: H + 'px', printBackground: true });
  await page.close();
  srv.close();
  await nav.close();
})();
