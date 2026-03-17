// ===== TYPES =====

export type UserRole = "owner" | "agency" | "moderator";

export type VenueType = "Panneau fixe" | "Mobile" | "Vitrine";

export type VenueStatus = "Brouillon" | "En révision" | "Publié" | "Refusé";

export type OfferStatus = "En attente" | "Acceptée" | "Refusée" | "Contre-offre";

export type ContractStatus =
  | "Offre acceptée"
  | "Paiement"
  | "Contrat signé"
  | "En cours"
  | "Terminé";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  phone?: string;
  avatar?: string;
}

export interface Venue {
  id: string;
  title: string;
  description: string;
  type: VenueType;
  address: string;
  city: string;
  price: number;
  status: VenueStatus;
  ownerId: string;
  ownerName: string;
  image: string;
  availableFrom: string;
  availableTo: string;
  dimensions?: string;
  submittedAt?: string;
}

export interface Offer {
  id: string;
  venueId: string;
  venueTitle: string;
  venueCity: string;
  agencyId: string;
  agencyName: string;
  ownerId: string;
  ownerName: string;
  proposedPrice: number;
  counterOfferPrice?: number;
  message?: string;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  createdAt: string;
}

export interface Contract {
  id: string;
  offerId: string;
  venueId: string;
  venueTitle: string;
  venueCity: string;
  ownerId: string;
  ownerName: string;
  agencyId: string;
  agencyName: string;
  finalPrice: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  signedAt?: string;
  paidAt?: string;
}

// ===== UTILITY =====

