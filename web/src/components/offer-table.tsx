import { formatXAF, formatDate, type Offer } from "@/lib/mock-data";

interface OfferTableProps {
  offers: Offer[];
  perspective: "owner" | "agency";
  onAccept?: (offer: Offer) => void;
  onReject?: (offer: Offer) => void;
  onCounterOffer?: (offer: Offer) => void;
  onViewContract?: (offer: Offer) => void;
}

const statusStyles: Record<string, string> = {
  "En attente": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Acceptée: "bg-green-50 text-green-700 border border-green-200",
  Refusée: "bg-red-50 text-red-700 border border-red-200",
  "Contre-offre": "bg-blue-50 text-blue-700 border border-blue-200",
};

export default function OfferTable({
  offers,
  perspective,
  onAccept,
  onReject,
  onCounterOffer,
  onViewContract,
}: OfferTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {perspective === "owner" ? (
                <>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Agence
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Emplacement
                  </th>
                </>
              ) : (
                <>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Emplacement
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Ville
                  </th>
                </>
              )}
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Prix proposé
              </th>
              {perspective === "agency" && (
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Contre-offre
                </th>
              )}
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Période
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Statut
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Date
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {perspective === "owner" ? (
                  <>
                    <td className="px-6 py-4">
                      <span className="font-medium text-sm text-gray-900">
                        {offer.agencyName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {offer.venueTitle}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <span className="font-medium text-sm text-gray-900">
                        {offer.venueTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {offer.venueCity}
                      </span>
                    </td>
                  </>
                )}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatXAF(offer.proposedPrice)}
                  </span>
                </td>
                {perspective === "agency" && (
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {offer.counterOfferPrice
                        ? formatXAF(offer.counterOfferPrice)
                        : "—"}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-500">
                    {formatDate(offer.startDate)} →{" "}
                    {formatDate(offer.endDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[offer.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {offer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-400">
                    {formatDate(offer.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {perspective === "owner" &&
                      offer.status === "En attente" && (
                        <>
                          <button
                            onClick={() => onAccept?.(offer)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => onReject?.(offer)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Refuser
                          </button>
                          <button
                            onClick={() => onCounterOffer?.(offer)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            Contre-offre
                          </button>
                        </>
                      )}
                    {perspective === "agency" &&
                      offer.status === "Contre-offre" && (
                        <>
                          <button
                            onClick={() => onAccept?.(offer)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => onReject?.(offer)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                    {offer.status === "Acceptée" && (
                      <button
                        onClick={() => onViewContract?.(offer)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        Voir contrat
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {offers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Aucune offre pour le moment</p>
        </div>
      )}
    </div>
  );
}
