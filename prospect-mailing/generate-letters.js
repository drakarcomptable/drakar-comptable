/**
 * Module de génération de courriers Word personnalisés
 * Utilise la librairie `docx` pour créer des fichiers .docx
 *
 * npm install docx
 */
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  HeadingLevel, BorderStyle, Tab, TabStopType, TabStopPosition,
} from 'docx';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import config from './config.js';

// Descriptions des services Drakar pour personnalisation
const SERVICES_DESCRIPTIONS = {
  'expertise comptable': 'l\'accompagnement en expertise comptable, incluant la tenue de comptabilité, la révision comptable et l\'établissement de vos bilans',
  'fiscalite': 'l\'optimisation et la souveraineté fiscale, avec la gestion de vos déclarations, TVA, IS et stratégies de holding',
  'social': 'la gestion sociale et le droit du travail, incluant les bulletins de paie, les déclarations sociales et le conseil en droit du travail',
  'juridique': 'l\'accompagnement juridique de votre société, de la création aux assemblées générales en passant par les modifications statutaires',
  'conseil financier': 'le conseil financier et le pilotage de votre activité, avec des tableaux de bord sur mesure et des prévisionnels budgétaires',
};

/**
 * Génère un courrier Word personnalisé pour un prospect
 * @param {Object} prospect - Données du prospect (nom, prenom, entreprise, adresse, mots_cles_services)
 * @param {Object} options - Options de personnalisation
 * @returns {string} Chemin du fichier généré
 */
export async function generateLetter(prospect, options = {}) {
  const exp = config.expediteur;
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Construire la description des services pertinents
  const servicesText = buildServicesText(prospect.mots_cles_services);

  // Adresse du destinataire
  const adresseDestinataire = prospect.adresse
    ? [
        `${prospect.prenom} ${prospect.nom}`,
        prospect.poste || 'Dirigeant',
        prospect.adresse.nomComplet || prospect.entreprise,
        prospect.adresse.adresseLigne1,
        prospect.adresse.adresseLigne2,
        `${prospect.adresse.codePostal} ${prospect.adresse.ville}`,
      ].filter(Boolean)
    : [`${prospect.prenom} ${prospect.nom}`, prospect.entreprise];

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // ~2cm
        },
      },
      children: [
        // En-tête expéditeur
        new Paragraph({
          children: [
            new TextRun({ text: exp.nom, bold: true, size: 22, font: 'Calibri' }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.adresse, size: 20, font: 'Calibri' })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `${exp.codePostal} ${exp.ville}`, size: 20, font: 'Calibri' })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Tél : ${exp.telephone}`, size: 20, font: 'Calibri' })],
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.email, size: 20, font: 'Calibri' })],
        }),

        // Espace
        new Paragraph({ children: [] }),
        new Paragraph({ children: [] }),

        // Destinataire (aligné à droite)
        ...adresseDestinataire.map(line =>
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: line, size: 20, font: 'Calibri' })],
          })
        ),

        // Espace + date
        new Paragraph({ children: [] }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `Paris, le ${dateStr}`, size: 20, font: 'Calibri', italics: true })],
        }),

        // Espace
        new Paragraph({ children: [] }),
        new Paragraph({ children: [] }),

        // Objet
        new Paragraph({
          children: [
            new TextRun({ text: 'Objet : ', bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: 'Proposition d\'accompagnement comptable et financier', size: 20, font: 'Calibri' }),
          ],
        }),

        // Espace
        new Paragraph({ children: [] }),

        // Corps de la lettre
        new Paragraph({
          children: [
            new TextRun({
              text: `${getCivilite(prospect)} ${prospect.nom},`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        new Paragraph({ children: [] }),

        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `En ma qualité de dirigeant du cabinet ${exp.nom}, je me permets de vous adresser ce courrier afin de vous présenter nos services d'expertise comptable et de conseil aux entreprises.`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `Ayant pris connaissance de l'activité de ${prospect.entreprise}, et conscient des enjeux auxquels font face les dirigeants d'entreprise comme vous, je souhaitais vous faire part de notre expertise en matière ${servicesText}.`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'Notre cabinet accompagne les entrepreneurs et PME dans la gestion rigoureuse de leur comptabilité, l\'optimisation de leur fiscalité et le pilotage stratégique de leur activité. Nous mettons un point d\'honneur à offrir un service personnalisé, réactif et en phase avec les exigences réglementaires actuelles.',
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'Parmi nos atouts, vous trouverez :',
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        // Points forts
        ...buildBulletPoints([
          'Un espace digital sécurisé pour le suivi de vos dossiers en temps réel',
          'Un interlocuteur dédié, disponible et à l\'écoute de vos besoins',
          'Une expertise reconnue en fiscalité, social et droit des sociétés',
          'Des tableaux de bord sur mesure pour piloter votre activité',
        ]),

        new Paragraph({ children: [] }),

        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `Je serais ravi de pouvoir échanger avec vous lors d'un entretien, à votre convenance, afin de vous présenter plus en détail nos solutions et d'évaluer ensemble comment ${exp.nom} pourrait vous accompagner dans le développement de ${prospect.entreprise}.`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `N'hésitez pas à me contacter au ${exp.telephone} ou par email à ${exp.email} pour convenir d'un rendez-vous.`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        new Paragraph({ children: [] }),

        new Paragraph({
          children: [
            new TextRun({
              text: 'Dans l\'attente de votre retour, je vous prie d\'agréer, ' +
                `${getCivilite(prospect)} ${prospect.nom}, ` +
                'l\'expression de mes salutations distinguées.',
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),

        // Espace + signature
        new Paragraph({ children: [] }),
        new Paragraph({ children: [] }),

        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: exp.nom, bold: true, size: 20, font: 'Calibri' }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: exp.siteWeb, size: 18, font: 'Calibri', color: '0066CC' }),
          ],
        }),
      ],
    }],
  });

  // Générer le fichier
  const fileName = `courrier_${sanitizeFilename(prospect.nom)}_${sanitizeFilename(prospect.entreprise)}.docx`;
  const outputPath = join(config.paths.outputDir, fileName);
  const fullPath = resolve(outputPath);

  const buffer = await Packer.toBuffer(doc);
  writeFileSync(fullPath, buffer);

  console.log(`✓ Courrier généré : ${fileName}`);
  return fullPath;
}

