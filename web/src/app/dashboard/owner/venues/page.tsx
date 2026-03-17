"use client";

import { useState } from "react";
import Link from "next/link";
import VenueCard from "@/components/venue-card";
import { type VenueStatus } from "@/lib/mock-data";
import { useAppStore, selectOwnerVenues } from "@/store/useAppStore";

const OWNER_ID = "owner-1";

const statusFilters: (VenueStatus | "Tous")[] = [
  "Tous",
  "Publié",
  "En révision",
  "Brouillon",
  "Refusé",
];

export default function OwnerVenuesPage() {
  const [filter, setFilter] = useState<VenueStatus | "Tous">("Tous");
  const ownerVenues = useAppStore(selectOwnerVenues(OWNER_ID));

  const filteredVenues =
    filter === "Tous"
      ? ownerVenues
      : ownerVenues.filter((v) => v.status === filter);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mes emplacements
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez vos espaces publicitaires.
          </p>
        </div>
        <Link
          href="/dashboard/owner/venues/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel emplacement
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
              filter === status
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {status}
            {status !== "Tous" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({ownerVenues.filter((v) => v.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Venues grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} showActions />
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <p className="text-gray-400">
            Aucun emplacement avec ce statut.
          </p>
        </div>
      )}
    </div>
  );
}
