/* Decoupe la page d'un prospect en sections, et photographie chacune.

   Le haut d'une page d'accueil est l'endroit ou un site est a son
   avantage : grand titre, boutons, chiffres. Les defauts qui nous
   interessent sont plus bas, dans les blocs de contenu, la ou le site
   repond ou ne repond pas a une intention de recherche.

   Un script ne sait pas juger quelle section merite d'etre annotee :
   c'est du conseil. Il sait en revanche les decouper toutes et les
   presenter, pour qu'on choisisse en un clic.

   Lancement direct :
     node proposition/sections.cjs <url> <dossier de sortie> [prefixe]

   Il ecrit les images et imprime leur description en JSON sur la sortie
   standard, pour que l'outil puisse les afficher.
*/
const { lance } = require('./navigateur.cjs');
const fs = require('fs');
const path = require('path');

const LARGE = 1440;
const HAUT = 900;
const MIN_H = 260;      // en-dessous, ce n'est pas une section mais un liseret
const MAX_H = 1500;     // au-dela, c'est la page entiere deguisee en section
const MAX_N = 10;

/* Une capture prise trop tot est blanche.

   Apres un changement de taille de fenetre ou un defilement, la page doit
   repeindre. Une attente fixe suffit sur une machine rapide et ne suffit
   pas sur une petite : c'est exactement ce qui donnait un ecran blanc en
   ligne alors que tout allait bien en local.

   On attend donc le calme du reseau et deux images d'animation, puis on
   verifie le resultat : une capture quasi uniforme pese une misere en
   JPEG. Si elle est suspecte, on recommence en laissant plus de temps. */
const BLANC = 14 * 1024;   // en dessous, l'image n'a presque rien dedans

/* Combien d'elements sont reellement visibles dans la fenetre.

   Beaucoup de sites font apparaitre leurs blocs au defilement. Tant que
   l'animation n'a pas joue, ils sont la mais transparents : la page est
   prete au sens du reseau, et pourtant la photo serait blanche. */
async function peuple(pg) {
  return pg.evaluate(() => {
    let n = 0;
    for (const e of document.body.querySelectorAll('*')) {
      const r = e.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || r.width < 24 || r.height < 12) continue;
      const st = getComputedStyle(e);
      if (st.visibility === 'hidden' || parseFloat(st.opacity) < 0.15) continue;
      n++;
      if (n > 40) return n;
    }
    return n;
  }).catch(() => 99);
}

/* Ecarte les bandeaux de consentement avant la photo.

   Ils flottent par-dessus la page et se retrouvaient sur la couverture
   d'un document commercial. On vise d'abord les solutions connues par
   leur identifiant, puis, pour les autres, un bloc flottant assez grand
   dont le texte parle de cookies.

   On ne touche a rien d'autre : un bandeau mal identifie et retire
   abimerait la capture au lieu de l'ameliorer. */
const CONNUS = [
  '#onetrust-consent-sdk', '#didomi-host', '#axeptio_overlay', '#tarteaucitronRoot',
  '#cookie-law-info-bar', '.cmplz-cookiebanner', '.cc-window', '#usercentrics-root',
  '#CybotCookiebotDialog', '.cookie-banner', '#cookie-banner', '#cookieConsent',
  '.cky-consent-container', '#hs-eu-cookie-confirmation',
];

async function masque(pg) {
  return pg.evaluate((connus) => {
    let n = 0;
    for (const sel of connus) {
      for (const e of document.querySelectorAll(sel)) { e.remove(); n++; }
    }
    const MOTS = /(cookie|consentement|consent|rgpd|gdpr|vie priv|tracking|traceur)/i;
    for (const e of document.querySelectorAll('div,section,aside,dialog,iframe')) {
      const st = getComputedStyle(e);
      if (st.position !== 'fixed' && st.position !== 'sticky') continue;
      const r = e.getBoundingClientRect();
      if (r.width < 180 || r.height < 60) continue;
      const t = (e.innerText || e.getAttribute('title') || '').slice(0, 800);
      if (!MOTS.test(t)) continue;
      e.remove(); n++;
    }
    return n;
  }, CONNUS).catch(() => 0);
}

async function calme(pg, ms) {
  await pg.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await pg.evaluate(() => new Promise(r =>
    requestAnimationFrame(() => requestAnimationFrame(r))));
  await pg.waitForTimeout(ms);
  // on laisse aux animations d'apparition le temps de jouer
  for (let k = 0; k < 10 && (await peuple(pg)) < 8; k++) {
    await pg.waitForTimeout(400);
  }
  await masque(pg);
}

async function prise(pg, f, qualite) {
  for (const attente of [350, 1200, 3000]) {
    await calme(pg, attente);
    await pg.screenshot({ path: f, type: 'jpeg', quality: qualite });
    if (fs.statSync(f).size >= BLANC) return fs.statSync(f).size;
  }
  console.error('capture presque vide malgre trois essais : ' + path.basename(f));
  return fs.statSync(f).size;
}

