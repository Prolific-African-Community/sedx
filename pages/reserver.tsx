"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

/* ------------------ Utils ------------------ */
type ClassValue = string | false | null | undefined;
const cn = (...c: ClassValue[]) => c.filter(Boolean).join(" ");

/* ------------------ Types ------------------ */
type ServiceType =
  | "parking_pl"
  | "stockage_vehicule"
  | "stockage_materiel"
  | "atelier";

type Service = {
  id: ServiceType;
  title: string;
  unit: string;
  basePrice: number;
  description: string;
  shortLabel: string;
};

/* ------------------ Catalogue SED-X ------------------ */
const SERVICES: Service[] = [
  {
    id: "parking_pl",
    title: "Parking Poids Lourds",
    shortLabel: "Parking PL",
    unit: "jour",
    basePrice: 15,
    description: "Accès 24/7, zone sécurisée, proximité Belgique / Luxembourg.",
  },
  {
    id: "stockage_vehicule",
    title: "Stockage Véhicule",
    shortLabel: "Véhicules",
    unit: "mois",
    basePrice: 59,
    description: "Longue durée, accès contrôlé, site sécurisé.",
  },
  {
    id: "stockage_materiel",
    title: "Stockage Matériel / Palettes",
    shortLabel: "Marchandises",
    unit: "m³ / mois",
    basePrice: 6,
    description: "Stock tampon, palettes, flux e-commerce.",
  },
  {
    id: "atelier",
    title: "Location Atelier / Box",
    shortLabel: "Ateliers",
    unit: "mois",
    basePrice: 350,
    description: "Box privatif, électricité incluse, accès indépendant.",
  },
];

