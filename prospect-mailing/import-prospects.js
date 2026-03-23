/**
 * Module d'import des prospects depuis un fichier CSV
 * Usage: import { loadProspects } from './import-prospects.js'
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Parse un fichier CSV et retourne un tableau d'objets prospects
 * @param {string} csvPath - Chemin vers le fichier CSV
 * @returns {Array<Object>} Liste des prospects
 */
export function loadProspects(csvPath) {
  const fullPath = resolve(csvPath);
  const content = readFileSync(fullPath, 'utf-8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('Le fichier CSV doit contenir un en-tête et au moins une ligne de données.');
  }

  const headers = parseCSVLine(lines[0]);
  const requiredHeaders = ['prenom', 'nom', 'entreprise'];
  for (const required of requiredHeaders) {
    if (!headers.includes(required)) {
      throw new Error(`Colonne obligatoire manquante : "${required}". Colonnes trouvées : ${headers.join(', ')}`);
    }
  }

  const prospects = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const prospect = {};
    headers.forEach((header, index) => {
      prospect[header.trim()] = (values[index] || '').trim();
    });

    // Validation minimale
    if (!prospect.prenom || !prospect.nom || !prospect.entreprise) {
      console.warn(`⚠ Ligne ${i + 1} ignorée : données incomplètes (prenom/nom/entreprise requis)`);
      continue;
    }

    // Parse des mots-clés services en tableau
    if (prospect.mots_cles_services) {
      prospect.mots_cles_services = prospect.mots_cles_services.split(',').map(s => s.trim());
    } else {
      prospect.mots_cles_services = [];
    }

    // Ajouter un statut de suivi
    prospect.statut = 'a_traiter';
    prospect.adresse = null;
    prospect.fichierCourrier = null;
    prospect.dateEnvoi = null;
    prospect.erreur = null;

    prospects.push(prospect);
  }

  console.log(`✓ ${prospects.length} prospects chargés depuis ${csvPath}`);
  return prospects;
}

/**
 * Parse une ligne CSV en gérant les guillemets et virgules dans les valeurs
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Sauvegarde l'état des prospects dans un fichier JSON de suivi
 */
export async function saveProgress(prospects, outputPath) {
  const { writeFileSync } = await import('node:fs');

  const data = {
    dateGeneration: new Date().toISOString(),
    totalProspects: prospects.length,
    stats: {
      a_traiter: prospects.filter(p => p.statut === 'a_traiter').length,
      adresse_trouvee: prospects.filter(p => p.statut === 'adresse_trouvee').length,
      courrier_genere: prospects.filter(p => p.statut === 'courrier_genere').length,
      envoye: prospects.filter(p => p.statut === 'envoye').length,
      erreur: prospects.filter(p => p.statut === 'erreur').length,
    },
    prospects,
  };
  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ Progression sauvegardée dans ${outputPath}`);
}
