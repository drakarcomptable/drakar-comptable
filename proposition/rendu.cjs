/* Fabrique le PDF de proposition : quatre pages, une par prospect.

   Deux etapes : une capture du site du prospect, puis le rendu. La
   capture demande un acces reseau sortant ; si elle echoue, un cadre
   muet prend sa place et le PDF se fabrique quand meme. Le message
   d'erreur part dans la console, jamais sur la page : un detail
   technique n'a rien a faire sur un document envoye a un prospect.

   Aucun nom de client n'apparait dans ce fichier. Les references sont
   designees par leur nom d'image, comme sur le site. La correspondance
   vit dans NAZAR-CORRESPONDANCE-LOGOS.md, hors du dossier publie. */
const { lance } = require('./navigateur.cjs');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ICI = __dirname;
const SITE = path.join(ICI, '..', 'nazar-site');
// Les portraits de l'equipe servent a la proposition, pas au site public :
// ils vivent a cote du generateur et ne partent pas en ligne.
const EQUIPE = path.join(ICI, 'equipe');
// Copies allegees produites par visuels.cjs. Chromium recopie un JPEG tel
// quel dans le PDF, mais re-encode un WebP sans compression : les quatre
// photos de cas pesaient 3,2 Mo dans le fichier au lieu de 213 Ko.
const VISUELS = path.join(ICI, 'visuels');
// un visuel allege s'il existe, sinon la source : deposer une photo suffit,
// la passer dans visuels.cjs ne fait que l'alleger.
const visuel = (nom, secours) =>
  fs.existsSync(path.join(VISUELS, nom)) ? '/visuels/' + nom : secours;
const SORTIE = path.join(ICI, 'sortie');
const p = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let analyse = null;
const IA = JSON.parse(fs.readFileSync(path.join(ICI, 'logos-ia.json'), 'utf8'));

const L = 1280, H = 720;
const ech = n => n.toLocaleString('fr-FR').replace(/\u202f/g, '\u00a0');
const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Les quatre references affichees en bas de la page 3. Le texte decrit
   le secteur, jamais le client ; le logo est une image. */
const EQUIPE_NAZAR = [
  { ph: 'mael.jpg',    nom: 'Maël',    ro: 'Consultant senior',
    an: '+ 12 ans d’expérience', ex: 'ex-Sanofi' },
  { ph: 'clement.jpg', nom: 'Clément', ro: 'Consultant senior',
    an: '+ 15 ans d’expérience', ex: 'ex-Yateo' },
  { ph: 'francois.jpg', nom: 'François', ro: 'Consultant senior',
    an: '+ 15 ans d’expérience', ex: 'ex-Welcome to the Jungle' },
  // La photo de Celine n'est pas encore dans proposition/equipe/. Tant
  // qu'elle manque, on montre Florian plutot qu'un trou : la proposition
  // reste envoyable, et la console dit quoi deposer.
  { ph: 'celine.jpg',  nom: 'Céline',  ro: 'Consultante senior',
    an: '+ 11 ans d’expérience', ex: 'ex-Canal+',
    repli: { ph: 'florian.jpg', nom: 'Florian', ro: 'Consultant senior',
             an: '+ 8 ans d’expérience', ex: 'SEO & GEO' } },
];

const CHIFFRES = [
  { n: '+ de 4 ans', q: 'd’existence' },
  { n: '10 ans',     q: 'd’expérience en interne' },
  { n: '+ de 80',    q: 'clients accompagnés' },
];

