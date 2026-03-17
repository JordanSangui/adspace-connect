"use client";

import { useRouter } from "next/navigation";
import OfferTable from "@/components/offer-table";
import { type Offer } from "@/lib/mock-data";
import {
  useAppStore,
  selectAgencyOffers,
  selectContractByOfferId,
} from "@/store/useAppStore";

const AGENCY_ID = "agency-1";

export default function AgencyOffersPage() {
  const router = useRouter();
  const offers = useAppStore(selectAgencyOffers(AGENCY_ID));
  const contracts = useAppStore((s) => s.contracts);
  const updateOfferStatus = useAppStore((s) => s.updateOfferStatus);

  const handleAccept = (offer: Offer) => {
    updateOfferStatus(offer.id, "Acceptée");
  };

  const handleReject = (offer: Offer) => {
    updateOfferStatus(offer.id, "Refusée");
  };

  const handleViewContract = (offer: Offer) => {
    const contract = contracts.find((c) => c.offerId === offer.id);
    if (contract) {
      router.push(`/dashboard/contracts/${contract.id}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes offres</h1>
        <p className="text-gray-500 mt-1">
          Suivez l&apos;état de toutes vos offres envoyées.
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <span className="px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200">
          En attente: {offers.filter((o) => o.status === "En attente").length}
        </span>
        <span className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200">
          Acceptées: {offers.filter((o) => o.status === "Acceptée").length}
        </span>
        <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
          Contre-offres:{" "}
          {offers.filter((o) => o.status === "Contre-offre").length}
        </span>
        <span className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
          Refusées: {offers.filter((o) => o.status === "Refusée").length}
        </span>
      </div>

      {/* Table */}
      <OfferTable
        offers={offers}
        perspective="agency"
        onAccept={handleAccept}
        onReject={handleReject}
        onViewContract={handleViewContract}
      />
    </div>
  );
}
