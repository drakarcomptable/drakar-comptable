/* La reservation d'un creneau, envoyee a HubSpot.
 *
 * Le visiteur choisit son jour, son heure et laisse ses coordonnees sur notre
 * page : la reservation se termine donc chez nous, et non plus sur la page de
 * HubSpot. Cela nous rend deux choses que l'iframe avait emportees : la
 * mesure de la conversion, et la maitrise du parcours.
 *
 * Champs exiges par HubSpot, releves sur sa propre reponse de validation :
 * slug, startTime, duration, firstName, lastName, email. Le telephone et la
 * question libre viennent de la configuration du lien.
 */

const LIEN   = 'mael-gallais/auditnazargeo';
const FUSEAU = 'Europe/Paris';
const BOOK   = 'https://api.hubapi.com/scheduler/2026-03/meetings/meeting-links/book';
const INFO   = 'https://api.hubapi.com/scheduler/2026-03/meetings/meeting-links/book/'
             + encodeURIComponent(LIEN) + '?timezone=' + encodeURIComponent(FUSEAU);

const QUESTION = "Avez-vous un projet en cours ? Si oui, pouvez-vous m'en dire un peu plus ?";

function texte(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
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

  /* On revalide le creneau contre l'agenda avant d'envoyer : entre l'affichage
     et le clic, quelqu'un d'autre a pu le prendre, et cela evite aussi qu'une
     requete fabriquee a la main reserve n'importe quelle heure. */
  let duree = 1800000;
  try {
    const r = await fetch(INFO, { headers: { Authorization: 'Bearer ' + jeton, Accept: 'application/json' } });
    if (!r.ok) { res.status(502).json({ erreur: 'agenda indisponible' }); return; }
    const info = await r.json();
    const reg = (info && info.customParams) || {};
    duree = (reg.durations && reg.durations[0]) || duree;
    const parDuree = (info.linkAvailability && info.linkAvailability.linkAvailabilityByDuration) || {};
    const bloc = parDuree[String(duree)] || parDuree[Object.keys(parDuree)[0]] || {};
    const libres = bloc.availabilities || [];
    if (!libres.some(function (c) { return c.startMillisUtc === debut; })) {
      res.status(409).json({ erreur: 'creneau_pris' });
      return;
    }
  } catch (e) {
    res.status(502).json({ erreur: 'agenda injoignable' });
    return;
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

  /* Le telephone est un champ de formulaire du lien, pas un champ racine.
     Envoye a la racine, HubSpot repond :
       "required form field phone does not have a corresponding value"
     La forme exacte de la structure n'est pas documentee. On essaie les deux
     plausibles, l'une apres l'autre : un refus ne cree rien, seul un succes
     reserve, donc la seule consequence d'une mauvaise forme est un aller-
     retour de plus. Une fois la bonne connue, il n'en restera qu'une. */
  const champs = [['phone', tel]];
  if (mot) champs.push([QUESTION, mot]);

  const FORMES = [
    ['liste', Object.assign({}, base, {
      formFields: champs.map(function (c) { return { name: c[0], value: c[1] }; })
    })],
    ['objet', Object.assign({}, base, {
      formFields: champs.reduce(function (o, c) { o[c[0]] = c[1]; return o; }, {})
    })]
  ];

  async function envoie(charge) {
    const r = await fetch(BOOK + '?timezone=' + encodeURIComponent(FUSEAU), {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + jeton,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(charge)
    });
    const brut = await r.text();
    let corps;
    try { corps = JSON.parse(brut); } catch (e) { corps = brut.slice(0, 800); }
    return { statut: r.status, corps: corps };
  }

  try {
    for (const [nom_forme, charge] of FORMES) {
      const rep = await envoie(charge);
      if (rep.statut < 400) {
        res.status(200).json({ ok: true, dureeMinutes: Math.round(duree / 60000) });
        return;
      }
      /* On ne renvoie jamais le detail de HubSpot au navigateur : il peut
         contenir des informations de compte. Le journal suffit. */
      console.error('reservation refusee, forme ' + nom_forme, rep.statut,
                    JSON.stringify(rep.corps).slice(0, 500));
    }
    res.status(502).json({ erreur: 'refus_hubspot' });
  } catch (e) {
    res.status(502).json({ erreur: 'envoi_impossible' });
  }
};