const CAS = [
  { kd: 'B2C local',  lg: 'cas-logo-01.webp', ph: 'cas-01.webp', ti: '+192 %',
    sb: 'de leads issus du SEO pour un chasseur immobilier parisien, passé premier sur sa requête principale.' },
  { kd: 'Agence',     lg: 'cas-logo-02.svg',  ph: 'cas-02.webp', ti: 'Top 1',
    sb: 'sur « agence powerpoint », repris en un mois de mission et tenu depuis un an.' },
  { kd: 'IoT B2B',    lg: 'cas-logo-03.webp', ph: 'cas-03.webp', ti: '9 RDV', plaque: true,
    sb: 'générés chaque mois en moyenne, sur des paniers moyens à 32 000 €.' },
  { kd: 'E-commerce', lg: 'cas-logo-04.webp', ph: 'cas-04.webp', ti: '1 M',
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
    // PNG et non JPEG : certains lecteurs rendent un JPEG avec un espace
    // colorimetrique inattendu, ce qui vire l'image au magenta
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
  // Une fiche dont la photo n'est pas encore deposee bascule sur son repli :
  // la proposition reste envoyable, et la console dit quoi fournir.
  const equipe = EQUIPE_NAZAR.map(m => {
    if (fs.existsSync(path.join(EQUIPE, m.ph))) return m;
    if (m.repli) {
      console.log('  photo absente : equipe/' + m.ph + ', ' + m.repli.nom +
                  ' affiche a la place');
      return m.repli;
    }
    console.log('  photo absente : equipe/' + m.ph);
    return m;
  });
  const avecDiag = !!(p.annotations && p.annotations.length && (analyse || cap.ok));
  const total = avecDiag ? 5 : 4;
  const pied = n => `<div class="pied"><span>NAZAR × ${esc(p.entreprise)}</span>
    <span>0${n} / 0${total}</span></div>`;

  const src = analyse ? '/__analyse' : '/__capture';
  const diag = avecDiag ? `
<section class="pg">
  ${marque}
  <h2 class="q">Ce que les IA voient sur votre site</h2>
  <p class="rep">${p.annotations.length} pénalité${p.annotations.length > 1 ? 's' : ''} IA
    <b>qui vous empêche${p.annotations.length > 1 ? 'nt' : ''} d’être cité.</b></p>
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
      <div class="vis">
        <img class="ph" src="${visuel(c.ph.replace('.webp', '.jpg'), '/' + c.ph)}" alt="">
        <span class="veil"></span>
        <span class="kd">${esc(c.kd)}</span>
        <span class="clg"><img class="${c.plaque ? 'plaque' : ''}" src="/${c.lg}" alt=""></span>
      </div>
      <div class="bd">
        <b>${esc(c.ti)}</b>
        <span class="sb">${esc(c.sb)}</span>
      </div>
    </article>`).join('');

  const logos = (p.logos || ['ref-01.webp','ref-02.webp','ref-03.webp','ref-04.webp',
                             'ref-08.webp','ref-09.webp','ref-10.webp','ref-11.webp'])
    .map(f => `<img src="/${f}" alt="">`).join('');

  return `
${(p.couverture || 'portable') === 'portable' ? `
<section class="pg couv couv-portable">
  ${marque}
  <div class="scene">
    <div class="portable">
      <div class="ecran">${cap.ok
        ? '<img src="/__capture" alt="">'
        : '<div class="vide"></div>'}</div>
      <div class="socle"></div>
    </div>
  </div>
  <div class="bandeau">
    <h1>Proposition d’audit GEO gratuit
      <span class="acc">pour ${esc(p.entreprise)}</span></h1>
    <span class="ecusson"><img class="lg" src="/logo.png" alt=""></span>
  </div>
  ${pied(1)}
</section>` : `
<section class="pg couv couv-${esc(p.couverture || 'portable')}">
  ${marque}
  <div class="fond">${cap.ok ? '<img src="/__capture" alt="">' : '<div class="vide"></div>'}</div>
  <div class="txt">
    <div class="plaque-titre">
      <span class="ecusson"><img class="lg" src="/logo.png" alt=""></span>
      <h1>Proposition d’audit<br>GEO gratuit<br><span class="acc">pour ${esc(p.entreprise)}</span></h1>
    </div>
  </div>
  ${pied(1)}
</section>`}

<section class="pg">
  ${marque}
  <h2 class="q">Pourquoi nous vous avons contacté ?</h2>
  <p class="rep">${qui} <b>interrogent les IA sur votre marché.</b></p>
  <div class="tab">
    <div class="tab-tete">
      <span class="ia">${ico('Gemini')}${ico('ChatGPT')}${ico('Claude')}</span>
      <span class="tt">Requêtes posées aux IA sur votre marché</span>
    </div>
    <table>
      <thead><tr><th>Requêtes sur lesquelles vous n’êtes pas cité <b class="ast">*</b></th>
        <th class="n">Vol/mois</th><th>Intention</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>
    <p class="extrait"><b>*</b> ${p.exemple
      ? 'Volumes donnés à titre d’illustration, à remplacer avant envoi.'
      : 'Extrait de la data sur votre marché.'}</p>
  </div>
  <p class="concl">En ajoutant les taux de conversion GEO, cela pourrait généralement
    vous générer entre <b>${e.bas} et ${e.haut} leads par mois</b>
    chez ${esc(p.entreprise)}.<span class="hyp">${ech(e.volume)} requêtes mensuelles posées aux IA,
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
  <div class="gens">${equipe.map(m => `
    <figure class="g">
      <img src="${visuel(m.ph, '/equipe/' + m.ph)}" alt="">
      <figcaption>
        <b>${esc(m.nom)}</b>
        <span class="ro">${esc(m.ro)}</span>
        <span class="an">${esc(m.an)}</span>
        <span class="ex">${esc(m.ex)}</span>
      </figcaption>
    </figure>`).join('')}
    <div class="trio">${CHIFFRES.map(c => `
      <div class="st"><b>${esc(c.n)}</b><span>${esc(c.q)}</span></div>`).join('')}
    </div>
  </div>
  <p class="rep rep-cas">Ce que nos clients <b>ont gagné en visibilité.</b></p>
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
      <p><b>Je suis Maël Gallais, cofondateur de NAZAR SEO.</b> Ça fait 12 ans
        que je fais du SEO et du GEO. Je travaille autant avec des grands groupes
        qu’avec des TPE et des PME que j’accompagne au quotidien.</p>
      <p>Pendant ces 9 minutes, je vous demanderai <b>qui sont vos
        concurrents</b>, <b>quelle est votre cible</b> et <b>quel est votre
        panier moyen</b>. C’est ce qui me permet de calculer votre retour sur
        investissement, et pas seulement de vous montrer des courbes.</p>
      <span class="sign">${esc(p.nazar.mail)} · ${esc(p.nazar.tel)}</span>
    </div>
  </div>
  <p class="rep rep-logos">Les entreprises <b>que nous accompagnons.</b></p>
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
.couv .fond img{width:100%;height:100%;object-fit:cover;object-position:top center;opacity:.96}
.couv .fond .vide{width:100%;height:100%;background:#0a3544}
.couv::after{content:"";position:absolute;inset:0;background:rgba(0,33,44,.22)}
.couv .txt{position:absolute;inset:0;z-index:2;padding:58px 70px;
  display:flex;flex-direction:column}
.couv .plaque-titre{background:rgba(0,28,38,.88);border-radius:18px;
  padding:34px 40px 38px}

/* Le logo est sombre : sur le navy il disparaitrait. Un ecusson bleu
   ciel lui rend ses couleurs, comme sur le site. */
.couv .ecusson{display:inline-flex;background:#cfeaf4;border-radius:14px;
  padding:9px 11px;margin-bottom:24px}
.couv .lg{width:44px;display:block}

/* 1a. la plaque au milieu */
.couv-centre .txt{align-items:center;justify-content:center}
.couv-centre .plaque-titre{max-width:74%;text-align:center}
.couv-centre .ecusson{margin-left:auto;margin-right:auto}

/* 1c. le site dans un portable, le titre sur une ligne en bas */
.couv-portable{background:#071d28;display:block}
.couv-portable::after{display:none}
.couv-portable .scene{position:absolute;left:0;right:0;top:0;bottom:126px;
  display:flex;align-items:center;justify-content:center;padding:30px 70px 16px}
/* le portable tient entierement dans la scene, socle compris : a 76 % il
   depassait et le bandeau lui coupait les pieds */
.couv-portable .portable{width:66%}
/* l'ecran : un cadre sombre, une encoche de camera, l'image dedans */
.couv-portable .ecran{background:#17171c;border-radius:13px 13px 3px 3px;
  padding:15px 15px 17px;position:relative}
.couv-portable .ecran::before{content:"";position:absolute;top:6px;left:50%;
  width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:#43434d}
.couv-portable .ecran img{width:100%;display:block;border-radius:3px;
  aspect-ratio:16/10;object-fit:cover;object-position:top center}
.couv-portable .ecran .vide{width:100%;aspect-ratio:16/10;border-radius:3px;
  background:#0a3544}
/* le socle s'evase vers le bas, comme la base d'un portable */
.couv-portable .socle{height:0;width:118%;margin:0 -9%;
  border-bottom:15px solid #23232b;
  border-left:14px solid transparent;border-right:14px solid transparent;
  box-sizing:border-box;position:relative}
.couv-portable .socle::after{content:"";position:absolute;top:3px;left:50%;
  width:120px;height:5px;margin-left:-60px;background:#13131a;
  border-radius:0 0 5px 5px}

.couv-portable .bandeau{position:absolute;left:0;right:0;bottom:0;height:126px;
  background:#00212c;display:flex;align-items:center;gap:28px;
  padding:0 70px 30px;z-index:2}
.couv-portable .bandeau h1{flex:1;font-size:33px;line-height:1.18;
  letter-spacing:-.03em}
.couv-portable .bandeau .ecusson{margin:0;flex:none;padding:7px 9px;border-radius:11px}
.couv-portable .bandeau .lg{width:32px}
.couv-portable .pied{bottom:12px;color:rgba(223,242,249,.5);border-color:transparent}

/* 1b. un bandeau qui monte du bas jusqu'au quart haut */
.couv-bande .txt{padding:0;align-items:stretch;justify-content:flex-end}
.couv-bande .plaque-titre{background:#00212c;border-radius:0;
  max-width:none;padding:44px 70px 76px}
.couv-bande::after{background:rgba(0,33,44,.12)}
.couv h1{font-size:60px;line-height:1.04;font-weight:800;letter-spacing:-.035em;color:#fff}
.couv .pied{z-index:3;color:rgba(223,242,249,.66);border-color:rgba(255,255,255,.2)}

/* 2 */
.tab{margin-top:26px;border-radius:12px;overflow:hidden}
.tab-tete{display:flex;align-items:center;gap:20px;background:#1c5570;padding:14px 22px}
.tab-tete .ia{display:flex;gap:9px}
.tab-tete .ia svg{width:26px;height:26px;background:#fff;border-radius:50%;padding:5px}
.tab-tete .tt{font-size:17px;font-weight:800;letter-spacing:.012em;color:#fff;
  text-transform:uppercase}
.tab table{width:100%;border-collapse:collapse;background:#fff;font-size:14px}
.tab th{background:#1c5570;color:#fff;font-size:10.5px;font-weight:800;
  letter-spacing:.05em;text-transform:uppercase;text-align:left;padding:9px 22px}
.tab td{padding:7px 22px;border-bottom:1px solid #eaf4f8;color:#0e4e62;font-weight:600}
.tab tbody tr:nth-child(even) td{background:#f6fbfd}
.tab .ast{color:#e01b24;font-size:15px;font-weight:800}
.extrait{display:flex;align-items:center;gap:8px;background:#fff4f3;
  border-top:1px solid #f3cdc8;padding:8px 22px;font-size:12px;
  font-weight:600;color:#9c2b1c;flex:none}
.extrait b{color:#e01b24;font-size:16px}
.tab .n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.tab td.i{font-weight:800}
.i-commerciale{color:#1b63c4}.i-transactionnelle{color:#108a7a}
.i-informationnelle{color:#7a4bc4}.i-resolution{color:#c2681a}
.i-creation{color:#1f8a3b}.i-personnalisation{color:#c2186b}
.concl{margin-top:auto;padding-top:16px;font-size:19px;line-height:1.4;color:#004358}
.concl b{font-weight:800}
.concl .hyp{display:block;margin-top:9px;font-size:11.5px;line-height:1.6;color:#6d93a1}

/* 3 */

.anciens{font-size:16px;color:#dff2f9;opacity:.9}
.anciens b{color:#fff;font-weight:800}
.kick-cas{padding-top:22px}
.cas-grille{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:11px}
.cas-grille{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;
  margin:0;flex:1;min-height:0}
.cas{background:#fff;border-radius:15px;overflow:hidden;
  display:flex;flex-direction:column}
.cas .vis{position:relative;flex:1;min-height:0;overflow:hidden;background:#06283a}
.cas .vis .ph{width:100%;height:100%;object-fit:cover;display:block}
/* veil en aplat : un degrade sort mal dans certains lecteurs de PDF */
.cas .veil{position:absolute;inset:0;z-index:1;background:rgba(0,33,44,.68)}
.cas .kd{position:absolute;top:9px;left:9px;z-index:3;background:#7bd0e6;color:#00212c;
  border-radius:6px;padding:3px 7px;font-size:8px;font-weight:800;
  letter-spacing:.05em;text-transform:uppercase}
.cas .clg{position:absolute;inset:0;z-index:3;display:grid;place-items:center;padding:0 16%}
.cas .clg img{width:100%;height:auto;max-height:34px;object-fit:contain}
.cas .clg img.plaque{background:#fff;border-radius:7px;padding:5px 8px;max-height:36px}
.cas .bd{padding:14px 15px 16px;flex:none}
.cas b{display:block;font-size:24px;font-weight:800;letter-spacing:-.04em;
  color:#1c5570;line-height:1;margin-bottom:6px}
.cas .sb{display:block;font-size:10.5px;line-height:1.45;color:#3e6f80}

/* diagnostic */
.diag{position:relative;margin-top:24px;border-radius:12px;overflow:hidden;
  flex:1;min-height:0}
.diag>img{width:100%;height:100%;object-fit:contain;object-position:center;display:block}
.diag .box{position:absolute;border:2.5px solid #e01b24;border-radius:7px;
  outline:2px solid rgba(224,27,36,.22);outline-offset:1px}
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
.gens{display:grid;grid-template-columns:repeat(4,1fr) 1.5fr;gap:16px;
  align-items:center;margin-top:18px;flex:none}
.gens .g{margin:0;text-align:center}
.gens .g img{width:66px;height:66px;border-radius:50%;object-fit:cover;
  border:2px solid rgba(123,208,230,.5);background:#06283a;display:block;
  margin:0 auto 8px}
.gens .g b{display:block;font-size:14px;font-weight:800;color:#fff;margin-bottom:3px}
.gens .g .ro{display:block;font-size:10px;line-height:1.3;color:#7bd0e6;
  font-weight:700;letter-spacing:.01em;margin-bottom:3px}
.gens .g .an{display:block;font-size:10.5px;line-height:1.3;color:#dff2f9}
.gens .g .ex{display:block;font-size:10.5px;line-height:1.3;color:#9fc6d8}

.gens .trio{display:grid;grid-template-columns:1fr;gap:11px;padding-left:20px;
  border-left:1px solid rgba(123,208,230,.28)}
.gens .trio .st{background:none;padding:0;border-radius:0}
.gens .trio .st b{display:block;font-size:19px;font-weight:800;letter-spacing:-.03em;
  color:#7bd0e6;line-height:1;margin-bottom:3px}
.gens .trio .st span{display:block;font-size:11px;line-height:1.3;color:#cfe6ef}

/* titre au-dessus des cas : la typo de la page, pas le petit mono */
.rep-cas{margin-top:22px;margin-bottom:12px;font-size:19px}
.rep-logos{margin-top:auto;margin-bottom:14px;font-size:17px;text-align:center}

/* bulle de Mael */
.bulle{display:flex;gap:24px;align-items:flex-start;margin-top:auto;
  margin-bottom:auto;max-width:94ch}
.bulle .tete{flex:none;display:block;text-align:center}
.bulle .tete img{width:96px;height:96px;border-radius:50%;object-fit:cover;
  border:3px solid #fff;display:block}
.bulle .li{display:inline-flex;margin-top:9px}
.bulle .li svg{width:19px;height:19px;display:block}
.bulle .dit{position:relative;background:#fff;border-radius:16px;padding:24px 28px;
  border:1px solid rgba(0,67,88,.1)}
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
  const nav = await lance();
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
    const racine = (nom.startsWith('equipe/') || nom.startsWith('visuels/'))
      ? path.dirname(EQUIPE) : SITE;
    const f = path.join(racine, nom);
    if (!f.startsWith(racine) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(8793);

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <style>${STYLE}</style></head><body>${pages(cap)}</body></html>`;
  const page = await nav.newPage({ viewport: { width: L, height: H } });
  await page.goto('http://127.0.0.1:8793/__vide', { waitUntil: 'domcontentloaded' }).catch(() => {});
  // Ce qui n'arrive pas a se charger explique souvent un rendu rate :
  // une police absente, une image hors du conteneur.
  const manque = [];
  page.on('requestfailed', r => manque.push(r.url() + ' : ' +
    (r.failure() && r.failure().errorText)));
  page.on('response', r => { if (r.status() >= 400) manque.push(r.url() + ' : ' + r.status()); });
  page.on('pageerror', e => manque.push('erreur dans la page : ' + e.message));
  page.on('crash', () => manque.push('la page a plante (memoire ?)'));

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
  try {
    await page.pdf({ path: path.join(SORTIE, p.slug + '.pdf'),
                     width: L + 'px', height: H + 'px', printBackground: true });
  } catch (e) {
    // Un echec ici est presque toujours une page tuee faute de memoire.
    // On le dit, avec de quoi trancher, plutot que de sortir en silence.
    const m = process.memoryUsage();
    console.error('Impression du PDF impossible : ' + e.message);
    console.error('memoire node : rss %d Mo, tas %d Mo',
      Math.round(m.rss / 1048576), Math.round(m.heapUsed / 1048576));
    if (manque.length) {
      console.error('ressources en echec (%d) :', manque.length);
      manque.slice(0, 12).forEach(x => console.error('  ' + x));
    }
    throw e;
  }
  if (manque.length) {
    console.log('  ressources en echec : ' + manque.length);
    manque.slice(0, 6).forEach(x => console.log('    ' + x));
  }
  await page.close();
  srv.close();
  await nav.close();
})();