export function formatXAF(amount: number): string {
  return amount.toLocaleString("fr-FR").replace(/,/g, " ") + " XAF";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ===== MOCK USERS =====

export const mockUsers: User[] = [
  {
    id: "owner-1",
    name: "Jean-Pierre Kamga",
    email: "jp.kamga@email.cm",
    role: "owner",
    company: "Kamga Immobilier",
    phone: "+237 6 90 12 34 56",
  },
  {
    id: "owner-2",
    name: "Marie-Claire Fouda",
    email: "mc.fouda@email.cm",
    role: "owner",
    company: "Fouda & Fils",
    phone: "+237 6 77 88 99 00",
  },
  {
    id: "agency-1",
    name: "Patrick Ndjock",
    email: "p.ndjock@pubcam.cm",
    role: "agency",
    company: "PubCam Agency",
    phone: "+237 6 55 44 33 22",
  },
  {
    id: "agency-2",
    name: "Aminatou Bello",
    email: "a.bello@africom.cm",
    role: "agency",
    company: "AfriCom Marketing",
    phone: "+237 6 22 33 44 55",
  },
  {
    id: "agency-3",
    name: "Samuel Tchoungang",
    email: "s.tchoungang@visiocom.cm",
    role: "agency",
    company: "VisioCom Publicité",
    phone: "+237 6 11 22 33 44",
  },
  {
    id: "mod-1",
    name: "Admin Modérateur",
    email: "admin@adspaceconnect.cm",
    role: "moderator",
  },
];

// ===== MOCK VENUES =====

export const mockVenues: Venue[] = [
  {
    id: "venue-1",
    title: "Panneau Grand Format - Rond-point Deïdo",
    description:
      "Panneau publicitaire 4x3m situé au rond-point Deïdo, l'un des carrefours les plus fréquentés de Douala. Visibilité exceptionnelle avec plus de 50 000 passages journaliers.",
    type: "Panneau fixe",
    address: "Rond-point Deïdo, Boulevard de la Liberté",
    city: "Douala",
    price: 350000,
    status: "Publié",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    image: "https://placehold.co/400x300/1E3A5F/ffffff?text=Panneau+Deïdo",
    availableFrom: "2026-04-01",
    availableTo: "2026-12-31",
    dimensions: "4m x 3m",
  },
  {
    id: "venue-2",
    title: "Vitrine Commerciale - Avenue Kennedy",
    description:
      "Espace vitrine dans un centre commercial très fréquenté sur l'Avenue Kennedy à Douala. Idéal pour les promotions de marques grand public.",
    type: "Vitrine",
    address: "Avenue Kennedy, Centre Commercial Les Galaxies",
    city: "Douala",
    price: 200000,
    status: "Publié",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    image: "https://placehold.co/400x300/F97316/ffffff?text=Vitrine+Kennedy",
    availableFrom: "2026-03-15",
    availableTo: "2026-09-30",
    dimensions: "2m x 1.5m",
  },
  {
    id: "venue-3",
    title: "Panneau Lumineux - Carrefour Bastos",
    description:
      "Panneau LED rétro-éclairé situé au carrefour Bastos à Yaoundé, quartier diplomatique et résidentiel haut de gamme. Audience CSP+ garantie.",
    type: "Panneau fixe",
    address: "Carrefour Bastos, Rue Joseph Mballa Eloumden",
    city: "Yaoundé",
    price: 450000,
    status: "Publié",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    image: "https://placehold.co/400x300/2563eb/ffffff?text=Panneau+Bastos",
    availableFrom: "2026-04-15",
    availableTo: "2026-12-31",
    dimensions: "6m x 3m",
  },
  {
    id: "venue-4",
    title: "Véhicule Publicitaire - Bus Urbain Ligne 5",
    description:
      "Habillage complet d'un bus urbain de la ligne 5 reliant le centre-ville au marché Mokolo. Couverture mobile sur l'ensemble de Yaoundé.",
    type: "Mobile",
    address: "Ligne 5 - Centre-ville ↔ Mokolo",
    city: "Yaoundé",
    price: 180000,
    status: "Publié",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    image: "https://placehold.co/400x300/16a34a/ffffff?text=Bus+Ligne+5",
    availableFrom: "2026-05-01",
    availableTo: "2026-11-30",
    dimensions: "Bus complet",
  },
  {
    id: "venue-5",
    title: "Panneau Routier - Entrée Bafoussam",
    description:
      "Grand panneau 8x4m à l'entrée de Bafoussam sur la nationale. Premier point de contact visuel pour tous les visiteurs de la ville.",
    type: "Panneau fixe",
    address: "Route Nationale N°4, Entrée Est",
    city: "Bafoussam",
    price: 250000,
    status: "Publié",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    image: "https://placehold.co/400x300/7c3aed/ffffff?text=Panneau+Bafoussam",
    availableFrom: "2026-06-01",
    availableTo: "2026-12-31",
    dimensions: "8m x 4m",
  },
  {
    id: "venue-6",
    title: "Vitrine Premium - Marché Central Douala",
    description:
      "Emplacement vitrine premium face à l'entrée principale du Marché Central de Douala. Trafic piéton massif quotidien.",
    type: "Vitrine",
    address: "Marché Central, Entrée Boulevard Ahmadou Ahidjo",
    city: "Douala",
    price: 150000,
    status: "En révision",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    image: "https://placehold.co/400x300/dc2626/ffffff?text=Vitrine+Marché",
    availableFrom: "2026-04-01",
    availableTo: "2026-10-31",
    dimensions: "3m x 2m",
    submittedAt: "2026-03-10",
  },
  {
    id: "venue-7",
    title: "Taxi Publicitaire - Flotte Yaoundé",
    description:
      "Habillage de 5 taxis de la flotte municipale de Yaoundé. Couverture maximale dans toute la ville pour votre campagne.",
    type: "Mobile",
    address: "Yaoundé Centre",
    city: "Yaoundé",
    price: 300000,
    status: "Brouillon",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    image: "https://placehold.co/400x300/eab308/ffffff?text=Taxis+Yaoundé",
    availableFrom: "2026-07-01",
    availableTo: "2026-12-31",
  },
  {
    id: "venue-8",
    title: "Panneau Aéroport - Douala International",
    description:
      "Espace publicitaire dans le hall d'arrivée de l'aéroport international de Douala. Audience voyageurs d'affaires et touristes.",
    type: "Panneau fixe",
    address: "Aéroport International de Douala, Hall Arrivées",
    city: "Douala",
    price: 500000,
    status: "Refusé",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    image: "https://placehold.co/400x300/64748b/ffffff?text=Aéroport+Douala",
    availableFrom: "2026-05-01",
    availableTo: "2026-12-31",
    dimensions: "5m x 2m",
  },
];

// ===== MOCK OFFERS =====

export const mockOffers: Offer[] = [
  {
    id: "offer-1",
    venueId: "venue-1",
    venueTitle: "Panneau Grand Format - Rond-point Deïdo",
    venueCity: "Douala",
    agencyId: "agency-1",
    agencyName: "PubCam Agency",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    proposedPrice: 300000,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    status: "En attente",
    createdAt: "2026-03-15",
    message: "Nous souhaitons promouvoir notre nouvelle gamme de produits.",
  },
  {
    id: "offer-2",
    venueId: "venue-3",
    venueTitle: "Panneau Lumineux - Carrefour Bastos",
    venueCity: "Yaoundé",
    agencyId: "agency-2",
    agencyName: "AfriCom Marketing",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    proposedPrice: 400000,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    status: "Acceptée",
    createdAt: "2026-03-10",
    message: "Campagne pour un client du secteur bancaire.",
  },
  {
    id: "offer-3",
    venueId: "venue-2",
    venueTitle: "Vitrine Commerciale - Avenue Kennedy",
    venueCity: "Douala",
    agencyId: "agency-3",
    agencyName: "VisioCom Publicité",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    proposedPrice: 150000,
    counterOfferPrice: 180000,
    startDate: "2026-04-15",
    endDate: "2026-07-15",
    status: "Contre-offre",
    createdAt: "2026-03-12",
    message: "Lancement d'un nouveau produit cosmétique.",
  },
  {
    id: "offer-4",
    venueId: "venue-5",
    venueTitle: "Panneau Routier - Entrée Bafoussam",
    venueCity: "Bafoussam",
    agencyId: "agency-1",
    agencyName: "PubCam Agency",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    proposedPrice: 200000,
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    status: "Refusée",
    createdAt: "2026-03-08",
    message: "Campagne régionale pour une marque de boisson.",
  },
  {
    id: "offer-5",
    venueId: "venue-4",
    venueTitle: "Véhicule Publicitaire - Bus Urbain Ligne 5",
    venueCity: "Yaoundé",
    agencyId: "agency-2",
    agencyName: "AfriCom Marketing",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    proposedPrice: 160000,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    status: "En attente",
    createdAt: "2026-03-16",
    message: "Campagne de sensibilisation pour un programme de santé.",
  },
  {
    id: "offer-6",
    venueId: "venue-1",
    venueTitle: "Panneau Grand Format - Rond-point Deïdo",
    venueCity: "Douala",
    agencyId: "agency-3",
    agencyName: "VisioCom Publicité",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    proposedPrice: 330000,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    status: "En attente",
    createdAt: "2026-03-14",
    message: "Campagne de fin d'année pour notre client télécom.",
  },
  {
    id: "offer-7",
    venueId: "venue-3",
    venueTitle: "Panneau Lumineux - Carrefour Bastos",
    venueCity: "Yaoundé",
    agencyId: "agency-1",
    agencyName: "PubCam Agency",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    proposedPrice: 420000,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    status: "En attente",
    createdAt: "2026-03-17",
    message: "Campagne pour un nouvel opérateur mobile.",
  },
  {
    id: "offer-8",
    venueId: "venue-5",
    venueTitle: "Panneau Routier - Entrée Bafoussam",
    venueCity: "Bafoussam",
    agencyId: "agency-2",
    agencyName: "AfriCom Marketing",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    proposedPrice: 240000,
    startDate: "2026-08-01",
    endDate: "2026-11-30",
    status: "Acceptée",
    createdAt: "2026-03-05",
    message: "Promotion de nouvelles marques dans l'ouest.",
  },
];

// ===== MOCK CONTRACTS =====

export const mockContracts: Contract[] = [
  {
    id: "contract-1",
    offerId: "offer-2",
    venueId: "venue-3",
    venueTitle: "Panneau Lumineux - Carrefour Bastos",
    venueCity: "Yaoundé",
    ownerId: "owner-2",
    ownerName: "Marie-Claire Fouda",
    agencyId: "agency-2",
    agencyName: "AfriCom Marketing",
    finalPrice: 400000,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    status: "En cours",
    signedAt: "2026-03-12",
    paidAt: "2026-03-13",
  },
  {
    id: "contract-2",
    offerId: "offer-8",
    venueId: "venue-5",
    venueTitle: "Panneau Routier - Entrée Bafoussam",
    venueCity: "Bafoussam",
    ownerId: "owner-1",
    ownerName: "Jean-Pierre Kamga",
    agencyId: "agency-2",
    agencyName: "AfriCom Marketing",
    finalPrice: 240000,
    startDate: "2026-08-01",
    endDate: "2026-11-30",
    status: "Paiement",
    signedAt: "2026-03-07",
  },
];

// ===== CITIES FOR FILTERS =====

export const cities = ["Douala", "Yaoundé", "Bafoussam"];

// ===== VENUE TYPES FOR FILTERS =====

export const venueTypes: VenueType[] = ["Panneau fixe", "Mobile", "Vitrine"];
