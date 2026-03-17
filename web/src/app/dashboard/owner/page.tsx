"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import StatsCard from "@/components/stats-card";
import OfferTable from "@/components/offer-table";
import { formatXAF } from "@/lib/mock-data";
import {
  useAppStore,
  selectOwnerOffers,
  selectOwnerActiveVenueCount,
  selectOwnerPendingOfferCount,
  selectOwnerMonthlyRevenue,
  selectOwnerAcceptRate,
} from "@/store/useAppStore";

const OWNER_ID = "owner-1";

export default function OwnerDashboard() {
  const offers = useAppStore(useShallow(selectOwnerOffers(OWNER_ID)));
  const activeVenues = useAppStore(useMemo(() => selectOwnerActiveVenueCount(OWNER_ID), []));
  const pendingOffers = useAppStore(useMemo(() => selectOwnerPendingOfferCount(OWNER_ID), []));
  const monthlyRevenue = useAppStore(useMemo(() => selectOwnerMonthlyRevenue(OWNER_ID), []));
  const acceptRate = useAppStore(useMemo(() => selectOwnerAcceptRate(OWNER_ID), []));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">
          Bienvenue, Jean-Pierre. Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
        <StatsCard
          title="Emplacements actifs"
          value={String(activeVenues)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Offres en attente"
          value={String(pendingOffers)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatsCard
          title="Revenus ce mois"
          value={formatXAF(monthlyRevenue)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Taux d'acceptation"
          value={`${acceptRate}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/dashboard/owner/venues/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un emplacement
        </Link>
        <Link
          href="/dashboard/owner/offers"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-all duration-200"
        >
          Voir toutes les offres
        </Link>
      </div>

      {/* Recent offers */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Offres récentes
        </h2>
        <OfferTable
          offers={offers.slice(0, 5)}
          perspective="owner"
        />
      </div>
    </div>
  );
}
