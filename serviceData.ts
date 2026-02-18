
import { ServiceContent } from './types';

export const DEFAULT_CONTENT: ServiceContent = {
  introduction: "Drakar accompagne les entreprises dans la sécurisation de leurs processus et l'optimisation de leur gestion par une approche souveraine et précise.",
  mission: [
    "Analyse exhaustive des besoins et du contexte réglementaire",
    "Mise en place d'outils de suivi et de reporting Drakar",
    "Contrôle de conformité et validation des données",
    "Accompagnement conseil et suivi périodique"
  ],
  methodology: "Notre approche repose sur une phase de diagnostic initial, suivie d'une intégration fluide garantissant une intégrité totale des données.",
  importance: "La maîtrise de ce volet permet de sécuriser la croissance de l'entreprise et de disposer d'indicateurs fiables pour la prise de décision stratégique.",
  target: "Ce service s'adresse aux dirigeants de PME et responsables financiers en quête d'une expertise souveraine.",
  faq: [
    {
      question: "Quels sont les délais de mise en œuvre ?",
      answer: "L'activation du service s'effectue généralement sous 48 à 72 heures après validation de la lettre de mission."
    },
    {
      question: "Comment sont transmis les documents ?",
      answer: "L'ensemble des échanges s'effectue via notre plateforme sécurisée Drakar, accessible 24h/24."
    }
  ]
};

export const SERVICES_CONTENT: Record<string, ServiceContent> = {
  'expertise-comptable': {
    introduction: "Le pôle Expertise Comptable Drakar est le moteur de votre pilotage financier. Nous transformons vos chiffres en leviers de performance souverains.",
    mission: [
      "Supervision intégrale de la comptabilité générale",
      "Élaboration des comptes annuels et liasses fiscales",
      "Mise en place de tableaux de bord financiers",
      "Accompagnement dans les choix de gestion critiques"
    ],
    methodology: "Nous fusionnons l'excellence technique avec les outils les plus performants pour garantir une intégrité absolue de votre information financière.",
    importance: "Une comptabilité structurée est le socle de toute entreprise pérenne. Elle sécurise vos décisions d'investissement et rassure vos partenaires.",
    target: "PME et dirigeants souhaitant un partenaire financier de haut niveau.",
    faq: [
      { question: "Proposez-vous un accès en temps réel ?", answer: "Oui, notre interface Drakar vous permet de consulter vos indicateurs à tout moment." },
      { question: "Changez-vous souvent d'interlocuteur ?", answer: "Non, nous attribuons un collaborateur dédié pour une connaissance parfaite de votre dossier." }
    ]
  }
};

export const getServiceContent = (slug: string): ServiceContent => {
  return SERVICES_CONTENT[slug] || DEFAULT_CONTENT;
};
