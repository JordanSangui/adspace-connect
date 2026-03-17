import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  mockVenues,
  mockOffers,
  mockContracts,
  type Venue,
  type Offer,
  type Contract,
  type VenueStatus,
  type OfferStatus,
  type ContractStatus,
  type VenueType,
} from "@/lib/mock-data";

// ===== HELPER =====

let _nextId = 100;
function nextId(prefix: string) {
  _nextId += 1;
  return `${prefix}-${_nextId}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ===== STATE SHAPE =====

interface AppState {
  venues: Venue[];
  offers: Offer[];
  contracts: Contract[];

  // ——— Venue actions ———
  addVenue: (data: {
    title: string;
    description: string;
    type: VenueType;
    address: string;
    city: string;
    price: number;
    ownerId: string;
    ownerName: string;
    image?: string;
    availableFrom: string;
    availableTo: string;
    dimensions?: string;
  }) => Venue;

  updateVenueStatus: (venueId: string, status: VenueStatus) => void;
  deleteVenue: (venueId: string) => void;

  // ——— Offer actions ———
  addOffer: (data: {
    venueId: string;
    agencyId: string;
    agencyName: string;
    proposedPrice: number;
    message?: string;
    startDate: string;
    endDate: string;
  }) => Offer;

  updateOfferStatus: (
    offerId: string,
    status: OfferStatus,
    counterOfferPrice?: number
  ) => void;

  // ——— Contract actions ———
  createContractFromOffer: (offerId: string) => Contract | null;
  updateContractStatus: (contractId: string, status: ContractStatus) => void;
  markContractPaid: (contractId: string) => void;

  // ——— Reset ———
  resetToMockData: () => void;
}

// ===== STORE =====

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ---------- initial state ----------
      venues: mockVenues,
      offers: mockOffers,
      contracts: mockContracts,

      // ---------- Venue actions ----------

      addVenue: (data) => {
        const venue: Venue = {
          id: nextId("venue"),
          title: data.title,
          description: data.description,
          type: data.type,
          address: data.address,
          city: data.city,
          price: data.price,
          status: "En révision",
          ownerId: data.ownerId,
          ownerName: data.ownerName,
          image:
            data.image ??
            `https://placehold.co/400x300/1E3A5F/ffffff?text=${encodeURIComponent(data.title.slice(0, 20))}`,
          availableFrom: data.availableFrom,
          availableTo: data.availableTo,
          dimensions: data.dimensions,
          submittedAt: todayISO(),
        };
        set((s) => ({ venues: [...s.venues, venue] }));
        return venue;
      },

      updateVenueStatus: (venueId, status) =>
        set((s) => ({
          venues: s.venues.map((v) =>
            v.id === venueId ? { ...v, status } : v
          ),
        })),

      deleteVenue: (venueId) =>
        set((s) => ({
          venues: s.venues.filter((v) => v.id !== venueId),
          // cascade : supprimer les offres liées non-acceptées
          offers: s.offers.filter(
            (o) =>
              o.venueId !== venueId ||
              o.status === "Acceptée"
          ),
        })),

      // ---------- Offer actions ----------

      addOffer: (data) => {
        const { venues } = get();
        const venue = venues.find((v) => v.id === data.venueId);
        if (!venue) throw new Error(`Venue ${data.venueId} introuvable`);

        const offer: Offer = {
          id: nextId("offer"),
          venueId: data.venueId,
          venueTitle: venue.title,
          venueCity: venue.city,
          agencyId: data.agencyId,
          agencyName: data.agencyName,
          ownerId: venue.ownerId,
          ownerName: venue.ownerName,
          proposedPrice: data.proposedPrice,
          message: data.message,
          startDate: data.startDate,
          endDate: data.endDate,
          status: "En attente",
          createdAt: todayISO(),
        };
        set((s) => ({ offers: [...s.offers, offer] }));
        return offer;
      },

      updateOfferStatus: (offerId, status, counterOfferPrice) => {
        set((s) => ({
          offers: s.offers.map((o) =>
            o.id === offerId
              ? {
                  ...o,
                  status,
                  ...(counterOfferPrice !== undefined && { counterOfferPrice }),
                }
              : o
          ),
        }));

        // ⚡ Création automatique d'un contrat quand une offre est acceptée
        if (status === "Acceptée") {
          get().createContractFromOffer(offerId);
        }
      },

      // ---------- Contract actions ----------

      createContractFromOffer: (offerId) => {
        const { offers, contracts } = get();

        // Ne pas créer de doublon
        if (contracts.some((c) => c.offerId === offerId)) return null;

        const offer = offers.find((o) => o.id === offerId);
        if (!offer) return null;

        const contract: Contract = {
          id: nextId("contract"),
          offerId: offer.id,
          venueId: offer.venueId,
          venueTitle: offer.venueTitle,
          venueCity: offer.venueCity,
          ownerId: offer.ownerId,
          ownerName: offer.ownerName,
          agencyId: offer.agencyId,
          agencyName: offer.agencyName,
          finalPrice: offer.counterOfferPrice ?? offer.proposedPrice,
          startDate: offer.startDate,
          endDate: offer.endDate,
          status: "Offre acceptée",
          signedAt: todayISO(),
        };
        set((s) => ({ contracts: [...s.contracts, contract] }));
        return contract;
      },

      updateContractStatus: (contractId, status) =>
        set((s) => ({
          contracts: s.contracts.map((c) =>
            c.id === contractId ? { ...c, status } : c
          ),
        })),

      markContractPaid: (contractId) =>
        set((s) => ({
          contracts: s.contracts.map((c) =>
            c.id === contractId
              ? { ...c, paidAt: todayISO(), status: "Contrat signé" as ContractStatus }
              : c
          ),
        })),

      // ---------- Reset ----------

      resetToMockData: () =>
        set({
          venues: mockVenues,
          offers: mockOffers,
          contracts: mockContracts,
        }),
    }),
    {
      name: "adspace-connect-store",
      // On ne persiste que les données, pas les fonctions
      partialize: (state) => ({
        venues: state.venues,
        offers: state.offers,
        contracts: state.contracts,
      }),
    }
  )
);

