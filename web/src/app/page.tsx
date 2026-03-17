import Link from "next/link";
import { mockVenues, formatXAF } from "@/lib/mock-data";

const featuredVenues = mockVenues.filter((v) => v.status === "Publié").slice(0, 3);

const steps = [
  {
    number: "01",
    title: "Publiez",
    description: "Ajoutez vos espaces publicitaires avec photos, localisation et tarifs.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Négociez",
    description: "Recevez des offres d'agences et négociez les meilleurs tarifs.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Activez",
    description: "Signez le contrat, payez en toute sécurité et lancez votre campagne.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "500+", label: "Emplacements" },
  { value: "120+", label: "Agences" },
  { value: "50M", label: "XAF de transactions" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">
              AdSpace <span className="text-accent">Connect</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-primary hover:bg-primary-light px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              Inscription
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-accent/5" />
          <div className="absolute -left-20 top-1/2 w-[400px] h-[400px] rounded-full bg-primary/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              La place de marché publicitaire #1 au Cameroun
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in">
              La plateforme publicitaire{" "}
              <span className="gradient-text">du Cameroun</span>
            </h1>

            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed">
              Connectez propriétaires d&apos;espaces publicitaires et agences.
              Panneaux, vitrines, véhicules — trouvez l&apos;emplacement idéal pour
              votre prochaine campagne.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link
                href="/register?role=owner"
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-light text-white text-base font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Je suis propriétaire
              </Link>
              <Link
                href="/register?role=agency"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-primary text-base font-semibold rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Je suis une agence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              En trois étapes simples, publiez vos espaces ou trouvez
              l&apos;emplacement parfait pour votre campagne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Step number */}
                <span className="absolute top-6 right-6 text-6xl font-bold text-gray-100 group-hover:text-accent/10 transition-colors">
                  {step.number}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Emplacements en vedette
              </h2>
              <p className="text-gray-500 max-w-xl">
                Découvrez les meilleurs emplacements publicitaires disponibles
                dans les grandes villes du Cameroun.
              </p>
            </div>
            <Link
              href="/dashboard/agency/search"
              className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVenues.map((venue) => (
              <div
                key={venue.id}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      📍 {venue.city}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold text-white bg-accent px-3 py-1 rounded-full">
                      {venue.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {venue.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{venue.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatXAF(venue.price)}
                    </span>
                    <span className="text-xs text-gray-400">/ mois</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-accent/10" />
          <div className="absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à développer votre activité publicitaire ?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez des centaines de propriétaires et d&apos;agences qui font déjà
            confiance à AdSpace Connect.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-accent hover:bg-accent-dark text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 animate-pulse-glow"
          >
            Commencer gratuitement
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">
                  AdSpace <span className="text-accent">Connect</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                La première plateforme de mise en relation entre propriétaires
                d&apos;espaces publicitaires et agences au Cameroun.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Plateforme</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard/agency/search" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Rechercher
                  </Link>
                </li>
                <li>
                  <Link href="/register?role=owner" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Publier un espace
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="text-gray-400 text-sm">contact@adspaceconnect.cm</li>
                <li className="text-gray-400 text-sm">+237 6 90 00 00 00</li>
                <li className="text-gray-400 text-sm">Douala, Cameroun</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 AdSpace Connect. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
