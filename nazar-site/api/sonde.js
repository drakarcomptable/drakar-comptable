/* Sonde d'exploration, TEMPORAIRE, a supprimer des l'exploration finie.
 *
 * Tour en cours : decouvrir le corps attendu par la reservation. On envoie
 * volontairement un corps VIDE, pour que HubSpot reponde par la liste des
 * champs manquants. Rien ne peut etre cree de cette facon.
 *
 * Garde-fous inchanges : aucun parametre n'est lu depuis la requete, le
 * corps est fige dans le fichier, la route ne repond pas sur le domaine
 * public, et le jeton n'est jamais renvoye.
 */

const BOOK = 'https://api.hubapi.com/scheduler/2026-03/meetings/meeting-links/book';

const ESSAIS = [
  ['corps vide', BOOK, {}],
  ['corps vide, avec fuseau', BOOK + '?timezone=Europe%2FParis', {}],
  ['slug seul', BOOK + '?timezone=Europe%2FParis', { slug: 'mael-gallais/auditnazargeo' }],
];

module.exports = async function (req, res) {
  const hote = String(req.headers.host || '');
  if (!hote.endsWith('.vercel.app')) { res.status(404).json({ erreur: 'introuvable' }); return; }
  if (req.method !== 'GET') { res.status(405).json({ erreur: 'methode non autorisee' }); return; }

  const jeton = process.env.HUBSPOT_TOKEN;
  if (!jeton) { res.status(500).json({ erreur: 'HUBSPOT_TOKEN absent' }); return; }

  const sorties = [];
  for (const [nom, url, corpsEnvoye] of ESSAIS) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + jeton,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(corpsEnvoye)
      });
      const texte = await r.text();
      let corps;
      try { corps = JSON.parse(texte); } catch (e) { corps = texte.slice(0, 2500); }
      sorties.push({ nom, url, envoye: corpsEnvoye, statut: r.status, corps });
    } catch (e) {
      sorties.push({ nom, url, erreur_reseau: String((e && e.message) || e) });
    }
  }
  res.status(200).json({ essais: sorties });
};