// ====================================================================
// SELECTORS
// Utilisation :  const venues = useAppStore(selectOwnerVenues("owner-1"))
// ====================================================================

// ——— Venues ———

/** Tous les emplacements d'un propriétaire */
export const selectOwnerVenues =
  (ownerId: string) => (s: AppState) =>
    s.venues.filter((v) => v.ownerId === ownerId);

/** Emplacements publiés uniquement */
export const selectPublishedVenues = (s: AppState) =>
  s.venues.filter((v) => v.status === "Publié");

/** Emplacements en attente de modération */
export const selectPendingVenues = (s: AppState) =>
  s.venues.filter((v) => v.status === "En révision");

/** Emplacements par statut */
export const selectVenuesByStatus =
  (status: VenueStatus) => (s: AppState) =>
    s.venues.filter((v) => v.status === status);

/** Un emplacement par ID */
export const selectVenueById =
  (id: string) => (s: AppState) =>
    s.venues.find((v) => v.id === id);

// ——— Offers ———

/** Offres reçues par un propriétaire */
export const selectOwnerOffers =
  (ownerId: string) => (s: AppState) =>
    s.offers.filter((o) => o.ownerId === ownerId);

/** Offres envoyées par une agence */
export const selectAgencyOffers =
  (agencyId: string) => (s: AppState) =>
    s.offers.filter((o) => o.agencyId === agencyId);

/** Offres en attente pour un propriétaire */
export const selectPendingOwnerOffers =
  (ownerId: string) => (s: AppState) =>
    s.offers.filter(
      (o) => o.ownerId === ownerId && o.status === "En attente"
    );

/** Offres par statut */
export const selectOffersByStatus =
  (status: OfferStatus) => (s: AppState) =>
    s.offers.filter((o) => o.status === status);

/** Offres pour un emplacement donné */
export const selectOffersForVenue =
  (venueId: string) => (s: AppState) =>
    s.offers.filter((o) => o.venueId === venueId);

// ——— Contracts ———

/** Contrats d'un propriétaire */
export const selectOwnerContracts =
  (ownerId: string) => (s: AppState) =>
    s.contracts.filter((c) => c.ownerId === ownerId);

/** Contrats d'une agence */
export const selectAgencyContracts =
  (agencyId: string) => (s: AppState) =>
    s.contracts.filter((c) => c.agencyId === agencyId);

/** Contrats actifs (en cours) */
export const selectActiveContracts = (s: AppState) =>
  s.contracts.filter(
    (c) => c.status === "En cours" || c.status === "Contrat signé"
  );

/** Un contrat par ID */
export const selectContractById =
  (id: string) => (s: AppState) =>
    s.contracts.find((c) => c.id === id);

/** Contrat lié à une offre */
export const selectContractByOfferId =
  (offerId: string) => (s: AppState) =>
    s.contracts.find((c) => c.offerId === offerId);

// ——— Stats ———

/** Nombre d'emplacements actifs d'un propriétaire */
export const selectOwnerActiveVenueCount =
  (ownerId: string) => (s: AppState) =>
    s.venues.filter(
      (v) => v.ownerId === ownerId && v.status === "Publié"
    ).length;

/** Nombre d'offres en attente d'un propriétaire */
export const selectOwnerPendingOfferCount =
  (ownerId: string) => (s: AppState) =>
    s.offers.filter(
      (o) => o.ownerId === ownerId && o.status === "En attente"
    ).length;

/** Revenus du mois (prix des contrats actifs du propriétaire) */
export const selectOwnerMonthlyRevenue =
  (ownerId: string) => (s: AppState) =>
    s.contracts
      .filter(
        (c) =>
          c.ownerId === ownerId &&
          (c.status === "En cours" || c.status === "Contrat signé")
      )
      .reduce((sum, c) => sum + c.finalPrice, 0);

/** Taux d'acceptation d'un propriétaire */
export const selectOwnerAcceptRate =
  (ownerId: string) => (s: AppState) => {
    const all = s.offers.filter((o) => o.ownerId === ownerId);
    if (all.length === 0) return 0;
    const accepted = all.filter((o) => o.status === "Acceptée").length;
    return Math.round((accepted / all.length) * 100);
  };

/** Budget total dépensé par une agence */
export const selectAgencyTotalSpent =
  (agencyId: string) => (s: AppState) =>
    s.contracts
      .filter((c) => c.agencyId === agencyId && c.paidAt)
      .reduce((sum, c) => sum + c.finalPrice, 0);
