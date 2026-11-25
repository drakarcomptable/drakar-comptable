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
const ATTENTES = [350, 1200, 3000];

/* Ce que la machine a reellement fait, imprime sur la sortie d'erreur.

   Sans ce releve, un echec en ligne est muet : on voit une couverture
   blanche et un document sans page de diagnostic, sans savoir si la photo
   etait vide sur le disque ou si aucun bloc n'a ete trouve. */
const TRACE = [];
const ko = n => Math.round(n / 1024) + ' Ko';

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

async function prise(pg, f, qualite, etiquette) {
  let octets = 0;
  for (let i = 0; i < ATTENTES.length; i++) {
    await calme(pg, ATTENTES[i]);
    await pg.screenshot({ path: f, type: 'jpeg', quality: qualite });
    octets = fs.statSync(f).size;
    if (octets >= BLANC) {
      TRACE.push(etiquette + ' : ' + ko(octets) +
                 (i ? ', ' + (i + 1) + ' essais' : ''));
      return octets;
    }
  }
  TRACE.push(etiquette + ' : PRESQUE VIDE, ' + ko(octets) + ' apres ' +
             ATTENTES.length + ' essais');
  return octets;
}

/* Attend que la page soit posee : hauteur stable et blocs mesurables.

   Le decoupage s'appuie sur getBoundingClientRect. Sur une machine lente
   il s'executait avant la fin de la mise en page : les blocs faisaient
   zero de haut, aucun ne passait les filtres, et le document sortait sans
   sa page de diagnostic. Une attente fixe ne protege de rien, puisque
   c'est justement la lenteur de la machine qui est en cause. */
async function pose(pg) {
  let avant = -1, m = { h: 0, gros: 0 };
  for (let k = 0; k < 25; k++) {
    m = await pg.evaluate(() => {
      let gros = 0;
      for (const e of document.querySelectorAll('section,div,main,article')) {
        const r = e.getBoundingClientRect();
        if (r.height >= 260 && r.width >= innerWidth * 0.6) gros++;
      }
      return { h: document.body.scrollHeight, gros };
    }).catch(() => ({ h: 0, gros: 0 }));
    if (m.gros >= 3 && m.h === avant && m.h > 0) break;
    avant = m.h;
    await pg.waitForTimeout(400);
  }
  TRACE.push('mise en page : ' + m.gros + ' blocs mesurables, hauteur ' + m.h);
  return m;
}

