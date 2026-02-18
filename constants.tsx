
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
