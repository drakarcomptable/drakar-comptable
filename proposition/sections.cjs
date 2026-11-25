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
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LARGE = 1440;
const HAUT = 900;
const MIN_H = 260;      // en-dessous, ce n'est pas une section mais un liseret
const MAX_H = 1500;     // au-dela, c'est la page entiere deguisee en section
const MAX_N = 10;

async function sections(url, dossier, prefixe) {
  if (!fs.existsSync(dossier)) fs.mkdirSync(dossier, { recursive: true });
  const nav = await chromium.launch();
  const pg = await nav.newPage({ viewport: { width: LARGE, height: HAUT },
    deviceScaleFactor: 1 });
  const sortie = [];
  try {
    await pg.goto(url, { waitUntil: 'load', timeout: 25000 });
    await pg.waitForTimeout(1500);

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
      await pg.waitForTimeout(250);
      await pg.screenshot({ path: f, type: 'jpeg', quality: 84 });
      sortie.push({ fichier: f, titre: b.titre, haut: b.t, hauteur: b.h,
                    note: b.note, mots: b.mots, puces: b.puces,
                    phrases: b.phrases, chiffres: b.chiffres,
                    questions: b.questions, octets: fs.statSync(f).size });
    }

    // et la page d'accueil telle qu'on la decouvre, pour la couverture
    await pg.setViewportSize({ width: LARGE, height: HAUT });
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.waitForTimeout(250);
    const acc = path.join(dossier, prefixe + '-accueil.jpg');
    await pg.screenshot({ path: acc, type: 'jpeg', quality: 86 });
    // La couverture, qui n'est jamais candidate a l'annotation.
    sortie.unshift({ fichier: acc, titre: 'Haut de la page d’accueil',
                     haut: 0, hauteur: HAUT, note: null, couverture: true,
                     octets: fs.statSync(acc).size });
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
