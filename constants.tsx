
import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Gavel, 
  PieChart, 
  ShieldCheck, 
  Briefcase,
  Clock,
  TrendingUp
} from 'lucide-react';
import { ServiceCategory, Feature } from './types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'expertise-comptable',
    slug: 'expertise-comptable',
    title: 'Expertise comptable',
    description: 'Le socle de votre gestion financière supervisé par Drakar.',
    icon: <BarChart3 className="w-6 h-6" />,
    subServices: [
      { id: 'tenue', slug: 'tenue-comptabilite', title: 'Tenue comptabilité' },
      { id: 'revision', slug: 'revision-comptable', title: 'Révision comptable' },
      { id: 'bilan', slug: 'bilan-comptable', title: 'Établissement du bilan' },
      { id: 'tableau', slug: 'tableau-de-bord-financier', title: 'Tableau de bord financier' },
      { id: 'service-compta', slug: 'service-comptable', title: 'Service comptable' }
    ]
  },
  {
    id: 'fiscalite',
    slug: 'fiscalite',
    title: 'Fiscalité',
    description: 'Optimisation et souveraineté fiscale avec Drakar.',
    icon: <FileText className="w-6 h-6" />,
    subServices: [
      { id: 'decl-fisc', slug: 'declarations-fiscales', title: 'Déclarations fiscales' },
      { id: 'tva', slug: 'declaration-tva', title: 'Déclaration de TVA' },
      { id: 'is', slug: 'impot-societes', title: 'Imposition des sociétés' },
      { id: 'ir', slug: 'impot-revenu', title: 'Déclaration IR' },
      { id: 'optim-fiscale', slug: 'optimisation-fiscale', title: 'Optimisation fiscale' },
      { id: 'holding', slug: 'creation-holding', title: 'Création de holding' }
    ]
  },
  {
    id: 'social',
    slug: 'social-droit-travail',
    title: 'Social & Droit du travail',
    description: 'Gestion rigoureuse de vos ressources humaines.',
    icon: <Users className="w-6 h-6" />,
    subServices: [
      { id: 'gest-paie', slug: 'gestion-de-la-paie', title: 'Gestion de la paie' },
      { id: 'decl-sociales', slug: 'declarations-sociales', title: 'Déclarations sociales' },
      { id: 'contrat-travail', slug: 'contrat-de-travail', title: 'Contrat de travail' },
      { id: 'rupture-conv', slug: 'rupture-conventionnelle', title: 'Rupture conventionnelle' }
    ]
  },
  {
    id: 'juridique',
    slug: 'juridique-societes',
    title: 'Juridique des sociétés',
    description: 'Sécurité juridique et conformité institutionnelle.',
    icon: <Gavel className="w-6 h-6" />,
    subServices: [
      { id: 'crea-ent', slug: 'creation-entreprise', title: 'Création entreprise' },
      { id: 'crea-sas', slug: 'creation-sas', title: 'Création SAS/SASU' },
      { id: 'redac-statuts', slug: 'redaction-statuts', title: 'Rédaction de statuts' },
      { id: 'pacte', slug: 'pacte-associes', title: 'Pacte d’associés' }
    ]
  },
  {
    id: 'conseil',
    slug: 'conseil-financier-pilotage',
    title: 'Conseil financier & Pilotage',
    description: 'Audit stratégique et accompagnement à la croissance.',
    icon: <PieChart className="w-6 h-6" />,
    subServices: [
      { id: 'prev-fin', slug: 'previsionnel-financier', title: 'Prévisionnel financier' },
      { id: 'levee', slug: 'levee-de-fonds', title: 'Levée de fonds' },
      { id: 'pilotage-fin', slug: 'pilotage-financier', title: 'Pilotage financier' },
      { id: 'valorisation', slug: 'valorisation-entreprise', title: 'Valorisation' }
    ]
  }
];