export default function SedxReservationPage() {
  const router = useRouter();
  const { service } = router.query;

  const [selectedServiceId, setSelectedServiceId] =
    useState<ServiceType | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);
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
    if (!selectedService) return null;

    if (selectedService.id === "stockage_materiel") {
      return selectedService.basePrice * surface * duration;
    }

    return selectedService.basePrice * quantity * duration;
  }, [selectedService, quantity, duration, surface]);

  const isFormValid = useMemo(() => {
    if (!selectedService) return false;
    if (!company || !email) return false;
    if (selectedService.id === "parking_pl" && !plate) return false;
    if (selectedService.id === "stockage_vehicule" && !vehicleType) return false;

    return true;
  }, [selectedService, company, email, plate, vehicleType]);

  const resetServiceDetails = (id: ServiceType) => {
    setSelectedServiceId(id);
    setQuantity(1);
    setDuration(1);
    setPlate("");
    setSurface(1);
    setVehicleType("");
  };

  const buildWhatsAppMessage = () => {
    if (!selectedService) return "";

    let detailsLines: string[] = [];

    switch (selectedService.id) {
      case "parking_pl":
        detailsLines = [`Plaque : ${plate}`, `Durée : ${duration} jour(s)`];
        break;
      case "stockage_vehicule":
        detailsLines = [
          `Type véhicule : ${vehicleType}`,
          `Durée : ${duration} mois`,
        ];
        break;
      case "stockage_materiel":
        detailsLines = [
          `Surface : ${surface} m²`,
          `Durée : ${duration} mois`,
        ];
        break;
      case "atelier":
        detailsLines = [`Durée : ${duration} mois`];
        break;
      default:
        detailsLines = [];
    }

    return [
      "Nouvelle demande SED-X",
      "",
      `Service : ${selectedService.title}`,
      ...detailsLines,
      "",
      "Client :",
      `Nom / Société : ${company}`,
      `Email : ${email}`,
      `Téléphone : ${phone || "Non renseigné"}`,
    ]
      .join("\n")
      .trim();
  };

  const handleWhatsApp = () => {
    if (!isFormValid) return;

    const phoneNumber = "352691280494";
    const message = encodeURIComponent(buildWhatsAppMessage());

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-5 py-5 text-black lg:px-8 lg:py-6">
      <div className="mx-auto max-w-[1500px]">
{/* Top bar */}
<div className="mb-6 flex items-center justify-between gap-6">
  <div className="flex items-center gap-4">
    <span className="h-[2px] w-9 bg-red-600" />
    <span className="text-[11px] font-black uppercase tracking-[0.22em] text-black">
      Réservation
    </span>
  </div>

  <button
    type="button"
    onClick={() => router.push("/")}
    aria-label="Fermer"
    className="group inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_45px_rgba(0,0,0,0.06)] transition hover:bg-black hover:text-white"
  >
    <span className="text-2xl leading-none transition group-hover:rotate-90">
      ×
    </span>
  </button>
</div>

        {/* Header */}
        <section className="mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            

            <h1 className="max-w-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] text-black">
              <span className="block text-[42px] sm:text-[56px] md:text-[70px] lg:text-[78px]">
                Réserver un espace
                <span className="text-red-600">.</span>
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
              Sélectionnez votre service, renseignez les détails utiles et
              envoyez votre demande via WhatsApp.
            </p>
          </div>

          <div className="hidden rounded-[28px] bg-black px-7 py-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.16)] lg:block lg:max-w-[420px]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
              Réponse rapide
            </p>
            <p className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.03em] text-white">
              Une demande claire.
              <span className="text-zinc-400"> Une réponse rapide.</span>
            </p>
          </div>
        </section>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Services */}
            <section className="rounded-[30px] border border-zinc-200/70 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.05)] md:p-6">
              <div className="mb-5 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                    01
                  </p>
                  <h2 className="mt-1 text-xl font-black uppercase tracking-[-0.04em] text-black md:text-2xl">
                    Service
                  </h2>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {SERVICES.map((s) => {
                  const active = selectedServiceId === s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => resetServiceDetails(s.id)}
                      className={cn(
                        "group relative min-h-[180px] overflow-hidden rounded-[24px] border p-5 text-left transition-all duration-300",
                        active
                          ? "border-red-600 bg-red-600/[0.035] shadow-[0_20px_60px_rgba(220,0,0,0.10)]"
                          : "border-zinc-200 bg-[#FAFAFA] hover:-translate-y-1 hover:border-red-600/30 hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute left-0 top-0 h-[3px] transition-all duration-300",
                          active
                            ? "w-full bg-red-600"
                            : "w-0 bg-red-600 group-hover:w-full"
                        )}
                      />

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={cn(
                              "text-[10px] font-black uppercase tracking-[0.14em]",
                              active ? "text-red-600" : "text-zinc-500"
                            )}
                          >
                            {s.shortLabel}
                          </p>

                          <h3 className="mt-2 text-[14px] font-black uppercase leading-5 tracking-[0.03em] text-black">
                            {s.title}
                          </h3>
                        </div>

                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
                            active
                              ? "bg-red-600 text-white"
                              : "bg-white text-zinc-400 group-hover:bg-black group-hover:text-white"
                          )}
                        >
                          {active ? "✓" : "→"}
                        </span>
                      </div>

                      <p className="mt-3 min-h-[44px] text-[12px] leading-5 text-zinc-600">
                        {s.description}
                      </p>

                      <div className="mt-4 border-t border-zinc-200 pt-4">
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-black leading-none tracking-[-0.05em] text-red-600">
                            {s.basePrice}€
                          </span>
                          <span className="pb-0.5 text-[11px] font-black uppercase text-black">
                            / {s.unit}
                          </span>
                        </div>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                          À partir de
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedService && (
              <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                {/* Parameters */}
                <section className="rounded-[30px] border border-zinc-200/70 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.05)] md:p-6">
                  <div className="mb-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                      02
                    </p>
                    <h2 className="mt-1 text-xl font-black uppercase tracking-[-0.04em] text-black md:text-2xl">
                      Paramètres
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    {selectedService.id === "parking_pl" && (
                      <>
                        <Field label="Plaque">
                          <input
                            placeholder="AA-123-BB"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value)}
                            className="input-premium"
                          />
                        </Field>

                        <Field label="Durée en jours">
                          <input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="input-premium"
                          />
                        </Field>
                      </>
                    )}

                    {selectedService.id === "stockage_vehicule" && (
                      <>
                        <Field label="Type de véhicule">
                          <input
                            placeholder="Voiture, utilitaire..."
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="input-premium"
                          />
                        </Field>

                        <Field label="Durée en mois">
                          <input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="input-premium"
                          />
                        </Field>
                      </>
                    )}

                    {selectedService.id === "stockage_materiel" && (
                      <>
                        <Field label="Surface en m³">
                          <input
                            type="number"
                            min={1}
                            value={surface}
                            onChange={(e) => setSurface(Number(e.target.value))}
                            className="input-premium"
                          />
                        </Field>

                        <Field label="Durée en mois">
                          <input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="input-premium"
                          />
                        </Field>
                      </>
                    )}

                    {selectedService.id === "atelier" && (
                      <Field label="Durée en mois">
                        <input
                          type="number"
                          min={1}
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="input-premium"
                        />
                      </Field>
                    )}
                  </div>
                </section>

                {/* Client */}
                <section className="rounded-[30px] border border-zinc-200/70 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.05)] md:p-6">
                  <div className="mb-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                      03
                    </p>
                    <h2 className="mt-1 text-xl font-black uppercase tracking-[-0.04em] text-black md:text-2xl">
                      Coordonnées
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                    <Field label="Nom / Société">
                      <input
                        placeholder="Votre nom ou société"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="input-premium"
                      />
                    </Field>

                    <Field label="Email">
                      <input
                        type="email"
                        placeholder="contact@entreprise.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-premium"
                      />
                    </Field>

                    <Field label="Téléphone">
                      <input
                        placeholder="+352 691 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-premium"
                      />
                    </Field>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="overflow-hidden rounded-[30px] bg-black text-white shadow-[0_26px_80px_rgba(0,0,0,0.22)]">
              <div className="relative p-6">
                <div className="absolute left-0 top-0 h-full w-[4px] bg-red-600" />

                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                  Synthèse
                </p>

                {selectedService ? (
                  <>
                    <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                      {selectedService.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {selectedService.description}
                    </p>

                    <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                      <SummaryLine
                        label="Service"
                        value={selectedService.shortLabel}
                      />

                      {estimatedPrice !== null && (
                        <SummaryLine
                          label="Estimation"
                          value={`${estimatedPrice}€`}
                          highlight
                        />
                      )}
                    </div>

                    <button
                      disabled={!isFormValid}
                      onClick={handleWhatsApp}
                      className={cn(
                        "mt-6 inline-flex w-full items-center justify-center gap-4 rounded-full px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-white transition",
                        isFormValid
                          ? "bg-red-600 hover:bg-white hover:text-black"
                          : "cursor-not-allowed bg-zinc-700 text-zinc-400"
                      )}
                    >
                      Envoyer sur WhatsApp
                      <span className="text-base leading-none">→</span>
                    </button>

                    <p className="mt-4 text-xs leading-5 text-zinc-500">
                      Tarifs indicatifs. Confirmation après échange.
                    </p>
                  </>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm leading-6 text-zinc-300">
                      Sélectionnez un service.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .input-premium {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(228 228 231);
          background: #fafafa;
          padding: 0.9rem 1rem;
          font-size: 0.875rem;
          color: #000;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-premium::placeholder {
          color: rgb(161 161 170);
        }

        .input-premium:focus {
          border-color: #dc0000;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(220, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.12em] text-zinc-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryLine({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </span>
      <span
        className={cn(
          "text-right text-sm font-black uppercase tracking-[0.06em]",
          highlight ? "text-red-500" : "text-white"
        )}
      >
        {value}
      </span>
    </div>
  );
}