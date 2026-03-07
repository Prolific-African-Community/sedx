"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

// ======================
// Types
// ======================
type ServiceType =
  | "parking_pl"
  | "stockage_vehicule"
  | "stockage_materiel"
  | "atelier"
  | "logistique"
  | "recharge"
  | "boutique";

type Service = {
  id: ServiceType;
  title: string;
  unit: string;
  basePrice: number; // 0 = sur devis
  description: string;
};

// ======================
// Catalogue SED-X
// ======================
const SERVICES: Service[] = [
  {
    id: "parking_pl",
    title: "Parking Poids Lourds",
    unit: "jour",
    basePrice: 15,
    description: "Accès 24/7, zone sécurisée, proximité Belgique / Luxembourg.",
  },
  {
    id: "stockage_vehicule",
    title: "Stockage Véhicule",
    unit: "mois",
    basePrice: 69,
    description: "Longue durée, accès contrôlé, site sécurisé.",
  },
  {
    id: "stockage_materiel",
    title: "Stockage Matériel / Palettes",
    unit: "m² / mois",
    basePrice: 3,
    description: "Stock tampon, flux e-commerce.",
  },
  {
    id: "atelier",
    title: "Location Atelier / Box",
    unit: "mois",
    basePrice: 350,
    description: "Box privatif, électricité incluse.",
  },
  {
    id: "logistique",
    title: "Zone Import / Reconditionnement",
    unit: "sur devis",
    basePrice: 0,
    description: "Inspection, préparation VO.",
  },
  {
    id: "recharge",
    title: "Station de Recharge",
    unit: "session",
    basePrice: 5,
    description: "Bornes électriques accessibles 24/7.",
  },
  {
    id: "boutique",
    title: "Boutique Smart",
    unit: "",
    basePrice: 0,
    description: "Distributeurs automatiques.",
  },
];

export default function SedxReservationPage() {
  const router = useRouter();
  const { service } = router.query;

  const [selectedServiceId, setSelectedServiceId] =
    useState<ServiceType | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);

  // Champs dynamiques
  const [plate, setPlate] = useState("");
  const [surface, setSurface] = useState(1);
  const [vehicleType, setVehicleType] = useState("");

  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (service) {
      const exists = SERVICES.find((s) => s.id === service);
      if (exists) setSelectedServiceId(service as ServiceType);
    }
  }, [service]);

  const selectedService = useMemo(() => {
    return SERVICES.find((s) => s.id === selectedServiceId) ?? null;
  }, [selectedServiceId]);

  const estimatedPrice = useMemo(() => {
    if (!selectedService || selectedService.basePrice === 0) return null;

    if (selectedService.id === "stockage_materiel") {
      return selectedService.basePrice * surface * duration;
    }

    return selectedService.basePrice * quantity * duration;
  }, [selectedService, quantity, duration, surface]);

  return (
    <main className="min-h-screen bg-white text-black px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Réservation SED-X
        </h1>
        <p className="mt-4 text-zinc-600 max-w-2xl">
          Réservez et payez en ligne en quelques minutes.
        </p>

        {/* Étape 1 */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold">1. Service</h2>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedServiceId(s.id)}
                className={`text-left border rounded-2xl p-6 transition ${
                  selectedServiceId === s.id
                    ? "border-red-600 shadow-lg"
                    : "border-zinc-200 hover:shadow-md"
                }`}
              >
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-zinc-600 mt-2">{s.description}</p>
                {s.basePrice > 0 ? (
                  <p className="mt-3 text-red-600 font-semibold">
                    À partir de {s.basePrice}€ / {s.unit}
                  </p>
                ) : (
                  <p className="mt-3 text-zinc-500 font-semibold">
                    Sur devis
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>

        {selectedService && (
          <>
            {/* Étape 2 */}
            <section className="mt-16">
              <h2 className="text-2xl font-semibold">2. Paramètres</h2>

              <div className="mt-6 grid md:grid-cols-3 gap-6">
                {selectedService.id === "parking_pl" && (
                  <>
                    <input
                      placeholder="Plaque d'immatriculation"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-4 py-3"
                    />
                    <input
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="Nombre de jours"
                      className="border border-zinc-300 rounded-lg px-4 py-3"
                    />
                  </>
                )}

                {selectedService.id === "stockage_vehicule" && (
                  <>
                    <input
                      placeholder="Type de véhicule"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-4 py-3"
                    />
                    <input
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="Nombre de mois"
                      className="border border-zinc-300 rounded-lg px-4 py-3"
                    />
                  </>
                )}

                {selectedService.id === "stockage_materiel" && (
                  <>
                    <input
                      type="number"
                      min={1}
                      value={surface}
                      onChange={(e) => setSurface(Number(e.target.value))}
                      placeholder="Surface en m²"
                      className="border border-zinc-300 rounded-lg px-4 py-3"
                    />
                    <input
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="Nombre de mois"
                      className="border border-zinc-300 rounded-lg px-4 py-3"
                    />
                  </>
                )}

                {selectedService.id === "atelier" && (
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    placeholder="Durée en mois"
                    className="border border-zinc-300 rounded-lg px-4 py-3"
                  />
                )}

                {selectedService.id === "recharge" && (
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Nombre de sessions"
                    className="border border-zinc-300 rounded-lg px-4 py-3"
                  />
                )}
              </div>
            </section>

            {/* Étape 3 */}
            <section className="mt-16 bg-zinc-900 text-white rounded-2xl p-10">
              <h2 className="text-2xl font-semibold">3. Paiement & Informations</h2>

              <div className="mt-6 grid md:grid-cols-3 gap-6">
                <input
                  placeholder="Nom / Société"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="px-4 py-3 rounded-lg text-black"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg text-black"
                />
                <input
                  placeholder="Téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-3 rounded-lg text-black"
                />
              </div>

              <div className="mt-8 border-t border-zinc-700 pt-6">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span>{selectedService.title}</span>
                </div>

                {estimatedPrice !== null ? (
                  <div className="flex justify-between mt-2">
                    <span>Total estimé</span>
                    <strong className="text-red-500 text-xl">
                      {estimatedPrice}€
                    </strong>
                  </div>
                ) : (
                  <div className="mt-2 text-red-400">Sur devis</div>
                )}
              </div>

              <button className="mt-8 w-full bg-red-600 hover:bg-red-700 transition rounded-full py-4 font-semibold">
                Payer & Confirmer (Stripe à connecter)
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
