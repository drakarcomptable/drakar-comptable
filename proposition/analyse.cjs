/* Ce qu'on peut etablir d'un site sans jugement humain.

   Tout ce qui sort d'ici est un fait verifiable : un titre existe ou non,
   un robots.txt laisse passer GPTBot ou non, une page porte des donnees
   structurees ou non. Rien d'interpretatif. Les constats qui demandent du
   jugement restent au consultant, qui les trace a la main dans l'outil.

   Lancement :  node proposition/analyse.cjs <url>
   Sort un objet JSON sur la sortie standard.
*/
const { lance } = require('./navigateur.cjs');

// Les robots des moteurs generatifs. Si robots.txt les bloque, le site est
// absent des reponses, quoi qu'on fasse sur le contenu.
const ROBOTS_IA = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot',
                   'Claude-Web', 'anthropic-ai', 'PerplexityBot',
                   'Google-Extended', 'Bingbot', 'Applebot-Extended'];

const MOTS_VIDES = new Set(('le la les un une des du de et ou a au aux en pour par ' +
  'sur dans avec sans nos notre votre vos nous vous est sont qui que quoi plus ' +
  'tout tous toute toutes son sa ses ce cette ces il elle ils elles ne pas').split(' '));

// Un libelle de navigation n'est pas une requete commerciale : personne ne
// cherche « contactez-nous ». Une piste batie uniquement sur ces mots est
// ecartee.
const NAVIGATION = new Set(('accueil propos contact contactez contacter equipe équipe ' +
  'valeurs mentions legales légales confidentialite confidentialité blog actualites ' +
  'actualités carriere carrière carrieres carrières recrutement faq apropos ' +
  'temoignages témoignages references références partenaires presse newsletter ' +
  'connexion inscription compte panier suivant precedent précédent lire savoir ' +
  'decouvrir découvrir voir tous demander').split(' '));

function nettoie(t) {
  return (t || '').replace(/\s+/g, ' ').trim();
}

