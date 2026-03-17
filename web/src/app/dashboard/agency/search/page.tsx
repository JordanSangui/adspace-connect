"use client";

import { useState } from "react";
import VenueCard from "@/components/venue-card";
import {
  formatXAF,
  cities,
  venueTypes,
  type Venue,
} from "@/lib/mock-data";
import { useAppStore, selectPublishedVenues } from "@/store/useAppStore";

const AGENCY_ID = "agency-1";
const AGENCY_NAME = "PubCam Agency";

export default function AgencySearchPage() {
  const publishedVenues = useAppStore(selectPublishedVenues);
  const addOffer = useAppStore((s) => s.addOffer);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState(500000);

  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const [offerSent, setOfferSent] = useState(false);

  const filteredVenues = publishedVenues.filter((v) => {
    const matchSearch =
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase());
    const matchCity = !city || v.city === city;
    const matchType = !type || v.type === type;
    const matchPrice = v.price <= maxPrice;
    return matchSearch && matchCity && matchType && matchPrice;
  });

  const handleMakeOffer = (venue: Venue) => {
    setSelectedVenue(venue);
    setOfferPrice("");
    setOfferMessage("");
    setOfferStartDate("");
    setOfferEndDate("");
    setOfferSent(false);
    setShowOfferModal(true);
  };

  const handleSubmitOffer = () => {
    if (!offerPrice || !offerStartDate || !offerEndDate || !selectedVenue) return;
    addOffer({
      venueId: selectedVenue.id,
      agencyId: AGENCY_ID,
      agencyName: AGENCY_NAME,
      proposedPrice: Number(offerPrice),
      message: offerMessage || undefined,
      startDate: offerStartDate,
      endDate: offerEndDate,
    });
    setOfferSent(true);
    setTimeout(() => setShowOfferModal(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Rechercher des emplacements
        </h1>
        <p className="text-gray-500 mt-1">
          Trouvez l&apos;espace publicitaire idéal pour votre prochaine campagne.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou adresse..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Ville
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              <option value="">Tous les types</option>
              {venueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Max price */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Prix max: {formatXAF(maxPrice)}
            </label>
            <input
              type="range"
              min={50000}
              max={500000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary h-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>50 000 XAF</span>
              <span>500 000 XAF</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          {filteredVenues.length} résultat{filteredVenues.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {filteredVenues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            showOfferButton
            onMakeOffer={handleMakeOffer}
          />
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-400">
            Aucun emplacement ne correspond à vos critères.
          </p>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-scale-in">
            {offerSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Offre envoyée !
                </h3>
                <p className="text-sm text-gray-500">
                  Le propriétaire recevra votre offre et vous serez notifié de
                  sa réponse.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Faire une offre
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {selectedVenue.title} •{" "}
                  <span className="font-medium">
                    Prix demandé: {formatXAF(selectedVenue.price)}
                  </span>
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix proposé (XAF) *
                    </label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Ex: 300000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {offerPrice && (
                      <p className="text-xs text-gray-400 mt-1">
                        = {formatXAF(Number(offerPrice))}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        value={offerStartDate}
                        onChange={(e) => setOfferStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        value={offerEndDate}
                        onChange={(e) => setOfferEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Décrivez votre projet publicitaire..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmitOffer}
                    disabled={!offerPrice || !offerStartDate || !offerEndDate}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Envoyer l&apos;offre
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
