/* Les creneaux reellement libres dans l'agenda de Mael.
 *
 * La page d'atterrissage les affiche elle-meme, au lieu d'encastrer l'agenda
 * HubSpot dans une iframe : sur telephone, cette iframe capturait le geste du
 * pouce et donnait l'impression que la page se resumait au calendrier.
 *
 * Lecture seule. Aucun parametre n'est lu depuis la requete : le lien et le
 * fuseau sont figes ci-dessous, donc cette route ne peut servir qu'a une
 * chose. Les donnees qu'elle expose sont de toute facon publiques, ce sont
 * celles qu'affiche la page de reservation HubSpot.
 */

const LIEN   = 'mael-gallais%2Fauditnazargeo';
const FUSEAU = 'Europe/Paris';
const JOURS  = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
const MOIS   = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* Intl donne l'heure de Paris sans dependre du fuseau du serveur, qui est en
   UTC chez Vercel. Sans cela tous les creneaux seraient decales. */
const HEURE = new Intl.DateTimeFormat('fr-FR', {
  timeZone: FUSEAU, hour: '2-digit', minute: '2-digit', hour12: false
});
const PIECES = new Intl.DateTimeFormat('en-CA', {
  timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
});

function jourDe(ms) {
  const d = new Date(ms);
  const p = {};
  for (const x of PIECES.formatToParts(d)) p[x.type] = x.value;
  return {
    cle: p.year + '-' + p.month + '-' + p.day,
    num: parseInt(p.day, 10),
    moisNom: MOIS[parseInt(p.month, 10) - 1],
    // weekday vient en anglais abrege ; on repasse par getUTCDay sur une date
    // reconstruite pour obtenir l'indice, independamment de la langue.
    indice: new Date(p.year + '-' + p.month + '-' + p.day + 'T12:00:00Z').getUTCDay()
  };
}

module.exports = async function (req, res) {
  if (req.method !== 'GET') { res.status(405).json({ erreur: 'methode non autorisee' }); return; }

  const jeton = process.env.HUBSPOT_TOKEN;
  if (!jeton) { res.status(500).json({ erreur: 'configuration incomplete' }); return; }

  const url = 'https://api.hubapi.com/scheduler/2026-03/meetings/meeting-links/book/'
            + LIEN + '?timezone=' + encodeURIComponent(FUSEAU);

  let donnees;
  try {
    const r = await fetch(url, {
      headers: { Authorization: 'Bearer ' + jeton, Accept: 'application/json' }
    });
    if (!r.ok) { res.status(502).json({ erreur: 'agenda indisponible', statut: r.status }); return; }
    donnees = await r.json();
  } catch (e) {
    res.status(502).json({ erreur: 'agenda injoignable' });
    return;
  }

  const reglages = (donnees && donnees.customParams) || {};
  const duree = (reglages.durations && reglages.durations[0]) || 1800000;
  const parDuree = (donnees.linkAvailability && donnees.linkAvailability.linkAvailabilityByDuration) || {};
  const bloc = parDuree[String(duree)] || parDuree[Object.keys(parDuree)[0]] || {};
  const libres = bloc.availabilities || [];

  /* HubSpot n'annonce ses disponibilites que sur un nombre de semaines fixe
     dans les reglages du lien, deux chez nous. Proposer au-dela afficherait
     des jours systematiquement vides. */
  const semaines = reglages.weeksToAdvertise || 2;
  const limite = Date.now() + semaines * 7 * 24 * 3600 * 1000;

  const parJour = new Map();
  for (const c of libres) {
    const debut = c.startMillisUtc;
    if (typeof debut !== 'number' || debut > limite) continue;
    const j = jourDe(debut);
    if (!parJour.has(j.cle)) {
      parJour.set(j.cle, { date: j.cle, jour: JOURS[j.indice], num: j.num, mois: j.moisNom, creneaux: [] });
    }
    parJour.get(j.cle).creneaux.push({ h: HEURE.format(new Date(debut)), debut: debut });
  }

  const jours = [...parJour.values()].sort((a, b) => a.date.localeCompare(b.date));
  for (const j of jours) j.creneaux.sort((a, b) => a.debut - b.debut);

  /* Cache court : l'agenda bouge, mais pas a la seconde. Cela evite aussi de
     frapper l'API HubSpot a chaque visiteur. */
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  res.status(200).json({
    dureeMinutes: Math.round(duree / 60000),
    fuseau: FUSEAU,
    lieu: reglages.location || null,
    jours: jours
  });
};
