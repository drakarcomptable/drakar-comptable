/**
 * Module d'automatisation de l'envoi via La Poste e-poste
 * Utilise Playwright pour automatiser le navigateur
 *
 * npm install playwright
 * npx playwright install chromium
 *
 * IMPORTANT : Ce module interagit avec le site La Poste.
 * Assure-toi de respecter les CGU du service.
 */
import { chromium } from 'playwright';
import { resolve } from 'path';
import config from './config.js';

/**
 * Crée une session navigateur et se connecte à e-poste
 * @returns {Object} { browser, page, context }
 */
export async function initSession() {
  console.log('\n🌐 Lancement du navigateur...');

  const browser = await chromium.launch({
    headless: false, // Visible pour vérifier le déroulement
    slowMo: 500, // Ralentir les actions pour la fiabilité
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'fr-FR',
  });

  const page = await context.newPage();

  // Connexion au compte La Poste
  await login(page);

  return { browser, page, context };
}

/**
 * Se connecte au compte La Poste
 */
async function login(page) {
  console.log('🔑 Connexion au compte La Poste...');

  await page.goto(config.laposte.url, { waitUntil: 'networkidle' });

  // Accepter les cookies si le bandeau apparaît
  try {
    const cookieBtn = page.locator('button:has-text("Accepter"), #didomi-notice-agree-button');
    await cookieBtn.click({ timeout: 5000 });
  } catch {
    // Pas de bandeau cookies, on continue
  }

  // Cliquer sur "Se connecter" / "Mon compte"
  try {
    const loginLink = page.locator('a:has-text("Se connecter"), a:has-text("Mon compte"), button:has-text("Se connecter")');
    await loginLink.first().click({ timeout: 5000 });
  } catch {
    console.log('  Bouton de connexion non trouvé, peut-être déjà sur la page de login');
  }

  // Remplir les identifiants
  await page.waitForSelector('input[type="email"], input[name="email"], #email', { timeout: 15000 });

  await page.fill('input[type="email"], input[name="email"], #email', config.laposte.email);
  await page.fill('input[type="password"], input[name="password"], #password', config.laposte.password);

  // Soumettre le formulaire
  await page.click('button[type="submit"], input[type="submit"]');

  // Attendre la redirection post-login
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });

  console.log('✓ Connecté à La Poste e-poste');
}

/**
 * Envoie un courrier pour un prospect donné
 * @param {Object} page - Page Playwright
 * @param {Object} prospect - Données du prospect
 * @returns {boolean} true si envoi réussi
 */
export async function sendLetter(page, prospect) {
  const { prenom, nom, entreprise, adresse, fichierCourrier } = prospect;
  console.log(`\n📮 Envoi du courrier pour ${prenom} ${nom} (${entreprise})...`);

  if (!fichierCourrier) {
    throw new Error('Aucun fichier courrier généré pour ce prospect');
  }
  if (!adresse) {
    throw new Error('Aucune adresse disponible pour ce prospect');
  }

  try {
    // Étape 1 : Naviguer vers "Envoyer un courrier"
    await page.goto(`${config.laposte.url}/envoi`, { waitUntil: 'networkidle' });

    // Étape 2 : Upload du document Word
    console.log('  📄 Upload du document...');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(resolve(fichierCourrier));

    // Attendre le traitement du document
    await page.waitForTimeout(5000); // Attente du traitement serveur

    // Étape 3 : Cliquer sur suivant/continuer après upload
    const nextBtn = page.locator('button:has-text("Suivant"), button:has-text("Continuer"), button:has-text("Valider")');
    await nextBtn.first().click({ timeout: 10000 });

    // Étape 4 : Remplir l'adresse du destinataire
    console.log('  📍 Saisie de l\'adresse destinataire...');
    await page.waitForTimeout(2000);

    // Remplir les champs d'adresse (les sélecteurs peuvent varier)
    await fillField(page, 'nom', `${prenom} ${nom}`);
    await fillField(page, 'entreprise', entreprise);
    await fillField(page, 'adresse', adresse.adresseLigne1);
    if (adresse.adresseLigne2) {
      await fillField(page, 'adresse2', adresse.adresseLigne2);
    }
    await fillField(page, 'code_postal', adresse.codePostal);
    await fillField(page, 'ville', adresse.ville);

    // Étape 5 : Remplir l'adresse de l'expéditeur
    console.log('  📍 Saisie de l\'adresse expéditeur...');
    const exp = config.expediteur;
    await fillField(page, 'exp_nom', exp.nom);
    await fillField(page, 'exp_adresse', exp.adresse);
    await fillField(page, 'exp_code_postal', exp.codePostal);
    await fillField(page, 'exp_ville', exp.ville);

    // Étape 6 : Valider et passer au paiement
    console.log('  💳 Validation...');
    const validateBtn = page.locator('button:has-text("Valider"), button:has-text("Suivant"), button:has-text("Envoyer")');
    await validateBtn.first().click({ timeout: 10000 });

    // Mode simulation : ne pas finaliser le paiement
    if (config.envoi.modeSimulation) {
      console.log('  ⚡ MODE SIMULATION — Paiement non finalisé');
      await page.waitForTimeout(2000);
      // Prendre un screenshot pour preuve
      const screenshotPath = resolve(config.paths.outputDir, `screenshot_${sanitize(nom)}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  📸 Screenshot sauvegardé : ${screenshotPath}`);
      return true;
    }

    // Mode réel : finaliser le paiement
    // ATTENTION : Ceci va déclencher un paiement réel
    console.log('  💳 Finalisation du paiement...');
    const payBtn = page.locator('button:has-text("Payer"), button:has-text("Confirmer")');
    await payBtn.first().click({ timeout: 15000 });

    // Attendre la confirmation
    await page.waitForSelector('text=confirmation, text=envoyé, text=succès', {
      timeout: 30000,
    });

    console.log(`✓ Courrier envoyé pour ${prenom} ${nom}`);
    return true;
  } catch (error) {
    console.error(`✗ Erreur d'envoi pour ${prenom} ${nom} : ${error.message}`);
    // Screenshot d'erreur
    try {
      const errorScreenshot = resolve(config.paths.outputDir, `erreur_${sanitize(nom)}.png`);
      await page.screenshot({ path: errorScreenshot, fullPage: true });
    } catch { /* ignore */ }
    throw error;
  }
}

