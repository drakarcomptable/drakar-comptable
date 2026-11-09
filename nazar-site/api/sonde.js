/* Route d'exploration, TEMPORAIRE, a supprimer des l'exploration finie.
 *
 * Elle existe parce que l'environnement de la session de developpement ne
 * peut pas joindre api.hubapi.com : il faut donc un point d'observation
 * execute depuis Vercel pour decouvrir la forme reelle des reponses.
 *
 * Trois garde-fous, parce qu'une route qui relaie une API authentifiee est
 * par nature une fuite potentielle :
 *   1. aucun parametre n'est lu depuis la requete. La liste des appels est
 *      figee ci-dessous ; pour en essayer d'autres, on modifie ce fichier.
 *   2. methode GET seulement.
 *   3. elle ne repond pas sur le domaine public. Seuls les hotes de
 *      deploiement Vercel, proteges par l'authentification du compte,
 *      obtiennent une reponse.
 * Le jeton n'est jamais renvoye.
 */

const APPELS = [
  ['liste des liens de rendez-vous',
   'https://api.hubapi.com/scheduler/2026-03/meetings/meeting-links'],
  ['liste, version v3',
   'https://api.hubapi.com/scheduler/v3/meetings/meeting-links'],
];

module.exports = async function (req, res) {
  const hote = String(req.headers.host || '');
  if (!hote.endsWith('.vercel.app')) {
    res.status(404).json({ erreur: 'introuvable' });
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ erreur: 'methode non autorisee' });
    return;
  }

  const jeton = process.env.HUBSPOT_TOKEN;
  if (!jeton) {
    res.status(500).json({ erreur: 'HUBSPOT_TOKEN absent de cet environnement' });
    return;
  }

  const sorties = [];
  for (const [nom, url] of APPELS) {
    try {
      const r = await fetch(url, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + jeton, Accept: 'application/json' }
      });
      const texte = await r.text();
      let corps;
      try { corps = JSON.parse(texte); } catch (e) { corps = texte.slice(0, 3000); }
      sorties.push({ nom, url, statut: r.status, corps });
    } catch (e) {
      sorties.push({ nom, url, erreur_reseau: String((e && e.message) || e) });
    }
  }
  res.status(200).json({ appels: sorties });
};