async function sections(url, dossier, prefixe) {
  if (!fs.existsSync(dossier)) fs.mkdirSync(dossier, { recursive: true });
  const nav = await lance();
  const pg = await nav.newPage({ viewport: { width: LARGE, height: HAUT },
    deviceScaleFactor: 1 });

  /* Reproduire une machine lente sans en louer une.

     Le serveur en ligne tourne sur un seul processeur. Une correction qui
     passe ici et echoue la-bas coute un aller-retour a chaque fois :
     DONETADOC_LENT=6 bride le processeur du navigateur d'autant, ce qui
     remet les pannes de mise en page sous la main.  */
  const lent = parseFloat(process.env.DONETADOC_LENT || '0');
  if (lent > 1) {
    const cdp = await pg.context().newCDPSession(pg);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: lent });
    TRACE.push('processeur bride ' + lent + 'x (essai)');
  }
  const sortie = [];
  try {
    const rep = await pg.goto(url, { waitUntil: 'load', timeout: 25000 });
    await pg.waitForTimeout(1500);
    if (rep) {
      TRACE.push('reponse : ' + rep.status() + ' ' + rep.statusText() +
                 ', servie par ' + (rep.headers()['server'] || 'inconnu'));
    }

    /* Dire quelle page est reellement arrivee.

       Le meme code, le meme navigateur et la meme adresse ne donnent pas
       forcement la meme page : un pare-feu peut servir une page de
       controle a l'adresse IP d'un hebergeur et le vrai site ailleurs. Un
       titre et un nombre de caracteres suffisent a le voir, au lieu de le
       deduire d'une couverture blanche. */
    const vu = await pg.evaluate(() => ({
      titre: (document.title || '').slice(0, 70),
      adresse: location.href.slice(0, 110),
      texte: (document.body && document.body.innerText || '').trim().length,
    })).catch(() => ({ titre: '?', adresse: '?', texte: 0 }));
    TRACE.push('page servie : « ' + vu.titre + ' », ' + vu.texte +
               ' caracteres de texte, ' + vu.adresse);

    const mep = await pose(pg);

    /* Une page vide n'est pas une page.

       Le site repondait, la navigation aboutissait, et la page restait
       sans un caractere ni un bloc : la couverture sortait grise et le
       document sans sa page de diagnostic, sans que rien ne le signale.
       Mieux vaut s'arreter ici. L'outil demande alors les deux captures
       a deposer a la main, ce qui est prevu et reversible, plutot que de
       livrer un document commercial abime. */
    if (vu.texte < 40 && mep.gros === 0) {
      throw new Error('la page est arrivee vide (' + vu.texte +
        ' caractere(s), aucun bloc mesurable). Le site a repondu, mais ' +
        'il ne sert rien a une visite automatique. Deposez les deux ' +
        'captures a la main.');
    }

    // La couverture d'abord, avant d'avoir touche a quoi que ce soit.
    // Prise en dernier, apres le parcours et dix changements de taille de
    // fenetre, elle sortait blanche sur les sites dont les blocs
    // apparaissent au defilement : revenus en haut, ils etaient masques.
    const acc = path.join(dossier, prefixe + '-accueil.jpg');
    await prise(pg, acc, 86, 'couverture');
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
    await pose(pg);

    const scan = await pg.evaluate((bornes) => {
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
      const rejets = { taille: 0, largeur: 0, double: 0, texte: 0 };
      const candidats = document.querySelectorAll(
        'body > section, body > div > section, main > section, main > div, ' +
        'body > div > div[class], body > main > div, section');
      for (const el of candidats) {
        const r = el.getBoundingClientRect();
        const h = r.height, t = r.top + window.scrollY;
        if (h < min || h > max) { rejets.taille++; continue; }
        if (r.width < window.innerWidth * 0.6) { rejets.largeur++; continue; }
        // on ecarte un bloc qui en recouvre un deja retenu
        if (vus.some(v => Math.abs(v.t - t) < 80)) { rejets.double++; continue; }
        const txt = (el.innerText || '').trim().replace(/\s+/g, ' ');
        if (txt.length < 40) { rejets.texte++; continue; }
        const titre = (el.querySelector('h1,h2,h3')?.innerText || txt)
                        .trim().replace(/\s+/g, ' ').slice(0, 70);
        vus.push(Object.assign({ t: Math.round(t), h: Math.round(h), titre },
                               note(el, titre, t)));
      }
      vus.sort((a, b) => a.t - b.t);
      return { vus, examines: candidats.length, rejets };
    }, [MIN_H, MAX_H]);

    const blocs = scan.vus;
    const rj = scan.rejets;
    TRACE.push('decoupage : ' + scan.examines + ' blocs examines, ' +
               blocs.length + ' retenus (ecartes : taille ' + rj.taille +
               ', largeur ' + rj.largeur + ', doublon ' + rj.double +
               ', sans texte ' + rj.texte + ')');
    if (blocs.length) {
      TRACE.push('notes : ' + blocs.slice(0, MAX_N)
        .map(b => '« ' + b.titre.slice(0, 24) + ' » ' + b.note).join(' | '));
    }

    const retenus = blocs.slice(0, MAX_N);
    for (let i = 0; i < retenus.length; i++) {
      const b = retenus[i];
      const f = path.join(dossier, prefixe + '-sect-' + (i + 1) + '.jpg');
      await pg.setViewportSize({ width: LARGE, height: Math.min(b.h, MAX_H) });
      await pg.evaluate(y => window.scrollTo(0, y), b.t);
      const poids = await prise(pg, f, 84, 'section ' + (i + 1));
      sortie.push({ fichier: f, titre: b.titre, haut: b.t, hauteur: b.h,
                    note: b.note, mots: b.mots, puces: b.puces,
                    phrases: b.phrases, chiffres: b.chiffres,
                    questions: b.questions, octets: poids });
    }


  } finally {
    await nav.close();
    if (TRACE.length) console.error(TRACE.join('\n'));
  }
  return sortie;
}

module.exports = { sections, prise, calme, masque, pose };

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
