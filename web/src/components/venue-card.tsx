import Link from "next/link";
import { formatXAF, type Venue } from "@/lib/mock-data";

interface VenueCardProps {
  venue: Venue;
  showActions?: boolean;
  showOfferButton?: boolean;
  onMakeOffer?: (venue: Venue) => void;
}

const statusColors: Record<string, string> = {
  Brouillon: "bg-gray-100 text-gray-700",
  "En révision": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Publié: "bg-green-50 text-green-700 border border-green-200",
  Refusé: "bg-red-50 text-red-700 border border-red-200",
};

const typeColors: Record<string, string> = {
  "Panneau fixe": "bg-blue-50 text-blue-700",
  Mobile: "bg-purple-50 text-purple-700",
  Vitrine: "bg-amber-50 text-amber-700",
};

export default function VenueCard({
  venue,
  showActions = false,
  showOfferButton = false,
  onMakeOffer,
}: VenueCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={venue.image}
          alt={venue.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[venue.type] || "bg-gray-100 text-gray-700"}`}
          >
            {venue.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[venue.status] || "bg-gray-100 text-gray-700"}`}
          >
            {venue.status}
          </span>
        </div>

        {/* City */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {venue.city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {venue.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
          {venue.address}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {formatXAF(venue.price)}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ mois</span>
          </div>
          {venue.dimensions && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              {venue.dimensions}
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <Link
              href={`/dashboard/owner/venues/${venue.id}`}
              className="flex-1 text-center text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg py-2 transition-colors"
            >
              Modifier
            </Link>
            <button className="flex-1 text-sm font-medium text-gray-500 hover:text-danger hover:bg-danger-light rounded-lg py-2 transition-colors">
              Supprimer
            </button>
          </div>
        )}

        {showOfferButton && (
          <button
            onClick={() => onMakeOffer?.(venue)}
            className="w-full mt-4 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            Faire une offre
          </button>
        )}
      </div>
    </div>
  );
}