/**
 * Envoie les courriers pour tous les prospects prêts
 */
export async function sendAllLetters(prospects) {
  const readyProspects = prospects.filter(p => p.statut === 'courrier_genere' && p.fichierCourrier);

  if (readyProspects.length === 0) {
    console.log('⚠ Aucun courrier prêt à envoyer.');
    return prospects;
  }

  console.log(`\n📮 ${readyProspects.length} courriers à envoyer...`);

  // Limiter le nombre d'envois par session
  const batch = readyProspects.slice(0, config.envoi.maxEnvoisParSession);
  if (batch.length < readyProspects.length) {
    console.log(`  ⚠ Limité à ${config.envoi.maxEnvoisParSession} envois par session. ${readyProspects.length - batch.length} restants.`);
  }

  const { browser, page } = await initSession();

  let sent = 0;
  let errors = 0;

  try {
    for (let i = 0; i < batch.length; i++) {
      const prospect = batch[i];

      try {
        await sendLetter(page, prospect);
        prospect.statut = 'envoye';
        prospect.dateEnvoi = new Date().toISOString();
        sent++;
      } catch (error) {
        prospect.statut = 'erreur';
        prospect.erreur = `Envoi échoué : ${error.message}`;
        errors++;
      }

      // Délai entre les envois
      if (i < batch.length - 1) {
        console.log(`  ⏳ Attente de ${config.envoi.delaiEntreEnvois / 1000}s avant le prochain envoi...`);
        await new Promise(r => setTimeout(r, config.envoi.delaiEntreEnvois));
      }

      // Afficher la progression
      console.log(`  📊 Progression : ${i + 1}/${batch.length} (${sent} envoyés, ${errors} erreurs)`);
    }
  } finally {
    await browser.close();
    console.log('🌐 Navigateur fermé.');
  }

  console.log(`\n✓ Session terminée : ${sent} envoyés, ${errors} erreurs`);
  return prospects;
}

// --- Helpers ---

/**
 * Remplit un champ de formulaire en essayant plusieurs sélecteurs possibles
 */
async function fillField(page, fieldName, value) {
  if (!value) return;

  const selectors = [
    `input[name="${fieldName}"]`,
    `input[id="${fieldName}"]`,
    `input[placeholder*="${fieldName}" i]`,
    `input[aria-label*="${fieldName}" i]`,
  ];

  for (const selector of selectors) {
    try {
      const field = page.locator(selector);
      if (await field.count() > 0) {
        await field.first().fill(value);
        return;
      }
    } catch { /* try next */ }
  }

  console.warn(`  ⚠ Champ "${fieldName}" non trouvé pour la valeur "${value}"`);
}

function sanitize(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}