async function sections(url, dossier, prefixe) {
  if (!fs.existsSync(dossier)) fs.mkdirSync(dossier, { recursive: true });
  const nav = await lance();
  const pg = await nav.newPage({ viewport: { width: LARGE, height: HAUT },
    deviceScaleFactor: 1 });
  const sortie = [];
  try {
    await pg.goto(url, { waitUntil: 'load', timeout: 25000 });
    await pg.waitForTimeout(1500);

    // La couverture d'abord, avant d'avoir touche a quoi que ce soit.
    // Prise en dernier, apres le parcours et dix changements de taille de
    // fenetre, elle sortait blanche sur les sites dont les blocs
    // apparaissent au defilement : revenus en haut, ils etaient masques.
    const acc = path.join(dossier, prefixe + '-accueil.jpg');
    await prise(pg, acc, 86);
    sortie.push({ fichier: acc, titre: 'Haut de la page d’accueil',
                  haut: 0, hauteur: HAUT, note: null, couverture: true,
                  octets: fs.statSync(acc).size });

    // On fait defiler toute la page une fois : beaucoup de sites ne
    // chargent leurs images qu'au passage du lecteur.
    await pg.evaluate(async () => {
      const pas = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await pg.waitForTimeout(800);

    const blocs = await pg.evaluate((bornes) => {
      const [min, max] = bornes;
      const vus = [];

      /* Quelle section merite d'etre optimisee ?

         Celle qui vend quelque chose, mais sous une forme qu'aucune IA ne
         peut reprendre : un titre de service, puis une bouillie de puces
         courtes, sans phrase a citer et sans chiffre a verifier. C'est le
         cas typique du bloc « nos expertises » : commercialement central,
         et invisible dans une reponse generative.

         Aucun de ces signaux n'est un jugement : ce sont des comptages. */
      const SERVICE = new RegExp([
        'service', 'expertise', 'solution', 'offre', 'prestation', 'produit',
        'accompagn', 'm[ée]tier', 'savoir.?faire', 'ce que nous',
        'nos domaines', 'nos p[ôo]les'].join('|'), 'i');
      const ECARTE = new RegExp([
        'contact', 'mentions', 'l[ée]gal', 'cookie', 'confidentialit',
        'newsletter', 'recrut', 'carri[èe]re', 'plan du site', 'suivez',
        'r[ée]seaux'].join('|'), 'i');

      const note = (el, titre, haut) => {
        const txt = (el.innerText || '').trim();
        const mots = txt.split(/\s+/).filter(Boolean).length;
        const puces = el.querySelectorAll('li').length;
        const phrases = (txt.match(/[.!?](\s|$)/g) || []).length;
        const chiffres = (txt.match(/\d/g) || []).length;

        let n = 0;
        if (SERVICE.test(titre)) n += 30;          // le bloc vend quelque chose
        n += Math.min(puces, 12) * 2;              // des puces, pas des phrases
        if (mots > 80 && phrases / mots < 0.02) n += 15;   // rien a citer
        if (chiffres === 0) n += 10;               // rien de verifiable
        if (mots >= 60) n += 10;                   // assez de matiere
        if (ECARTE.test(titre)) n -= 60;           // pied de page, mentions
        if (haut < 400) n -= 25;                   // le haut de page flatte
        return { note: n, mots, puces, phrases, chiffres,
                 questions: (txt.match(/\?/g) || []).length };
      };
      const candidats = document.querySelectorAll(
        'body > section, body > div > section, main > section, main > div, ' +
        'body > div > div[class], body > main > div, section');
      for (const el of candidats) {
        const r = el.getBoundingClientRect();
        const h = r.height, t = r.top + window.scrollY;
        if (h < min || h > max || r.width < window.innerWidth * 0.6) continue;
        // on ecarte un bloc qui en recouvre un deja retenu
        if (vus.some(v => Math.abs(v.t - t) < 80)) continue;
        const txt = (el.innerText || '').trim().replace(/\s+/g, ' ');
        if (txt.length < 40) continue;      // un bloc sans texte n'a rien a dire
        const titre = (el.querySelector('h1,h2,h3')?.innerText || txt)
                        .trim().replace(/\s+/g, ' ').slice(0, 70);
        vus.push(Object.assign({ t: Math.round(t), h: Math.round(h), titre },
                               note(el, titre, t)));
      }
      vus.sort((a, b) => a.t - b.t);
      return vus;
    }, [MIN_H, MAX_H]);

    const retenus = blocs.slice(0, MAX_N);
    for (let i = 0; i < retenus.length; i++) {
      const b = retenus[i];
      const f = path.join(dossier, prefixe + '-sect-' + (i + 1) + '.jpg');
      await pg.setViewportSize({ width: LARGE, height: Math.min(b.h, MAX_H) });
      await pg.evaluate(y => window.scrollTo(0, y), b.t);
      const poids = await prise(pg, f, 84);
      sortie.push({ fichier: f, titre: b.titre, haut: b.t, hauteur: b.h,
                    note: b.note, mots: b.mots, puces: b.puces,
                    phrases: b.phrases, chiffres: b.chiffres,
                    questions: b.questions, octets: poids });
    }


  } finally {
    await nav.close();
  }
  return sortie;
}

module.exports = { sections };

if (require.main === module) {
  const [url, dossier, prefixe] = process.argv.slice(2);
  if (!url || !dossier) {
    console.error('usage : node proposition/sections.cjs <url> <dossier> [prefixe]');
    process.exit(2);
  }
  sections(url, dossier, prefixe || 'site')
    .then(l => console.log(JSON.stringify(l)))
    .catch(e => { console.error(String(e.message).split('\n')[0]); process.exit(1); });
}
