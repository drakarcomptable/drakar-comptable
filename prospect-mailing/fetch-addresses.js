/**
 * Module de récupération des adresses d'entreprise via l'API Pappers
 * https://www.pappers.fr/api/documentation
 *
 * Gratuit : 100 requêtes/mois
 * L'API retourne les données du Registre National des Entreprises (RNE)
 */
import config from './config.js';

const PAPPERS_BASE = config.pappers.baseUrl;

/**
 * Recherche une entreprise par nom et retourne son adresse de domiciliation
 * @param {string} nomEntreprise - Nom de l'entreprise à chercher
 * @returns {Object|null} Adresse trouvée ou null
 */
export async function fetchAdresseEntreprise(nomEntreprise) {
  const apiKey = config.pappers.apiKey;
  if (!apiKey) {
    throw new Error('Clé API Pappers manquante. Configure PAPPERS_API_KEY dans les variables d\'environnement.');
  }

  try {
    // Étape 1 : Rechercher l'entreprise par nom
    const searchUrl = `${PAPPERS_BASE}/recherche?api_token=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(nomEntreprise)}&par_page=1`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      if (searchResponse.status === 429) {
        throw new Error('Quota API Pappers atteint (100 requêtes/mois). Réessaie le mois prochain ou passe en plan payant.');
      }
      throw new Error(`Erreur API Pappers : ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.resultats || searchData.resultats.length === 0) {
      console.warn(`⚠ Aucune entreprise trouvée pour "${nomEntreprise}"`);
      return null;
    }

    const entreprise = searchData.resultats[0];

    // Extraire l'adresse du siège social
    const adresse = {
      siren: entreprise.siren || '',
      siret: entreprise.siege?.siret || '',
      nomComplet: entreprise.nom_entreprise || nomEntreprise,
      adresseLigne1: entreprise.siege?.adresse_ligne_1 || '',
      adresseLigne2: entreprise.siege?.adresse_ligne_2 || '',
      codePostal: entreprise.siege?.code_postal || '',
      ville: entreprise.siege?.ville || '',
      pays: entreprise.siege?.pays || 'France',
      // Adresse formatée pour le courrier
      adresseComplete: formatAdresse(entreprise.siege),
    };

    console.log(`✓ Adresse trouvée pour "${nomEntreprise}" : ${adresse.adresseComplete}`);
    return adresse;
  } catch (error) {
    console.error(`✗ Erreur pour "${nomEntreprise}" : ${error.message}`);
    throw error;
  }
}

/**
 * Formate une adresse de siège en string lisible
 */
function formatAdresse(siege) {
  if (!siege) return '';
  const parts = [
    siege.adresse_ligne_1,
    siege.adresse_ligne_2,
    `${siege.code_postal || ''} ${siege.ville || ''}`.trim(),
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Récupère les adresses pour une liste de prospects
 * Respecte un délai entre chaque requête pour ne pas surcharger l'API
 * @param {Array} prospects - Liste des prospects
 * @param {number} delaiMs - Délai entre chaque requête (ms)
 * @returns {Array} Prospects enrichis avec les adresses
 */
export async function fetchAllAddresses(prospects, delaiMs = 1000) {
  console.log(`\n📬 Récupération des adresses pour ${prospects.length} prospects...`);
  let found = 0;
  let errors = 0;

  for (let i = 0; i < prospects.length; i++) {
    const prospect = prospects[i];

    // Skip si déjà traité
    if (prospect.adresse && prospect.statut !== 'a_traiter') {
      found++;
      continue;
    }

    try {
      const adresse = await fetchAdresseEntreprise(prospect.entreprise);
      if (adresse) {
        prospect.adresse = adresse;
        prospect.statut = 'adresse_trouvee';
        found++;
      } else {
        prospect.statut = 'erreur';
        prospect.erreur = 'Adresse non trouvée';
        errors++;
      }
    } catch (error) {
      prospect.statut = 'erreur';
      prospect.erreur = error.message;
      errors++;
    }

    // Afficher la progression
    const progress = Math.round(((i + 1) / prospects.length) * 100);
    process.stdout.write(`\r  Progression : ${progress}% (${i + 1}/${prospects.length})`);

    // Respecter le rate limit
    if (i < prospects.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delaiMs));
    }
  }

  console.log(`\n✓ Adresses récupérées : ${found}/${prospects.length} (${errors} erreurs)`);
  return prospects;
}
