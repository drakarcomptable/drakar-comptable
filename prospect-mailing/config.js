/**
 * Configuration du module prospect-mailing
 * Renseigne tes clés API et paramètres ici.
 */
export default {
  // API Pappers (https://www.pappers.fr/api) — gratuit jusqu'à 100 requêtes/mois
  pappers: {
    apiKey: process.env.PAPPERS_API_KEY || '',
    baseUrl: 'https://api.pappers.fr/v2',
  },

  // Compte La Poste e-poste
  laposte: {
    email: process.env.LAPOSTE_EMAIL || '',
    password: process.env.LAPOSTE_PASSWORD || '',
    url: 'https://www.laposte.fr/eposte',
  },

  // Expéditeur (ton cabinet)
  expediteur: {
    nom: 'DRAKAR EXPERT COMPTABLE',
    adresse: '10 Rue de Penthièvre',
    codePostal: '75008',
    ville: 'Paris',
    telephone: '06 11 01 25 59',
    email: 'contact@drakarexpertcomptable.fr',
    siteWeb: 'https://www.drakarexpertcomptable.fr',
  },

  // Chemins fichiers
  paths: {
    prospectsCSV: './data/prospects-template.csv',
    outputDir: './output',
    templatesDir: './templates',
  },

  // Options d'envoi
  envoi: {
    // Délai entre chaque envoi (ms) pour éviter la détection
    delaiEntreEnvois: 30000, // 30 secondes
    // Mode simulation (ne soumet pas réellement)
    modeSimulation: true,
    // Nombre max d'envois par session
    maxEnvoisParSession: 10,
  },
};
