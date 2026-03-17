"use client";

import { useState } from "react";
import OfferTable from "@/components/offer-table";
import { mockOffers, formatXAF, type Offer } from "@/lib/mock-data";

const ownerOffers = mockOffers.filter(
  (o) => o.ownerId === "owner-1" || o.ownerId === "owner-2"
);

export default function OwnerOffersPage() {
  const [offers, setOffers] = useState(ownerOffers);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  const handleAccept = (offer: Offer) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id ? { ...o, status: "Acceptée" as const } : o
      )
    );
  };

  const handleReject = (offer: Offer) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id ? { ...o, status: "Refusée" as const } : o
      )
    );
  };

  const handleCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setCounterPrice("");
    setCounterMessage("");
    setShowCounterModal(true);
  };

  const submitCounterOffer = () => {
    if (!selectedOffer || !counterPrice) return;
    setOffers((prev) =>
      prev.map((o) =>
        o.id === selectedOffer.id
          ? {
              ...o,
              status: "Contre-offre" as const,
              counterOfferPrice: Number(counterPrice),
            }
          : o
      )
    );
    setShowCounterModal(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Offres reçues</h1>
        <p className="text-gray-500 mt-1">
          Gérez les offres envoyées par les agences pour vos emplacements.
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
          Contre-offres: {offers.filter((o) => o.status === "Contre-offre").length}
        </span>
        <span className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
          Refusées: {offers.filter((o) => o.status === "Refusée").length}
        </span>
      </div>

      {/* Table */}
      <OfferTable
        offers={offers}
        perspective="owner"
        onAccept={handleAccept}
        onReject={handleReject}
        onCounterOffer={handleCounterOffer}
      />

      {/* Counter-offer modal */}
      {showCounterModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Faire une contre-offre
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Offre originale de{" "}
              <strong>{selectedOffer.agencyName}</strong> :{" "}
              {formatXAF(selectedOffer.proposedPrice)}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre prix (XAF) *
                </label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  placeholder="Ex: 380000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  rows={3}
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  placeholder="Expliquez votre contre-offre..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCounterModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={submitCounterOffer}
                disabled={!counterPrice}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Envoyer la contre-offre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
