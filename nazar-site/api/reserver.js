/* La reservation d'un creneau, envoyee a HubSpot.
 *
 * Le visiteur choisit son jour, son heure et laisse ses coordonnees sur notre
 * page : la reservation se termine donc chez nous, et non plus sur la page de
 * HubSpot. Cela nous rend la mesure de la conversion et la maitrise du
 * parcours, que l'iframe avait emportees.
 *
 * Chaque appel a HubSpot est borne dans le temps. Sans cela, la fonction
 * restait pendue jusqu'a ce que la plateforme la tue, et le visiteur voyait
 * « Connexion interrompue » apres une longue attente, sans rien apprendre.
 */

const LIEN     = 'mael-gallais/auditnazargeo';
const FUSEAU   = 'Europe/Paris';
const BOOK     = 'https://api.hubapi.com/scheduler/2026-03/meetings/meeting-links/book';
const INFO     = BOOK + '/' + encodeURIComponent(LIEN) + '?timezone=' + encodeURIComponent(FUSEAU);
const QUESTION = "Avez-vous un projet en cours ? Si oui, pouvez-vous m'en dire un peu plus ?";
const DUREE_DEFAUT = 1800000;

function texte(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/* fetch borne : au-dela du delai on abandonne et on le dit, plutot que de
   laisser la plateforme couper la fonction sans explication. */
async function appel(url, options, msMax) {
  const arret = new AbortController();
  const minuteur = setTimeout(function () { arret.abort(); }, msMax);
  try {
    const r = await fetch(url, Object.assign({}, options, { signal: arret.signal }));
    const brut = await r.text();
    let corps;
    try { corps = JSON.parse(brut); } catch (e) { corps = brut.slice(0, 800); }
    return { statut: r.status, corps: corps };
  } finally {
    clearTimeout(minuteur);
  }
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') { res.status(405).json({ erreur: 'methode non autorisee' }); return; }

  const jeton = process.env.HUBSPOT_TOKEN;
  if (!jeton) { res.status(500).json({ erreur: 'configuration incomplete' }); return; }

  let corps = req.body;
  if (typeof corps === 'string') { try { corps = JSON.parse(corps); } catch (e) { corps = {}; } }
  corps = corps || {};

  const prenom = texte(corps.prenom, 60);
  const nom    = texte(corps.nom, 60);
  const email  = texte(corps.email, 120);
  const tel    = texte(corps.telephone, 30);
  const mot    = texte(corps.message, 600);
  const debut  = Number(corps.debut);

  const manque = [];
  if (!prenom) manque.push('prenom');
  if (!nom) manque.push('nom');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) manque.push('email');
  if (!tel) manque.push('telephone');
  if (!Number.isFinite(debut) || debut < Date.now()) manque.push('creneau');
  if (manque.length) { res.status(400).json({ erreur: 'champs', champs: manque }); return; }

  const entete = {
    Authorization: 'Bearer ' + jeton,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  /* Relecture de l'agenda, pour la duree du lien et pour verifier que le
     creneau est toujours libre. Elle echoue ouvert : si HubSpot tarde, on
     tente la reservation quand meme, c'est lui qui tranchera. Mieux vaut un
     refus clair de sa part qu'une attente qui n'aboutit pas. */
  let duree = DUREE_DEFAUT;
  try {
    const info = await appel(INFO, { headers: entete }, 5000);
    if (info.statut < 400 && info.corps && typeof info.corps === 'object') {
      const reg = info.corps.customParams || {};
      duree = (reg.durations && reg.durations[0]) || duree;
      const parDuree = (info.corps.linkAvailability
                     && info.corps.linkAvailability.linkAvailabilityByDuration) || {};
      const bloc = parDuree[String(duree)] || parDuree[Object.keys(parDuree)[0]] || {};
      const libres = bloc.availabilities || [];
      if (libres.length && !libres.some(function (c) { return c.startMillisUtc === debut; })) {
        res.status(409).json({ erreur: 'creneau_pris' });
        return;
      }
    }
  } catch (e) {
    console.error('relecture agenda ignoree :', String((e && e.name) || e));
  }

  const base = {
    slug: LIEN,
    startTime: debut,
    duration: duree,
    firstName: prenom,
    lastName: nom,
    email: email,
    timezone: FUSEAU
  };

  /* Le telephone est un champ de formulaire du lien, pas un champ racine :
     envoye a la racine, HubSpot repond « required form field phone does not
     have a corresponding value ». La forme attendue, etablie par la premiere
     reservation reelle, est une liste de paires nom/valeur. La question libre
     voyage dans la meme liste, sous son intitule complet. */
  const formFields = [{ name: 'phone', value: tel }];
  if (mot) formFields.push({ name: QUESTION, value: mot });

  try {
    const rep = await appel(BOOK + '?timezone=' + encodeURIComponent(FUSEAU),
      { method: 'POST', headers: entete,
        body: JSON.stringify(Object.assign({}, base, { formFields: formFields })) },
      9000);
    if (rep.statut < 400) {
      res.status(200).json({ ok: true, dureeMinutes: Math.round(duree / 60000) });
      return;
    }
    /* Le detail de HubSpot ne part jamais vers le navigateur : il peut
       contenir des informations de compte. Le journal suffit au diagnostic. */
    console.error('refus HubSpot', rep.statut, JSON.stringify(rep.corps).slice(0, 500));
    res.status(502).json({ erreur: 'refus_hubspot' });
  } catch (e) {
    console.error('envoi interrompu', String((e && e.name) || e));
    res.status(502).json({ erreur: 'hubspot_lent' });
  }
};
