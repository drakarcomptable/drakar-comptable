
import { RegionData, Agency } from '../types';

export const REGIONS_DATA: RegionData[] = [
  {
    name: "Île-de-France",
    cities: ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Versailles", "Courbevoie"]
  },
  {
    name: "Normandie",
    cities: [
      "Le Havre", "Rouen", "Caen", "Cherbourg-en-Cotentin", "Évreux", "Saint-Étienne-du-Rouvray", "Sotteville-lès-Rouen",
      "Dieppe", "Le Grand-Quevilly", "Alençon", "Vernon", "Hérouville-Saint-Clair", "Le Petit-Quevilly", "Mont-Saint-Aignan",
      "Lisieux", "Saint-Lô", "Louviers", "Vire Normandie", "Fécamp", "Montivilliers", "Flers", "Bois-Guillaume", "Canteleu",
      "Argentan", "Val-de-Reuil", "Bayeux", "Granville", "Barentin", "Oissel-sur-Seine", "Gisors", "Yvetot", "Bolbec", "Ifs",
      "La Hague", "Maromme", "Déville-lès-Rouen", "Avranches", "Port-Jérôme-sur-Seine", "Caudebec-lès-Elbeuf", "Pont-Audemer",
      "Carentan-les-Marais", "Bernay", "Mondeville", "Darnétal", "Grand-Couronne"
    ]
  },
  {
    name: "Provence-Alpes-Côte d’Azur",
    cities: ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon"]
  },
  {
    name: "Auvergne-Rhône-Alpes",
    cities: ["Lyon", "Saint-Étienne", "Villeurbanne", "Grenoble", "Clermont-Ferrand", "Annecy"]
  },
  {
    name: "Occitanie",
    cities: ["Toulouse", "Montpellier", "Nîmes", "Perpignan"]
  },
  {
    name: "Pays de la Loire",
    cities: ["Nantes", "Angers", "Le Mans"]
  },
  {
    name: "Nouvelle-Aquitaine",
    cities: ["Bordeaux", "Limoges", "Poitiers"]
  },
  {
    name: "Hauts-de-France",
    cities: ["Lille", "Amiens"]
  },
  {
    name: "Grand Est",
    cities: ["Strasbourg", "Reims", "Metz", "Nancy", "Mulhouse"]
  },
  {
    name: "Bretagne",
    cities: ["Rennes", "Brest"]
  },
  {
    name: "Centre-Val de Loire",
    cities: ["Orléans", "Tours"]
  },
  {
    name: "Bourgogne-Franche-Comté",
    cities: ["Dijon", "Besançon"]
  },
  {
    name: "La Réunion",
    cities: ["Saint-Paul"]
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
