#!/usr/bin/env node
/**
 * DRAKAR PROSPECT MAILING — Agent autonome
 * ==========================================
 *
 * Automatise l'envoi de courriers personnalisés à des prospects via La Poste e-poste.
 *
 * Workflow :
 *   1. Import des prospects depuis un CSV
 *   2. Récupération des adresses via l'API Pappers
 *   3. Génération de courriers Word personnalisés
 *   4. Envoi automatisé via La Poste e-poste (Playwright)
 *
 * Usage :
 *   node index.js                     # Exécute tout le workflow
 *   node index.js --step import       # Import des prospects uniquement
 *   node index.js --step addresses    # Récupération des adresses uniquement
 *   node index.js --step letters      # Génération des courriers uniquement
 *   node index.js --step send         # Envoi uniquement
 *   node index.js --dry-run           # Simulation (pas d'envoi réel)
 *
 * Prérequis :
 *   npm install docx playwright
 *   npx playwright install chromium
 *   Configurer les variables d'environnement :
 *     PAPPERS_API_KEY=ta_cle_pappers
 *     LAPOSTE_EMAIL=ton_email@laposte.fr
 *     LAPOSTE_PASSWORD=ton_mot_de_passe
 */

import { loadProspects } from './import-prospects.js';
import { fetchAllAddresses } from './fetch-addresses.js';
import { generateAllLetters } from './generate-letters.js';
import { sendAllLetters } from './send-eposte.js';
import config from './config.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// --- Parsing des arguments CLI ---
const args = process.argv.slice(2);
const stepArg = args.find((_, i) => args[i - 1] === '--step');
const isDryRun = args.includes('--dry-run');
const csvArg = args.find((_, i) => args[i - 1] === '--csv');

if (isDryRun) {
  config.envoi.modeSimulation = true;
}

const PROGRESS_FILE = resolve(config.paths.outputDir, 'progression.json');

// --- Fonctions utilitaires ---

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    try {
      const data = JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
      console.log(`\n📂 Progression précédente trouvée (${data.totalProspects} prospects)`);
      return data.prospects;
    } catch {
      return null;
    }
  }
  return null;
}

function saveProgress(prospects) {
  const stats = {
    a_traiter: 0,
    adresse_trouvee: 0,
    courrier_genere: 0,
    envoye: 0,
    erreur: 0,
  };
  prospects.forEach(p => { stats[p.statut] = (stats[p.statut] || 0) + 1; });

  const data = {
    dateMAJ: new Date().toISOString(),
    totalProspects: prospects.length,
    stats,
    prospects,
  };
  writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function printDashboard(prospects) {
  const stats = {
    a_traiter: 0,
    adresse_trouvee: 0,
    courrier_genere: 0,
    envoye: 0,
    erreur: 0,
  };
  prospects.forEach(p => { stats[p.statut] = (stats[p.statut] || 0) + 1; });

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║     DRAKAR PROSPECT MAILING — SUIVI     ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Total prospects     : ${String(prospects.length).padStart(4)}              ║`);
  console.log(`║  ─────────────────────────────────────── ║`);
  console.log(`║  📋 À traiter        : ${String(stats.a_traiter).padStart(4)}              ║`);
  console.log(`║  📍 Adresse trouvée  : ${String(stats.adresse_trouvee).padStart(4)}              ║`);
  console.log(`║  📝 Courrier généré  : ${String(stats.courrier_genere).padStart(4)}              ║`);
  console.log(`║  ✅ Envoyé           : ${String(stats.envoye).padStart(4)}              ║`);
  console.log(`║  ❌ Erreur           : ${String(stats.erreur).padStart(4)}              ║`);
  console.log('╚══════════════════════════════════════════╝');

  // Lister les erreurs si présentes
  const errors = prospects.filter(p => p.statut === 'erreur');
  if (errors.length > 0) {
    console.log('\n⚠ Prospects en erreur :');
    errors.forEach(p => {
      console.log(`  - ${p.prenom} ${p.nom} (${p.entreprise}) : ${p.erreur}`);
    });
  }
}

// --- Workflow principal ---

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║    DRAKAR EXPERT COMPTABLE               ║');
  console.log('║    Agent Prospect Mailing v1.0           ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Mode : ${config.envoi.modeSimulation ? 'SIMULATION' : '⚡ ENVOI RÉEL'}                       ║`);
  console.log(`║  Date : ${new Date().toLocaleDateString('fr-FR')}                        ║`);
  console.log('╚══════════════════════════════════════════╝');

  // Assurer que le dossier output existe
  mkdirSync(resolve(config.paths.outputDir), { recursive: true });

  let prospects;

  // Charger la progression existante ou importer depuis le CSV
  const existingProgress = loadProgress();

  if (existingProgress && !stepArg) {
    console.log('💡 Reprise depuis la dernière sauvegarde.');
    prospects = existingProgress;
  } else {
    const csvPath = csvArg || config.paths.prospectsCSV;
    console.log(`\n📁 Import du fichier : ${csvPath}`);
    prospects = loadProspects(csvPath);
    saveProgress(prospects);
  }

  if (stepArg === 'import') {
    printDashboard(prospects);
    return;
  }

  // Étape 2 : Récupération des adresses
  const needsAddresses = prospects.some(p => p.statut === 'a_traiter');
  if (needsAddresses && stepArg !== 'letters' && stepArg !== 'send') {
    prospects = await fetchAllAddresses(prospects);
    saveProgress(prospects);
  }

  if (stepArg === 'addresses') {
    printDashboard(prospects);
    return;
  }

  // Étape 3 : Génération des courriers
  const needsLetters = prospects.some(p => p.statut === 'adresse_trouvee');
  if (needsLetters && stepArg !== 'send') {
    prospects = await generateAllLetters(prospects);
    saveProgress(prospects);
  }

  if (stepArg === 'letters') {
    printDashboard(prospects);
    return;
  }

  // Étape 4 : Envoi via La Poste
  const needsSending = prospects.some(p => p.statut === 'courrier_genere');
  if (needsSending) {
    if (!config.laposte.email || !config.laposte.password) {
      console.log('\n⚠ Identifiants La Poste non configurés. Configure LAPOSTE_EMAIL et LAPOSTE_PASSWORD.');
      console.log('  Les courriers Word ont été générés dans le dossier output/.');
      console.log('  Tu peux les envoyer manuellement via https://www.laposte.fr/eposte');
    } else {
      prospects = await sendAllLetters(prospects);
      saveProgress(prospects);
    }
  }

  // Dashboard final
  printDashboard(prospects);
  saveProgress(prospects);

  console.log(`\n✓ Progression sauvegardée dans ${PROGRESS_FILE}`);
  console.log('💡 Pour reprendre : relance "node index.js" — la progression sera reprise automatiquement.');
}

// Gestion des erreurs globales
main().catch(error => {
  console.error('\n💥 Erreur fatale :', error.message);
  console.error(error.stack);
  process.exit(1);
});
