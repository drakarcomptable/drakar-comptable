
import { RegionData, Agency } from '../types';

export const REGIONS_DATA: RegionData[] = [
  {
    name: "Normandie",
    cities: ["Caen", "Rouen"]
  }
];

// Helper to generate a clean slug from a city name
export const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Flatten data for easy searching
export const ALL_AGENCIES: Agency[] = REGIONS_DATA.flatMap(region =>
  region.cities.map(city => ({
    name: city,
    slug: `expert-comptable-${slugify(city)}`,
    region: region.name
  }))
);

// Helper to find agency by slug
export const getAgencyBySlug = (slug: string) => {
  return ALL_AGENCIES.find(a => a.slug === slug || `cabinet-expert-comptable-${slugify(a.name)}` === slug);
};

// Contenu SEO détaillé pour chaque agence
export interface AgencyContent {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  whyChooseUs: {
    intro: string;
    points: { title: string; description: string }[];
  };
  missions: {
    title: string;
    description: string;
  }[];
  clientele: {
    intro: string;
    types: string[];
    outro: string;
  };
  localSection: {
    title: string;
    description: string;
  };
  faq: {
    question: string;
    answer: string;
  }[];
  ctaTitle: string;
  ctaDescription: string;
}

export const AGENCY_CONTENT: Record<string, AgencyContent> = {
  "expert-comptable-caen": {
    metaTitle: "Expert-comptable à Caen | Cabinet Drakar",
    metaDescription: "Cabinet d'expert-comptable à Caen. Accompagnement personnalisé des entrepreneurs, TPE et PME du Calvados et de Normandie.",
    heroTitle: "Votre cabinet d'expert-comptable à Caen",
    heroSubtitle: "Vous êtes à la recherche d'un expert-comptable à Caen pour accompagner votre entreprise au quotidien ? Le cabinet Drakar Expert Comptable, membre de l'Ordre des experts-comptables, propose un accompagnement personnalisé aux entrepreneurs, TPE et PME du Calvados et de Normandie. De la création de votre structure à la gestion comptable, fiscale et sociale de votre activité, nous sommes à vos côtés à chaque étape.",
    whyChooseUs: {
      intro: "Faire appel à un cabinet comptable de proximité, c'est bénéficier d'un interlocuteur qui connaît le tissu économique normand et qui s'engage à vos côtés de façon durable. Voici ce qui nous distingue :",
      points: [
        {
          title: "Un accompagnement sur mesure",
          description: "Auto-entrepreneur, profession libérale, artisan, commerçant ou dirigeant de PME. Nous adaptons nos missions à la réalité de votre activité."
        },
        {
          title: "Une expertise pluridisciplinaire",
          description: "Comptabilité, fiscalité, droit social, juridique, conseil en gestion. Nous couvrons l'ensemble des domaines clés de votre entreprise."
        },
        {
          title: "Proximité et réactivité",
          description: "Basés à Caen, nous sommes disponibles pour répondre rapidement à vos questions et vous conseiller au moment décisif."
        },
        {
          title: "Des outils digitaux modernes",
          description: "Suivez votre comptabilité en temps réel et échangez avec votre interlocuteur en présentiel ou à distance."
        }
      ]
    },
    missions: [
      {
        title: "Création et reprise d'entreprise",
        description: "Vous souhaitez lancer votre activité dans le Calvados ? Nous vous accompagnons dès les premières étapes : choix du statut juridique (SARL, SAS, EURL, micro-entreprise…), élaboration du business plan, prévisionnel financier et optimisation fiscale dès le démarrage. Nous intervenons également dans le cadre d'une reprise d'entreprise : audit d'acquisition et valorisation inclus."
      },
      {
        title: "Tenue de comptabilité et établissement du bilan",
        description: "Nous prenons en charge l'intégralité de votre comptabilité : saisie comptable, rapprochement bancaire, établissement du bilan et du compte de résultat, liasse fiscale et déclarations de TVA. Grâce à nos outils digitaux, vos finances sont toujours à jour et consultables en temps réel."
      },
      {
        title: "Conseil fiscal et optimisation",
        description: "Votre expert-comptable à Caen analyse votre situation pour identifier les meilleures options fiscales : choix du régime d'imposition, crédits d'impôt, optimisation de la rémunération du dirigeant, arbitrage dividendes/salaire. L'objectif : vous faire payer le juste impôt, sans mauvaise surprise."
      },
      {
        title: "Gestion sociale et paie",
        description: "Bulletins de paie, déclarations sociales nominatives (DSN), gestion des contrats de travail et des entrées/sorties de personnel, conseil en droit social ; Drakar sécurise vos pratiques RH et vous aide à respecter vos obligations légales."
      },
      {
        title: "Accompagnement juridique",
        description: "Rédaction et modification de statuts, assemblées générales, approbation des comptes, transfert de siège social, augmentation de capital : notre cabinet vous assiste dans l'ensemble de vos démarches juridiques courantes."
      }
    ],
    clientele: {
      intro: "Le cabinet Drakar intervient auprès d'une clientèle variée sur Caen et dans l'ensemble du Calvados :",
      types: [
        "Créateurs et repreneurs d'entreprise",
        "Artisans, commerçants et restaurateurs",
        "Professions libérales (médecins, avocats, consultants, architectes…)",
        "Prestataires de services, freelances et entreprises du numérique",
        "TPE et PME tous secteurs (BTP, immobilier, restauration, tech…)",
        "Investisseurs immobiliers (SCI, LMNP)"
      ],
      outro: "Quel que soit votre statut : SARL, SAS, EURL, micro-entreprise, BNC, BIC ; nous adaptons nos missions à votre profil."
    },
    localSection: {
      title: "Drakar : un cabinet ancré au cœur de la Normandie",
      description: "Caen, préfecture du Calvados et capitale historique de la Normandie, est une ville universitaire et économique en plein développement. Son tissu entrepreneurial dynamique, ses zones d'activité et ses pôles de compétitivité en font un territoire propice à la création et au développement d'entreprise. En choisissant Drakar comme partenaire comptable, vous bénéficiez d'un cabinet qui connaît les acteurs économiques normands, les dispositifs d'aides régionaux et les spécificités du marché local. Nous travaillons en lien avec les organismes du territoire (CCI Caen Normandie, CMA Normandie, pépinières d'entreprises) pour vous orienter vers les bons interlocuteurs."
    },
    faq: [
      {
        question: "Quel est le tarif moyen d'un expert-comptable à Caen ?",
        answer: "Les honoraires varient selon la taille de l'entreprise, le volume d'opérations et les missions confiées. Pour une TPE, comptez généralement entre 100 et 500 € HT par mois pour une mission complète (comptabilité, fiscal, social). Chez Drakar, nous établissons un devis personnalisé et transparent. Contactez-nous pour une estimation gratuite et sans engagement."
      },
      {
        question: "Comment choisir un bon expert-comptable à Caen ?",
        answer: "Vérifiez qu'il est inscrit à l'Ordre des experts-comptables, qu'il possède une expérience dans votre secteur d'activité et qu'il propose un suivi réactif et personnalisé. La proximité géographique est un atout réel pour faciliter les échanges. Chez Drakar, nous combinons expertise sectorielle, disponibilité et outils digitaux performants."
      },
      {
        question: "Quel est le coût d'un bilan comptable ?",
        answer: "Pour une petite structure, l'établissement du bilan représente généralement entre 800 et 2 500 € HT, selon la complexité de l'activité et le volume de pièces à traiter. Contactez-nous pour un devis adapté à votre situation."
      },
      {
        question: "Quelle est la différence entre un comptable et un expert-comptable ?",
        answer: "Le comptable assure la saisie et le suivi des opérations courantes. L'expert-comptable, titulaire d'un diplôme d'État et inscrit à l'Ordre, est le seul professionnel habilité à certifier la régularité et la sincérité de vos comptes. Il apporte également un conseil stratégique et une dimension d'optimisation fiscale que le comptable seul ne peut offrir."
      }
    ],
    ctaTitle: "Contactez votre expert-comptable à Caen",
    ctaDescription: "Prêt à confier la gestion comptable et fiscale de votre entreprise à un cabinet de confiance ? Prenez contact avec le cabinet Drakar dès aujourd'hui pour un premier échange gratuit et sans engagement."
  },

  "expert-comptable-rouen": {
    metaTitle: "Expert-comptable à Rouen | Cabinet Drakar",
    metaDescription: "Cabinet d'expert-comptable à Rouen. Accompagnement des entrepreneurs, TPE et PME de Seine-Maritime.",
    heroTitle: "Votre cabinet d'expert-comptable à Rouen",
    heroSubtitle: "Vous êtes à la recherche d'un expert-comptable à Rouen pour piloter sereinement la gestion de votre entreprise ? Le cabinet Drakar Expert Comptable, inscrit à l'Ordre des experts-comptables, accompagne les entrepreneurs, TPE et PME de Seine-Maritime. De la création de votre structure à la gestion comptable, fiscale et sociale au quotidien, notre équipe est à vos côtés à chaque étape de votre développement.",
    whyChooseUs: {
      intro: "Rouen est un pôle économique majeur de la Normandie, avec un tissu entrepreneurial riche et diversifié. Choisir un cabinet comptable ancré localement, c'est s'assurer d'un accompagnement adapté aux réalités du marché normand. Voici pourquoi nos clients nous font confiance :",
      points: [
        {
          title: "Une relation de proximité",
          description: "Vous disposez d'un interlocuteur dédié, disponible et réactif, présent sur votre territoire."
        },
        {
          title: "Un conseil stratégique",
          description: "Au-delà des chiffres, nous vous apportons une vision globale pour optimiser votre fiscalité, votre gestion et votre développement."
        },
        {
          title: "Des compétences transversales",
          description: "Comptabilité, fiscalité, droit social, juridique, gestion de patrimoine. Nous intervenons sur tous les leviers de votre performance."
        },
        {
          title: "Une approche digitale",
          description: "Suivez votre comptabilité en temps réel et collaborez avec votre expert-comptable à distance ou en présentiel à Rouen."
        }
      ]
    },
    missions: [
      {
        title: "Création et reprise d'entreprise",
        description: "Vous lancez votre activité à Rouen ou en Seine-Maritime ? Notre équipe vous accompagne de A à Z : choix de la forme juridique (SAS, SARL, EURL, auto-entrepreneur…), business plan et prévisionnel financier, formalités de création et démarches administratives. Nous intervenons également pour les reprises d'entreprise : audit d'acquisition et valorisation inclus."
      },
      {
        title: "Tenue de comptabilité et établissement du bilan",
        description: "Nous assurons la tenue complète de votre comptabilité : saisie des écritures, rapprochement bancaire, bilan annuel, compte de résultat, liasse fiscale et déclarations de TVA. Notre objectif : une comptabilité fiable et conforme, livrée dans les délais."
      },
      {
        title: "Optimisation fiscale",
        description: "Votre expert-comptable à Rouen analyse votre situation pour déterminer les meilleures stratégies fiscales : régime d'imposition optimal, crédits d'impôt (CIR, CII), optimisation de la rémunération du dirigeant, arbitrage dividendes/salaire. Nous veillons à ce que vous ne payiez que le juste impôt."
      },
      {
        title: "Gestion sociale et paie",
        description: "De l'établissement des bulletins de paie aux déclarations sociales nominatives (DSN), en passant par la gestion des contrats de travail et le conseil en droit social, Drakar est votre partenaire pour sécuriser la gestion de vos ressources humaines."
      },
      {
        title: "Conseil en gestion et pilotage",
        description: "Au-delà des chiffres, nous vous aidons à piloter votre entreprise : tableaux de bord, indicateurs de performance, accompagnement dans vos décisions stratégiques (investissements, recrutements, développement commercial)."
      }
    ],
    clientele: {
      intro: "Notre cabinet d'expert-comptable à Rouen intervient auprès d'une clientèle variée sur Rouen Métropole et dans l'ensemble de la Seine-Maritime :",
      types: [
        "Créateurs d'entreprise et start-ups",
        "Artisans, commerçants et restaurateurs",
        "Professions libérales (médecins, avocats, consultants, architectes…)",
        "Sociétés de services et entreprises du numérique",
        "PME industrielles et commerciales",
        "Investisseurs immobiliers (SCI, LMNP)"
      ],
      outro: "Que vous soyez en BNC, BIC, IS ou au régime de la micro-entreprise, notre équipe s'adapte à votre profil et à votre secteur d'activité."
    },
    localSection: {
      title: "Drakar : un cabinet ancré dans le tissu économique de Rouen",
      description: "Rouen, capitale de la Normandie, est une métropole en plein essor. Son port, son université et ses zones d'activité en font un terreau fertile pour l'entrepreneuriat. En choisissant Drakar comme expert-comptable à Rouen, vous bénéficiez d'un cabinet qui connaît le territoire, ses acteurs et ses opportunités. Nous travaillons en lien avec les organismes locaux (CCI, CMA, pépinières d'entreprises) pour vous orienter vers les bons interlocuteurs et vous faire bénéficier des dispositifs d'aide disponibles."
    },
    faq: [
      {
        question: "Quel est le tarif moyen d'un expert-comptable à Rouen ?",
        answer: "Les honoraires varient selon la nature et le volume des missions confiées. Pour une TPE, comptez entre 100 et 500 € HT par mois pour une mission complète (comptabilité, fiscal, social). Chez Drakar, nous établissons un devis personnalisé et transparent, sans frais cachés. Contactez-nous pour une estimation gratuite."
      },
      {
        question: "Quels sont les avantages d'un expert-comptable de proximité à Rouen ?",
        answer: "Un expert-comptable local connaît l'écosystème économique normand, les aides régionales disponibles et les spécificités du marché local. Il peut vous rencontrer facilement, réagir rapidement en cas de besoin et vous orienter vers les bons partenaires sur le territoire rouennais."
      },
      {
        question: "Puis-je faire mon bilan comptable seul ?",
        answer: "Juridiquement, rien ne vous en empêche. En pratique, c'est un exercice technique qui nécessite des compétences comptables solides. Un bilan établi par un expert-comptable inscrit à l'Ordre offre une garantie de fiabilité et de conformité auprès des banques, des investisseurs et de l'administration fiscale."
      },
      {
        question: "Quels sont les signaux d'alarme pour changer de comptable ?",
        answer: "Des retards répétés dans les déclarations, un manque de réactivité, l'absence de conseil proactif et une facturation opaque sont des signaux préoccupants. Un bon cabinet d'expertise comptable doit être transparent, disponible et force de proposition. Si ces critères ne sont plus réunis, il est légitime d'envisager un changement."
      }
    ],
    ctaTitle: "Contactez votre expert-comptable à Rouen",
    ctaDescription: "Envie d'être accompagné par un cabinet d'expertise comptable à Rouen qui comprend votre activité et s'engage à vos côtés ? Contactez Drakar pour un premier échange gratuit et sans engagement."
  }
};