async function analyse(url) {
  const nav = await lance();
  const pg = await nav.newPage({ viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1 });
  const r = { url, atteint: false };
  try {
    const rep = await pg.goto(url, { waitUntil: 'load', timeout: 25000 });
    r.atteint = true;
    r.statut = rep ? rep.status() : null;
    r.url_finale = pg.url();

    const faits = await pg.evaluate(() => {
      const txt = s => (document.querySelector(s)?.textContent || '').replace(/\s+/g, ' ').trim();
      const att = (s, a) => document.querySelector(s)?.getAttribute(a) || '';
      const h = n => [...document.querySelectorAll('h' + n)]
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      let jsonld = [];
      for (const e of document.querySelectorAll('script[type="application/ld+json"]')) {
        try {
          const o = JSON.parse(e.textContent);
          for (const x of (Array.isArray(o) ? o : [o]))
            if (x && x['@type']) jsonld.push(String(x['@type']));
        } catch (err) { jsonld.push('(illisible)'); }
      }
      return {
        titre: txt('title'),
        description: att('meta[name="description"]', 'content'),
        og_site: att('meta[property="og:site_name"]', 'content'),
        canonical: att('link[rel="canonical"]', 'href'),
        robots_meta: att('meta[name="robots"]', 'content'),
        h1: h(1), h2: h(2), h3: h(3),
        jsonld,
        nav: [...document.querySelectorAll('nav a, header a')]
          .map(a => (a.innerText || '').replace(/\s+/g, ' ').trim())
          .filter(t => t && t.length < 40).slice(0, 20),
        mots: (document.body.innerText || '').split(/\s+/).length,
        images: document.querySelectorAll('img').length,
        images_sans_alt: [...document.querySelectorAll('img')]
          .filter(i => !i.getAttribute('alt')).length,
      };
    });
    Object.assign(r, faits);

    // robots.txt et llms.txt, a la racine du domaine
    const base = new URL(pg.url()).origin;
    for (const [cle, chemin] of [['robots', '/robots.txt'], ['llms', '/llms.txt']]) {
      try {
        const rr = await pg.request.get(base + chemin, { timeout: 12000 });
        r[cle] = rr.ok() ? await rr.text() : null;
      } catch (e) { r[cle] = null; }
    }
    r.ia_bloques = [];
    if (r.robots) {
      const lignes = r.robots.split('\n').map(l => l.trim());
      let agent = null, bloque = false;
      for (const l of lignes) {
        const ua = l.match(/^user-agent:\s*(.+)$/i);
        if (ua) { agent = ua[1].trim(); bloque = false; continue; }
        if (/^disallow:\s*\/\s*$/i.test(l) && agent) {
          const a = ROBOTS_IA.find(x => x.toLowerCase() === agent.toLowerCase());
          if (a && !r.ia_bloques.includes(a)) r.ia_bloques.push(a);
        }
      }
    }

    /* Le nom de l'entreprise, et lui seul.

       Un titre de page, et souvent og:site_name, porte le nom suivi de
       l'accroche : « 1600.agency - The video agency for SaaS ». Sur une
       page de garde adressee a un prospect, la phrase entiere n'est pas
       son nom. On coupe donc aux separateurs usuels, puis on tranche
       avec le nom de domaine, qui est la seule preuve disponible de la
       marque : le morceau qui s'y retrouve est le bon, qu'il soit place
       avant ou apres le separateur, les deux ordres etant courants. */
    const hote = new URL(pg.url()).hostname.replace(/^www\./, '');
    const plat = x => x.toLowerCase().replace(/[^a-z0-9]/g, '');
    const marque = (brut) => {
      const t = nettoie(brut);
      if (!t) return '';
      const parts = t.split(/\s+[|–—·•]\s+|\s+-\s+|\s*:\s+/)
                     .map(x => x.trim()).filter(x => x.length >= 2);
      if (parts.length < 2) return t;
      const h = plat(hote);
      for (const x of parts) {
        const p = plat(x);
        if (p.length >= 3 && (h.includes(p) || p.includes(h.split('.')[0]))) return x;
      }
      // a defaut, le morceau le plus court reste le candidat le plus
      // credible : une accroche est presque toujours plus longue qu'un nom
      return parts.slice().sort((a, b) => a.length - b.length)[0];
    };

    let nom = marque(r.og_site) || marque(r.titre);
    if (!nom || nom.length > 40) {
      nom = hote.split('.')[0];
      nom = nom.charAt(0).toUpperCase() + nom.slice(1);
    }
    r.entreprise = nom;

    // des requetes candidates, tirees de ce que le site dit de lui-meme.
    // Ce sont des pistes, pas des volumes : le volume demande un outil.
    const sources = [...r.h1, ...r.h2, ...r.h3, ...r.nav];
    const vues = new Set(), pistes = [];
    for (const s of sources) {
      const m = nettoie(s).toLowerCase()
        .replace(/[^a-zà-ÿ0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
      const mots = m.split(' ').filter(w => w.length > 2 && !MOTS_VIDES.has(w));
      if (mots.length < 1 || mots.length > 5) continue;
      // au moins un mot qui ne soit pas de la navigation, sinon ce n'est
      // pas une requete mais une entree de menu
      if (!mots.some(w => !NAVIGATION.has(w))) continue;
      const cle = mots.join(' ');
      if (cle.length < 6 || vues.has(cle)) continue;
      vues.add(cle);
      pistes.push(cle);
    }
    r.pistes = pistes.slice(0, 12);

  } catch (e) {
    r.erreur = String(e.message).split('\n')[0].slice(0, 200);
  } finally {
    await nav.close();
  }
  return r;
}

/* Les constats mecaniques : chacun est un fait, pas une opinion. */
function constats(a) {
  const c = [];
  const t = nettoie(a.titre);
  if (!t) c.push('La page n’a pas de balise titre.');
  else if (t.length > 65) c.push('Le titre fait ' + t.length +
    ' caractères : il sera coupé dans les résultats.');
  if (!nettoie(a.description)) c.push('Aucune méta description.');
  if (!a.h1 || !a.h1.length) c.push('Aucun H1 sur la page.');
  else if (a.h1.length > 1) c.push(a.h1.length + ' balises H1 : la hiérarchie est ambiguë.');
  if (!a.jsonld || !a.jsonld.length)
    c.push('Aucune donnée structurée : rien qu’une IA puisse citer directement.');
  if (a.llms === null) c.push('Pas de fichier llms.txt à la racine.');
  if (a.ia_bloques && a.ia_bloques.length)
    c.push('robots.txt bloque ' + a.ia_bloques.join(', ') + '.');
  if (a.images && a.images_sans_alt / a.images > 0.3)
    c.push(a.images_sans_alt + ' images sur ' + a.images + ' n’ont pas d’alternative textuelle.');
  if (a.mots && a.mots < 300)
    c.push('La page compte ' + a.mots + ' mots : trop peu pour être citée sur une requête précise.');
  return c;
}

module.exports = { analyse, constats };

if (require.main === module) {
  const url = process.argv[2];
  if (!url) { console.error('usage : node proposition/analyse.cjs <url>'); process.exit(2); }
  analyse(url)
    .then(a => { a.constats = constats(a); console.log(JSON.stringify(a)); })
    .catch(e => { console.error(String(e.message).split('\n')[0]); process.exit(1); });
}
