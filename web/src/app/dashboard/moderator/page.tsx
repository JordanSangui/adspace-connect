"use client";

import { useState } from "react";
import { mockVenues, formatDate, type Venue } from "@/lib/mock-data";

const pendingVenues = mockVenues.filter(
  (v) => v.status === "En révision" || v.status === "Brouillon"
);

export default function ModeratorDashboard() {
  const [venues, setVenues] = useState(pendingVenues);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (venue: Venue) => {
    setVenues((prev) =>
      prev.map((v) =>
        v.id === venue.id ? { ...v, status: "Publié" as const } : v
      )
    );
  };

  const handleRejectClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedVenue) return;
    setVenues((prev) =>
      prev.map((v) =>
        v.id === selectedVenue.id ? { ...v, status: "Refusé" as const } : v
      )
    );
    setShowRejectModal(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Publié":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Refusé":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Modération
        </h1>
        <p className="text-gray-500 mt-1">
          Vérifiez et approuvez les emplacements soumis par les propriétaires.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        <span className="px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200">
          En attente:{" "}
          {
            venues.filter(
              (v) => v.status === "En révision" || v.status === "Brouillon"
            ).length
          }
        </span>
        <span className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200">
          Approuvés: {venues.filter((v) => v.status === "Publié").length}
        </span>
        <span className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
          Refusés: {venues.filter((v) => v.status === "Refusé").length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Titre
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Propriétaire
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Ville
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Soumis le
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Statut
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {venues.map((venue) => (
                <tr
                  key={venue.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={venue.image}
                        alt={venue.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-sm text-gray-900">
                        {venue.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {venue.ownerName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{venue.city}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{venue.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400">
                      {venue.submittedAt
                        ? formatDate(venue.submittedAt)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(venue.status)}`}
                    >
                      {venue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {(venue.status === "En révision" ||
                        venue.status === "Brouillon") && (
                        <>
                          <button
                            onClick={() => handleApprove(venue)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleRejectClick(venue)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {venues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">
              Aucun emplacement en attente de modération.
            </p>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Refuser l&apos;emplacement
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {selectedVenue.title}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif du refus *
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez la raison du refus..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectReason}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
