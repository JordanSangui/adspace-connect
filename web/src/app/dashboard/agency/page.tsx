"use client";

import Link from "next/link";
import StatsCard from "@/components/stats-card";
import VenueCard from "@/components/venue-card";
import { mockOffers, mockContracts, mockVenues, formatXAF, formatDate } from "@/lib/mock-data";

const agencyOffers = mockOffers.filter((o) => o.agencyId === "agency-1" || o.agencyId === "agency-2");
const agencyContracts = mockContracts.filter(
  (c) => c.agencyId === "agency-1" || c.agencyId === "agency-2"
);
const recommendedVenues = mockVenues.filter((v) => v.status === "Publié").slice(0, 3);

export default function AgencyDashboard() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">
          Bienvenue, Patrick. Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
        <StatsCard
          title="Offres envoyées"
          value="8"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          }
          trend="+3 ce mois"
          trendUp={true}
        />
        <StatsCard
          title="Offres acceptées"
          value="3"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend="38% taux"
          trendUp={true}
        />
        <StatsCard
          title="Contrats actifs"
          value="2"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Budget dépensé"
          value={formatXAF(1200000)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Active contracts */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Contrats actifs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agencyContracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/dashboard/contracts/${contract.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {contract.venueTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {contract.venueCity} • {contract.ownerName}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    contract.status === "En cours"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {contract.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  {formatXAF(contract.finalPrice)}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(contract.startDate)} → {formatDate(contract.endDate)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended venues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Emplacements recommandés
          </h2>
          <Link
            href="/dashboard/agency/search"
            className="text-sm text-primary font-semibold hover:underline"
          >
            Voir plus →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </div>
  );
}
