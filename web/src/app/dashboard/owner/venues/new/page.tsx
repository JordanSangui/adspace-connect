"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatXAF, type VenueType } from "@/lib/mock-data";
import { useAppStore } from "@/store/useAppStore";

const venueTypes: { value: VenueType; label: string; desc: string }[] = [
  { value: "Panneau fixe", label: "Panneau fixe", desc: "Panneau statique" },
  { value: "Mobile", label: "Mobile", desc: "Véhicule / bus" },
  { value: "Vitrine", label: "Vitrine", desc: "Espace en magasin" },
];

export default function NewVenuePage() {
  const router = useRouter();
  const addVenue = useAppStore((s) => s.addVenue);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "" as VenueType | "",
    title: "",
    description: "",
    address: "",
    city: "Douala",
    price: "",
    availableFrom: "",
    availableTo: "",
    dimensions: "",
  });

  const totalSteps = 4;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.type && formData.title && formData.description;
      case 2:
        return formData.address && formData.city;
      case 3:
        return formData.price && formData.availableFrom && formData.availableTo;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!formData.type) return;
    addVenue({
      title: formData.title,
      description: formData.description,
      type: formData.type as VenueType,
      address: formData.address,
      city: formData.city,
      price: Number(formData.price),
      ownerId: "owner-1",
      ownerName: "Jean-Pierre Kamga",
      availableFrom: formData.availableFrom,
      availableTo: formData.availableTo,
      dimensions: formData.dimensions || undefined,
    });
    router.push("/dashboard/owner/venues");
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/owner/venues"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux emplacements
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Nouvel emplacement
        </h1>
        <p className="text-gray-500 mt-1">
          Ajoutez un nouvel espace publicitaire en 4 étapes.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === currentStep
                  ? "bg-primary text-white shadow-md ring-4 ring-primary/20"
                  : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {step < currentStep ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                  step < currentStep ? "bg-green-500" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-lg font-bold text-gray-900">
              Type & description
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type d&apos;emplacement *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {venueTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateField("type", type.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      formData.type === type.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-900 block">
                      {type.label}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      {type.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Ex: Panneau Grand Format - Rond-point Deïdo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Décrivez l'emplacement, sa visibilité, le trafic..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Localisation</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Ex: Rond-point Deïdo, Boulevard de la Liberté"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <select
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Bafoussam">Bafoussam</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => updateField("dimensions", e.target.value)}
                placeholder="Ex: 4m x 3m"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 h-48 flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-400">
                Carte interactive (à venir)
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-lg font-bold text-gray-900">
              Tarif & disponibilité
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix mensuel (XAF) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="350000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  XAF
                </span>
              </div>
              {formData.price && (
                <p className="text-xs text-gray-400 mt-1">
                  = {formatXAF(Number(formData.price))}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponible à partir du *
                </label>
                <input
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => updateField("availableFrom", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jusqu&apos;au *
                </label>
                <input
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => updateField("availableTo", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-lg font-bold text-gray-900">
              Récapitulatif
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {formData.type || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Titre</span>
                <span className="text-sm font-medium text-gray-900">
                  {formData.title || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ville</span>
                <span className="text-sm font-medium text-gray-900">
                  {formData.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Adresse</span>
                <span className="text-sm font-medium text-gray-900">
                  {formData.address || "—"}
                </span>
              </div>
              {formData.dimensions && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Dimensions</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.dimensions}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Prix mensuel
                </span>
                <span className="text-lg font-bold text-primary">
                  {formData.price
                    ? formatXAF(Number(formData.price))
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Disponibilité</span>
                <span className="text-sm font-medium text-gray-900">
                  {formData.availableFrom || "—"} → {formData.availableTo || "—"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Votre emplacement sera soumis à une vérification par notre équipe
              de modération avant d&apos;être publié.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Précédent
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed()}
              className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              Soumettre l&apos;emplacement
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