// Liste des 8 services SEO pour la page Expertises, le footer et la Home
export interface SEOServiceLink {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  to: string;
  icon: React.ReactNode;
}

export const SEO_SERVICES: SEOServiceLink[] = [
  {
    id: 'comptabilite',
    slug: 'comptabilite',
    title: 'Tenue de comptabilité & Bilan',
    shortTitle: 'Comptabilité & Bilan',
    description: 'Saisie comptable, bilan annuel, liasse fiscale et déclarations de TVA. Vos comptes toujours à jour grâce à nos outils digitaux.',
    to: '/comptabilite',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'fiscalite',
    slug: 'fiscalite',
    title: 'Conseil fiscal & Optimisation',
    shortTitle: 'Fiscalité',
    description: 'Choix du régime, crédits d\'impôt, optimisation de la rémunération du dirigeant. Payez le juste impôt.',
    to: '/fiscalite',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'conseil-gestion',
    slug: 'conseil-gestion',
    title: 'Conseil en gestion & Pilotage',
    shortTitle: 'Conseil en gestion',
    description: 'Tableaux de bord, analyse de rentabilité, budget prévisionnel et gestion de trésorerie pour piloter votre PME.',
    to: '/conseil-gestion',
    icon: <PieChart className="w-6 h-6" />
  },
  {
    id: 'gestion-sociale-paie',
    slug: 'gestion-sociale-paie',
    title: 'Gestion sociale & Paie',
    shortTitle: 'Social & Paie',
    description: 'Bulletins de paie, DSN, contrats de travail et conseil en droit social. Conformité garantie avec Silae.',
    to: '/gestion-sociale-paie',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'conseil-juridique',
    slug: 'conseil-juridique',
    title: 'Accompagnement juridique',
    shortTitle: 'Juridique',
    description: 'Rédaction de statuts, assemblées générales, cessions de parts, transfert de siège et modifications statutaires.',
    to: '/conseil-juridique',
    icon: <Gavel className="w-6 h-6" />
  },
  {
    id: 'creation-reprise',
    slug: 'creation-reprise-entreprise',
    title: 'Création & Reprise d\'entreprise',
    shortTitle: 'Création d\'entreprise',
    description: 'Choix du statut juridique, business plan, prévisionnel financier et formalités d\'immatriculation.',
    to: '/creation-reprise-entreprise',
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    id: 'gestion-patrimoine',
    slug: 'gestion-patrimoine',
    title: 'Gestion de patrimoine',
    shortTitle: 'Patrimoine',
    description: 'Holding patrimoniale, SCI, épargne retraite TNS, Pacte Dutreil. Protégez et transmettez votre patrimoine.',
    to: '/gestion-patrimoine',
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    id: 'commissariat-aux-comptes',
    slug: 'commissariat-aux-comptes',
    title: 'Commissariat aux comptes',
    shortTitle: 'Commissariat aux comptes',
    description: 'Certification légale ou contractuelle, audit des comptes annuels, due diligence et audit d\'acquisition.',
    to: '/commissariat-aux-comptes',
    icon: <TrendingUp className="w-6 h-6" />
  }
];

export const FEATURES: Feature[] = [
  {
    title: 'Rigueur & Souveraineté',
    description: 'Nous assurons un suivi sans faille de vos dossiers avec une précision technique absolue.',
    icon: <Clock className="w-8 h-8 text-brand-orange" />
  },
  {
    title: 'Espace Digital Sécurisé',
    description: 'Consultez vos indicateurs Drakar en temps réel sur une plateforme cryptée hautement sécurisée.',
    icon: <TrendingUp className="w-8 h-8 text-brand-orange" />
  },
  {
    title: 'Conseil Institutionnel',
    description: 'Chaque dirigeant bénéficie d\'un interlocuteur dédié, garant de la vision stratégique du cabinet.',
    icon: <ShieldCheck className="w-8 h-8 text-brand-orange" />
  }
];