/**
 * Génère les courriers pour tous les prospects ayant une adresse
 */
export async function generateAllLetters(prospects) {
  console.log(`\n📝 Génération des courriers...`);
  let generated = 0;
  let errors = 0;

  for (const prospect of prospects) {
    if (prospect.statut === 'erreur' || !prospect.adresse) {
      continue;
    }

    try {
      const filePath = await generateLetter(prospect);
      prospect.fichierCourrier = filePath;
      prospect.statut = 'courrier_genere';
      generated++;
    } catch (error) {
      prospect.statut = 'erreur';
      prospect.erreur = `Erreur génération courrier : ${error.message}`;
      errors++;
      console.error(`✗ Erreur pour ${prospect.nom} : ${error.message}`);
    }
  }

  console.log(`✓ ${generated} courriers générés (${errors} erreurs)`);
  return prospects;
}

// --- Helpers ---

function buildServicesText(motsCles) {
  if (!motsCles || motsCles.length === 0) {
    return 'd\'expertise comptable et de conseil financier';
  }

  const descriptions = motsCles
    .map(mc => SERVICES_DESCRIPTIONS[mc.toLowerCase()])
    .filter(Boolean);

  if (descriptions.length === 0) {
    return 'd\'expertise comptable et de conseil financier';
  }
  if (descriptions.length === 1) {
    return `de ${descriptions[0]}`;
  }
  const last = descriptions.pop();
  return `de ${descriptions.join(', ')} ainsi que ${last}`;
}

function getCivilite(prospect) {
  // Par défaut "Monsieur" — à adapter selon les données disponibles
  return prospect.civilite || 'Monsieur';
}

function sanitizeFilename(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

function buildBulletPoints(points) {
  return points.map(text =>
    new Paragraph({
      spacing: { after: 60 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: '• ', size: 20, font: 'Calibri' }),
        new TextRun({ text, size: 20, font: 'Calibri' }),
      ],
    })
  );
}
