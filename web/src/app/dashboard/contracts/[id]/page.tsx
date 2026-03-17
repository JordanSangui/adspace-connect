"use client";

import { use } from "react";
import Link from "next/link";
import { mockContracts, formatXAF, formatDate, type ContractStatus } from "@/lib/mock-data";

const timelineSteps: ContractStatus[] = [
  "Offre acceptée",
  "Paiement",
  "Contrat signé",
  "En cours",
  "Terminé",
];

function getStepIndex(status: ContractStatus) {
  return timelineSteps.indexOf(status);
}

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const contract = mockContracts.find((c) => c.id === id) || mockContracts[0];

  const currentStepIndex = getStepIndex(contract.status);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/owner"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contrat #{contract.id.split("-")[1]}
            </h1>
            <p className="text-gray-500 mt-1">{contract.venueTitle}</p>
          </div>
          <span
            className={`text-sm font-semibold px-4 py-2 rounded-full ${
              contract.status === "En cours"
                ? "bg-green-50 text-green-700 border border-green-200"
                : contract.status === "Terminé"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            }`}
          >
            {contract.status}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Progression du contrat
        </h2>
        <div className="flex items-center justify-between">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20"
                          : "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center ${
                      isCompleted ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full ${
                      index < currentStepIndex ? "bg-green-500" : "bg-gray-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contract summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Détails du contrat
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Emplacement
              </p>
              <p className="text-sm font-medium text-gray-900">
                {contract.venueTitle}
              </p>
              <p className="text-xs text-gray-500">{contract.venueCity}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Propriétaire
              </p>
              <p className="text-sm font-medium text-gray-900">
                {contract.ownerName}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Agence
              </p>
              <p className="text-sm font-medium text-gray-900">
                {contract.agencyName}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Période
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(contract.startDate)} →{" "}
                {formatDate(contract.endDate)}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Prix final
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatXAF(contract.finalPrice)}
              </p>
              <p className="text-xs text-gray-400">/ mois</p>
            </div>
            {contract.signedAt && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Signé le
                </p>
                <p className="text-sm text-gray-900">
                  {formatDate(contract.signedAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Actions */}
        <div className="space-y-8">
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Paiement
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Montant total
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatXAF(contract.finalPrice)}
              </p>
              {contract.paidAt ? (
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-green-700 font-medium">
                    Payé le {formatDate(contract.paidAt)}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-yellow-600 mt-2 font-medium">
                  ⏳ En attente de paiement
                </p>
              )}
            </div>

            {!contract.paidAt && (
              <button className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Payer via Mobile Money
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Documents
            </h2>
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger le contrat PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
