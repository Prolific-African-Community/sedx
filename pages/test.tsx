"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------ Utils ------------------ */
type ClassValue = string | false | null | undefined;
const cn = (...c: ClassValue[]) => c.filter(Boolean).join(" ");

/* ------------------ Types ------------------ */
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
  desc: string;
  price: string;
  unit: string;
  period: string;
  category: "main" | "secondary";
  icon: JSX.Element;
};

/* ------------------ Services ------------------ */
const SERVICES: Service[] = [
  {
    id: "stockage_materiel",
    title: "Stockage marchandises",
    desc: "Des espaces sécurisés et modulables pour stocker vos marchandises en toute sérénité.",
    price: "6€",
    unit: "/ m³",
    period: "par mois",
    category: "main",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
        <path d="M40 10L62 22.5V47.5L40 60L18 47.5V22.5L40 10Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 22.5L40 35L62 22.5" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 35V60" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M53 30V43" stroke="#DC0000" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "stockage_vehicule",
    title: "Stockage véhicules",
    desc: "Des espaces adaptés pour la mise en sécurité de véhicules, toutes tailles confondues.",
    price: "59€",
    unit: "/ véhicule",
    period: "par mois",
    category: "main",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
        <path d="M20 42L26 28H54L60 42" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M16 42H64V54H16V42Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M29 42H51" stroke="#DC0000" strokeWidth="4" strokeLinecap="round" />
        <circle cx="28" cy="56" r="5" stroke="currentColor" strokeWidth="3" />
        <circle cx="52" cy="56" r="5" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "parking_pl",
    title: "Parking poids lourds sécurisé",
    desc: "Un parking sécurisé 24/7 avec accès contrôlé et services dédiés aux chauffeurs.",
    price: "15€",
    unit: "/ nuit",
    period: "par nuit",
    category: "main",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
        <path d="M12 47H46V28H12V47Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M46 47H68V38L60 30H46V47Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M16 47H40" stroke="#DC0000" strokeWidth="4" strokeLinecap="round" />
        <circle cx="25" cy="52" r="5" stroke="currentColor" strokeWidth="3" />
        <circle cx="58" cy="52" r="5" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "atelier",
    title: "Location de boxes & ateliers",
    desc: "Des boxes et ateliers flexibles pour entrepreneurs, artisans et entreprises en quête d’espace.",
    price: "400€",
    unit: "/ mois",
    period: "à partir de",
    category: "main",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
        <path d="M16 38L40 20L64 38V64H16V38Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M29 64V43H51V64" stroke="#DC0000" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "recharge",
    title: "Centrale de superchargeurs",
    desc: "Rechargez vos véhicules électriques en toute rapidité grâce à nos bornes haute puissance.",
    price: "Sur place",
    unit: "",
    period: "",
    category: "secondary",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
        <path d="M45 8L18 44H38L31 72L62 34H43L45 8Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 44H45" stroke="#DC0000" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "boutique",
    title: "Walk in distributeur",
    desc: "Un distributeur automatique grand format 24/7 avec nourritures et produits utiles.",
    price: "Cashless",
    unit: "",
    period: "",
    category: "secondary",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
        <path d="M15 18H23L30 53H61L68 29H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="34" cy="64" r="5" stroke="currentColor" strokeWidth="3" />
        <circle cx="57" cy="64" r="5" stroke="currentColor" strokeWidth="3" />
        <path d="M32 53H61" stroke="#DC0000" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ------------------ Page ------------------ */
export default function SedxHome() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const [reservationOpen, setReservationOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceType>("parking_pl");

  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0],
    [selectedServiceId]
  );

  const isFormValid = company.trim() !== "" && email.trim() !== "";

  const openReservation = (serviceId?: ServiceType) => {
    if (serviceId) setSelectedServiceId(serviceId);
    setReservationOpen(true);
    setMenuOpen(false);
  };

  const closeReservation = () => setReservationOpen(false);

  const handleWhatsApp = () => {
    if (!isFormValid) return;

    const lines = [
      "Nouvelle demande SED-X",
      "",
      `Service : ${selectedService.title}`,
      "",
      `Nom / Société : ${company}`,
      `Email : ${email}`,
      `Téléphone : ${phone || "Non renseigné"}`,
      "",
      `Message : ${message || "Non renseigné"}`,
    ];

    const phoneNumber = "352691280494";
    const text = encodeURIComponent(lines.join("\n"));

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-white text-black selection:bg-red-600 selection:text-white">
      {/* HEADER */}
      <header
        className={cn(
          "fixed left-0 top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl"
            : "bg-white/95 backdrop-blur-md"
        )}
      >
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center no-underline">
            <img src="/logosedx.png" alt="SED-X logo" className="h-16 w-auto" />
          </a>

          <div className="hidden items-center gap-10 lg:flex">
            {[
              { label: "Solutions", href: "#services" },
              { label: "Avantages", href: "#avantages" },
              { label: "Processus", href: "#processus" },
              { label: "À propos", href: "#qui-sommes-nous" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] font-black uppercase tracking-[0.12em] text-zinc-800 no-underline transition hover:text-red-600"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openReservation()}
            className="hidden rounded-full bg-black px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.20)] transition hover:bg-red-600 lg:inline-flex"
          >
            Réserver un espace
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Ouvrir le menu"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-black lg:hidden"
          >
            <span className={cn("absolute h-0.5 w-5 bg-white transition-all duration-300", menuOpen ? "rotate-45" : "-translate-y-1.5")} />
            <span className={cn("absolute h-0.5 w-5 bg-white transition-all duration-300", menuOpen ? "opacity-0" : "opacity-100")} />
            <span className={cn("absolute h-0.5 w-5 bg-white transition-all duration-300", menuOpen ? "-rotate-45" : "translate-y-1.5")} />
          </button>
        </nav>

        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
              <img src="/logosedx.png" alt="SED-X logo" className="h-12 w-auto" />

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-2xl leading-none text-white"
              >
                ×
              </button>
            </div>

            <div className="flex h-[calc(100vh-82px)] flex-col justify-between px-6 py-10">
              <div className="flex flex-col gap-7">
                {[
                  { label: "Solutions", href: "#services" },
                  { label: "Avantages", href: "#avantages" },
                  { label: "Processus", href: "#processus" },
                  { label: "À propos", href: "#qui-sommes-nous" },
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-zinc-200 pb-5 text-4xl font-black uppercase tracking-tight text-black no-underline"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openReservation()}
                className="inline-flex w-full items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-600"
              >
                Réserver un espace
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-0">
        <div className="relative mx-auto grid min-h-[calc(100vh-285px)] max-w-[1640px] grid-cols-1 items-center gap-4 px-6 pb-0 pt-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-10">
          <div
            className="relative z-20 max-w-4xl transition-all duration-700 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.025}px)`,
              opacity: Math.max(0.7, 1 - scrollY * 0.0007),
            }}
          >
            <div className="mb-7 flex items-center gap-5">
              <span className="h-[2px] w-14 bg-red-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.42em] text-black">
                La base
              </span>
            </div>

            <h1 className="max-w-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] text-black">
              <span className="block text-[48px] sm:text-[66px] md:text-[84px] lg:text-[94px] xl:text-[112px]">Votre</span>
              <span className="block text-[48px] sm:text-[66px] md:text-[84px] lg:text-[94px] xl:text-[112px]">stockage.</span>
              <span className="block text-[48px] sm:text-[66px] md:text-[84px] lg:text-[94px] xl:text-[112px]">
                <span className="text-red-600">Notre</span>
              </span>
              <span className="block text-[48px] sm:text-[66px] md:text-[84px] lg:text-[94px] xl:text-[112px]">priorité.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-700 md:text-lg">
              Des espaces sécurisés, flexibles et accessibles pour stocker ce qui compte vraiment.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openReservation()}
                className="group inline-flex items-center justify-center gap-5 rounded-full bg-black px-8 py-4 text-[11px] font-black uppercase tracking-[0.07em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] transition hover:bg-red-600"
              >
                Réserver un espace
                <span className="text-lg leading-none transition group-hover:translate-x-1">→</span>
              </button>

              <a
                href="#contact"
                className="inline-flex w-fit border-b-2 border-red-600 pb-2 text-[11px] font-black uppercase tracking-[0.07em] text-black no-underline transition hover:text-red-600"
              >
                Parler à un expert
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-4 min-h-[420px] overflow-visible lg:mt-0 lg:min-h-[760px]">
            <div className="absolute bottom-[-2%] right-[-10%] h-[94%] w-[122%] lg:bottom-[-3%] lg:right-[-13%] lg:h-[98%] lg:w-[126%]">
              <img
                src="/hero123.png"
                alt="SED-X stockage industriel"
                className="h-full w-full object-contain object-center"
              />
            </div>
          </div>
        </div>

        <div id="avantages" className="relative z-30 mx-auto max-w-[1380px] px-6 pb-8 lg:-mt-6 lg:px-10 lg:pb-10">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Sécurité 24/7", "Site surveillé"],
              ["Espaces modulables", "Surfaces flexibles"],
              ["Accès flexible", "24h/24 — 7j/7"],
              ["Emplacement stratégique", "Frontière BE / LU"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-[24px] border border-zinc-200/80 bg-white px-7 py-7 shadow-[0_18px_55px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:shadow-[0_28px_80px_rgba(0,0,0,0.10)]"
              >
                <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.1em] text-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative overflow-hidden bg-[#FAFAFA] px-6 py-24 text-black lg:px-10 lg:py-28">
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-[2px] w-9 bg-red-600" />
              <span className="text-[12px] font-black uppercase tracking-[0.22em] text-black">
                Des solutions
              </span>
              <span className="h-[2px] w-9 bg-red-600" />
            </div>

            <h2 className="mx-auto max-w-6xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-black">
              <span className="block text-[42px] sm:text-[56px] md:text-[70px] lg:text-[78px] xl:text-[86px]">
                Adaptées
              </span>
              <span className="block text-[42px] sm:text-[56px] md:text-[70px] lg:text-[78px] xl:text-[86px]">
                à <span className="text-red-600">vos besoins.</span>
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
              Espaces sécurisés, flexibles et équipés pour accompagner vos activités, aujourd’hui comme demain.
            </p>
          </div>

          <div className="mt-20 grid gap-7 lg:grid-cols-[130px_1fr]">
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <span className="mb-4 block h-[2px] w-5 bg-red-600" />
                <p className="text-[12px] font-black uppercase leading-5 tracking-[0.12em] text-black">
                  Nos services principaux
                </p>
                <div className="mt-8 h-[210px] w-px bg-zinc-300" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {SERVICES.filter((s) => s.category === "main").map((service) => (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => openReservation(service.id)}
                  className="group relative flex min-h-[318px] flex-col overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white p-8 text-left text-black shadow-[0_24px_80px_rgba(0,0,0,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:bg-white hover:shadow-[0_36px_100px_rgba(0,0,0,0.10)]"
                >
                  <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />

                  <div className="mb-7 flex items-start gap-5">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-zinc-200 bg-[#FAFAFA] text-black transition duration-300 group-hover:border-red-600/25 group-hover:text-red-600">
                      {service.icon}
                    </div>

                    <h3 className="max-w-[220px] pt-1 text-[16px] font-black uppercase leading-6 tracking-[0.04em] text-black">
                      {service.title}
                    </h3>
                  </div>

                  <p className="min-h-[76px] text-[13px] leading-6 text-zinc-600">
                    {service.desc}
                  </p>

                  <div className="my-7 h-px w-full bg-zinc-200" />

                  <div className="mt-auto">
                    <div className="flex items-end gap-2">
                      <span className="text-[44px] font-black leading-none tracking-[-0.06em] text-red-600">
                        {service.price}
                      </span>
                      <span className="pb-1 text-[13px] font-black uppercase text-black">
                        {service.unit}
                      </span>
                    </div>

                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                      {service.period}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[130px_1fr]">
            <div className="hidden lg:block">
              <span className="mb-4 block h-[2px] w-5 bg-red-600" />
              <p className="text-[12px] font-black uppercase leading-5 tracking-[0.12em] text-black">
                Services sur place
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {SERVICES.filter((s) => s.category === "secondary").map((service) => (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => openReservation(service.id)}
                  className="group relative grid min-h-[136px] grid-cols-[78px_1fr_72px] items-center gap-6 overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white px-8 py-6 text-left text-black shadow-[0_20px_70px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:shadow-[0_32px_90px_rgba(0,0,0,0.09)]"
                >
                  <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-200 bg-[#FAFAFA] text-black transition duration-300 group-hover:border-red-600/25 group-hover:text-red-600">
                    {service.icon}
                  </div>

                  <div>
                    <h3 className="text-[15px] font-black uppercase tracking-[0.06em] text-black">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[13px] leading-6 text-zinc-600">
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex h-full items-center justify-end border-l border-zinc-200 pl-6">
                    <span className="text-3xl leading-none text-red-600 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL RESERVATION */}
      {reservationOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            onClick={closeReservation}
            aria-label="Fermer"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          <div className="absolute inset-x-4 top-1/2 mx-auto max-h-[92vh] max-w-5xl -translate-y-1/2 overflow-y-auto rounded-[34px] bg-[#FAFAFA] shadow-[0_40px_140px_rgba(0,0,0,0.35)]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden bg-black p-8 text-white md:p-10">
                <div className="absolute left-0 top-0 h-full w-[4px] bg-red-600" />

                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                    Réservation
                  </p>

                  <h3 className="mt-6 max-w-xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                    <span className="block text-[42px] sm:text-[54px] lg:text-[62px]">
                      Votre espace.
                    </span>
                    <span className="block text-[42px] sm:text-[54px] lg:text-[62px]">
                      Notre <span className="text-red-500">réponse.</span>
                    </span>
                  </h3>

                  <div className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-500">
                      Service sélectionné
                    </p>
                    <p className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                      {selectedService.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {selectedService.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative bg-white p-8 md:p-10">
                <button
                  type="button"
                  onClick={closeReservation}
                  aria-label="Fermer"
                  className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAFA] text-2xl leading-none text-black transition hover:bg-black hover:text-white"
                >
                  ×
                </button>

                <div className="pr-14">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                    Demande rapide
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((service) => {
                    const active = selectedServiceId === service.id;

                    return (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition",
                          active
                            ? "border-red-600 bg-red-600/[0.04]"
                            : "border-zinc-200 bg-[#FAFAFA] hover:border-zinc-400"
                        )}
                      >
                        <p className={cn("text-[11px] font-black uppercase tracking-[0.1em]", active ? "text-red-600" : "text-black")}>
                          {service.title}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <form
                  className="mt-8 space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleWhatsApp();
                  }}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                        Nom / Société
                      </label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Votre nom ou société"
                        className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@entreprise.com"
                        className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+352 691 000 000"
                      className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Durée, surface, nombre de véhicules, accès souhaité, transport éventuel..."
                      className="w-full resize-none rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
                    />
                  </div>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={`/reserver?service=${selectedServiceId}`}
                      className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-500 no-underline transition hover:text-red-600"
                    >
                      Formulaire complet →
                    </a>

                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={cn(
                        "inline-flex shrink-0 items-center justify-center gap-4 rounded-full px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-white outline-none transition",
                        isFormValid ? "bg-black hover:bg-red-600" : "cursor-not-allowed bg-zinc-400"
                      )}
                    >
                      Envoyer sur WhatsApp
                      <span className="text-base leading-none">→</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROCESSUS */}
<section
  id="processus"
  className="relative overflow-hidden bg-[#FAFAFA] px-6 py-24 text-black lg:px-10 lg:py-28"
>
  <div className="relative z-10 mx-auto max-w-[1500px]">
    {/* HEADER */}
    <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
      {/* Left content */}
      <div className="relative z-20">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-[2px] w-9 bg-red-600" />
          <span className="text-[12px] font-black uppercase tracking-[0.22em] text-black">
            Processus
          </span>
        </div>

        <h2 className="max-w-4xl font-black uppercase leading-[0.9] tracking-[-0.065em] text-black">
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px]">
            Un processus
          </span>
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px]">
            simple, efficace
          </span>
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px]">
            et <span className="text-red-600">sur mesure.</span>
          </span>
        </h2>

        <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
          Chez SED-X, nous avons conçu un parcours fluide et transparent pour
          répondre à vos besoins de stockage, transport et logistique. De la
          demande initiale à la mise en place, chaque étape est structurée avec
          rigueur et réactivité.
        </p>

        <a
          href="/reserver"
          className="mt-10 inline-flex w-fit items-center gap-6 border-b-2 border-red-600 pb-2 text-[12px] font-black uppercase tracking-[0.08em] text-black no-underline transition hover:text-red-600"
        >
          Démarrer ma demande
          <span className="text-xl leading-none text-red-600">→</span>
        </a>
      </div>

      {/* Right image */}
      <div className="relative hidden min-h-[560px] lg:block">
        <div className="absolute inset-0 overflow-hidden rounded-[76px]">
          <img
            src="/process-bg2.png"
            alt="Processus SED-X"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale"
          />

          {/* soft global balance */}
          <div className="absolute inset-0 bg-[#FAFAFA]/10" />

          {/* left fade */}
          <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/65 to-transparent" />

          {/* right fade */}
          <div className="absolute inset-y-0 right-0 w-[24%] bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/65 to-transparent" />

          {/* top fade */}
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/50 to-transparent" />

          {/* bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent" />
        </div>
      </div>
    </div>

    {/* TIMELINE */}
    <div className="mt-20">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
        {[
          {
            step: "01",
            title: "Demande & conseil",
            desc: "Vous nous expliquez vos besoins. Nos équipes vous orientent vers la solution la plus adaptée.",
            icon: (
              <svg viewBox="0 0 80 80" fill="none" className="h-10 w-10">
                <path
                  d="M18 24C18 17.4 23.4 12 30 12H50C56.6 12 62 17.4 62 24V38C62 44.6 56.6 50 50 50H38L24 61V50C20.6 50 18 47.4 18 44V24Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle cx="31" cy="32" r="3" fill="#DC0000" />
                <circle cx="40" cy="32" r="3" fill="#DC0000" />
                <circle cx="49" cy="32" r="3" fill="#DC0000" />
              </svg>
            ),
          },
          {
            step: "02",
            title: "Offre personnalisée",
            desc: "Nous vous transmettons une proposition claire, adaptée à vos exigences et à votre budget.",
            icon: (
              <svg viewBox="0 0 80 80" fill="none" className="h-10 w-10">
                <path
                  d="M24 12H48L60 24V66H24V12Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M48 12V25H60"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M34 42L40 48L51 35"
                  stroke="#DC0000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          },
          {
            step: "03",
            title: "Planification",
            desc: "Nous organisons la réservation de l’espace, les accès et les ressources nécessaires.",
            icon: (
              <svg viewBox="0 0 80 80" fill="none" className="h-10 w-10">
                <path
                  d="M18 22H62V64H18V22Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M18 34H62" stroke="currentColor" strokeWidth="3" />
                <path
                  d="M29 14V26"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M51 14V26"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="31" cy="45" r="2.5" fill="#DC0000" />
                <circle cx="40" cy="45" r="2.5" fill="#DC0000" />
                <circle cx="49" cy="45" r="2.5" fill="#DC0000" />
                <circle cx="31" cy="54" r="2.5" fill="#DC0000" />
                <circle cx="40" cy="54" r="2.5" fill="#DC0000" />
                <circle cx="49" cy="54" r="2.5" fill="#DC0000" />
              </svg>
            ),
          },
          {
            step: "04",
            title: "Réception & stockage",
            desc: "Vos marchandises ou véhicules sont réceptionnés et stockés dans des espaces surveillés.",
            icon: (
              <svg viewBox="0 0 80 80" fill="none" className="h-10 w-10">
                <path
                  d="M16 38L40 20L64 38V64H16V38Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M29 64V44H51V64"
                  stroke="#DC0000"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          },
          {
            step: "05",
            title: "Transport & logistique",
            desc: "Nous pouvons gérer collecte, acheminement, distribution et suivi opérationnel.",
            icon: (
              <svg viewBox="0 0 80 80" fill="none" className="h-10 w-10">
                <path
                  d="M12 47H46V28H12V47Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M46 47H68V38L60 30H46V47Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle
                  cx="25"
                  cy="52"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  cx="58"
                  cy="52"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M16 47H40"
                  stroke="#DC0000"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            ),
          },
          {
            step: "06",
            title: "Suivi & optimisation",
            desc: "Un suivi régulier assure la performance, la réactivité et l’optimisation de votre solution.",
            icon: (
              <svg viewBox="0 0 80 80" fill="none" className="h-10 w-10">
                <circle
                  cx="40"
                  cy="40"
                  r="27"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M29 40L37 48L52 31"
                  stroke="#DC0000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          },
        ].map((item) => (
          <div
            key={item.step}
            className="group relative rounded-[26px] border border-zinc-200/70 bg-white p-7 shadow-[0_18px_55px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-red-600/25 hover:shadow-[0_28px_80px_rgba(0,0,0,0.08)] xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none xl:hover:translate-y-0 xl:hover:shadow-none"
          >
            {/* Step row */}
            <div className="mb-8 flex items-center gap-4">
              <span className="shrink-0 text-[16px] font-black text-red-600">
                {item.step}
              </span>

              <span className="relative h-px flex-1 bg-zinc-200">
                <span className="absolute left-0 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full border border-zinc-300 bg-[#FAFAFA] transition group-hover:border-red-600 group-hover:bg-red-600 xl:block" />
              </span>
            </div>

            {/* Icon */}
            <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-white text-black shadow-[0_18px_50px_rgba(0,0,0,0.055)] transition duration-300 group-hover:border-red-600/25 group-hover:text-red-600 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
              {item.icon}
            </div>

            {/* Content */}
            <h3 className="min-h-[42px] max-w-[240px] text-[14px] font-black uppercase leading-5 tracking-[0.06em] text-black">
              {item.title}
            </h3>

            <p className="mt-4 max-w-[250px] text-[13px] leading-6 text-zinc-600">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


{/* QUI SOMMES-NOUS */}
<section
  id="qui-sommes-nous"
  className="relative overflow-hidden bg-[#FAFAFA] px-6 py-24 text-black lg:px-10 lg:py-32"
>


  <div className="relative z-10 mx-auto max-w-[1500px]">
    {/* Top grid */}
    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      {/* Left manifesto */}
      <div>
        <div className="mb-8 flex items-center gap-4">
          <span className="h-[2px] w-9 bg-red-600" />
          <span className="text-[12px] font-black uppercase tracking-[0.22em] text-black">
            Qui sommes-nous
          </span>
        </div>

        <h2 className="max-w-4xl font-black uppercase leading-[0.9] tracking-[-0.065em] text-black">
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px]">
            Une base
          </span>
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px]">
            industrielle
          </span>
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px]">
            pensée pour
          </span>
          <span className="block text-[48px] sm:text-[64px] md:text-[78px] lg:text-[82px] xl:text-[92px] text-red-600">
            avancer.
          </span>
        </h2>

        <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
          SED-X est un hub de stockage, de parking et de logistique conçu pour
          les entreprises, indépendants, transporteurs et porteurs de projets qui
          veulent une solution simple, rapide et fiable.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/reserver"
            className="inline-flex items-center justify-center gap-5 rounded-full bg-black px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-white no-underline shadow-[0_20px_55px_rgba(0,0,0,0.16)] transition hover:bg-red-600"
          >
            Réserver un espace
            <span className="text-lg leading-none">→</span>
          </a>

          <a
            href="#contact"
            className="inline-flex w-fit border-b-2 border-red-600 pb-2 text-[12px] font-black uppercase tracking-[0.08em] text-black no-underline transition hover:text-red-600"
          >
            Parler à un expert
          </a>
        </div>
      </div>

      {/* Right editorial card */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-[34px] border border-zinc-200/70 bg-white p-8 shadow-[0_30px_100px_rgba(0,0,0,0.07)] md:p-10 lg:p-12">

          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-red-600 via-red-600/40 to-transparent" />

          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-red-600">
            Notre conviction
          </p>

          <blockquote className="mt-6 max-w-3xl text-2xl font-black leading-tight tracking-[-0.035em] text-black md:text-4xl">
            “Le stockage ne doit pas être compliqué. L’espace, la sécurité et le
            transport doivent fonctionner ensemble.”
          </blockquote>

          <div className="mt-8 space-y-5 text-base leading-8 text-zinc-600">
            <p>
              Notre rôle est de rendre l’accès à l’espace plus simple : un
              parking poids lourds, une zone de stockage, un box, un atelier ou
              un besoin logistique doivent pouvoir être activés rapidement, sans
              lourdeur inutile.
            </p>

            <p>
              Grâce à notre branche transport, nous pouvons compléter l’offre :
              réception, acheminement, organisation des flux, livraison ou
              solution sur mesure. Vous n’êtes pas obligé de coordonner cinq
              prestataires. SED-X centralise, simplifie et exécute.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                value: "12 000 m²",
                label: "d’espaces exploitables",
              },
              {
                value: "24/7",
                label: "accès flexible",
              },
              {
                value: "BE / LU",
                label: "position stratégique",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-5"
              >
                <p className="text-2xl font-black tracking-[-0.04em] text-red-600">
                  {item.value}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase leading-5 tracking-[0.12em] text-zinc-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Values */}
    <div className="mt-20 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        {
          title: "Flexible par nature",
          desc: "Petites surfaces, grands volumes, courte ou longue durée : nous adaptons l’espace au besoin réel, pas l’inverse.",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-11 w-11">
              <path
                d="M18 24H62V56H18V24Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M28 24V56"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.25"
              />
              <path
                d="M52 24V56"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.25"
              />
              <path
                d="M32 40H48"
                stroke="#DC0000"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          title: "Transport intégré",
          desc: "Notre branche transport complète l’offre : collecte, acheminement, distribution et coordination opérationnelle.",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-11 w-11">
              <path
                d="M12 47H46V28H12V47Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M46 47H68V38L60 30H46V47Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="25" cy="52" r="5" stroke="currentColor" strokeWidth="3" />
              <circle cx="58" cy="52" r="5" stroke="currentColor" strokeWidth="3" />
              <path
                d="M16 47H40"
                stroke="#DC0000"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          title: "Simple à activer",
          desc: "Une demande, une réponse claire, une solution déployable. Notre objectif : réduire les frictions et accélérer vos opérations.",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-11 w-11">
              <path
                d="M24 12H48L60 24V66H24V12Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M48 12V25H60"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M34 42L40 48L51 35"
                stroke="#DC0000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          title: "Pensé terrain",
          desc: "Transporteurs, artisans, e-commerce, véhicules, marchandises : notre site répond à des besoins concrets, pas à une promesse abstraite.",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-11 w-11">
              <path
                d="M40 72C40 72 62 50 62 30C62 17.8 52.2 9 40 9C27.8 9 18 17.8 18 30C18 50 40 72 40 72Z"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle cx="40" cy="31" r="8" stroke="currentColor" strokeWidth="3" />
              <circle cx="40" cy="31" r="2.5" fill="#DC0000" />
            </svg>
          ),
        },
      ].map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:shadow-[0_36px_100px_rgba(0,0,0,0.10)]"
        >
          <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />

          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-200 bg-[#FAFAFA] text-black transition duration-300 group-hover:border-red-600/25 group-hover:text-red-600 group-hover:shadow-[0_18px_45px_rgba(220,0,0,0.10)]">
            {item.icon}
          </div>

          <h3 className="text-[15px] font-black uppercase leading-6 tracking-[0.06em] text-black">
            {item.title}
          </h3>

          <p className="mt-5 text-[13px] leading-6 text-zinc-600">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

    {/* Bottom statement */}
<div className="mt-16 overflow-hidden rounded-[34px] bg-black text-white shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
  <div className="relative flex flex-col gap-8 px-8 py-8 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-7">
    {/* Subtle red accent */}
    <div className="absolute left-0 top-0 h-full w-[4px] bg-red-600" />

    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
        SED-X en une phrase
      </p>

      <p className="mt-3 max-w-3xl text-xl font-black uppercase leading-tight tracking-[-0.03em] text-white md:text-2xl">
        Un site flexible pour stocker, stationner et transporter.
        <span className="text-zinc-400"> Simplement.</span>
      </p>
    </div>

    <a
      href="#contact"
      className="inline-flex shrink-0 items-center justify-center gap-4 rounded-full bg-white px-7 py-4 text-[11px] font-black uppercase tracking-[0.08em] text-black no-underline transition hover:bg-red-600 hover:text-white"
    >
      Nous contacter
      <span className="text-base leading-none">→</span>
    </a>
  </div>
    </div>
  </div>
</section>

       {/* PARTENAIRES */}
<section
  id="partenaires"
  className="relative overflow-hidden bg-[#FAFAFA] px-6 py-8 text-black lg:px-10 lg:py-12"
>


  <div className="relative z-10 mx-auto max-w-[1500px]">
    {/* Header */}
    <div className="mx-auto max-w-5xl text-center">
      <div className="mb-8 flex items-center justify-center gap-4">
        <span className="h-[2px] w-9 bg-red-600" />
        <span className="text-[12px] font-black uppercase tracking-[0.22em] text-black">
          Partenaires
        </span>
        <span className="h-[2px] w-9 bg-red-600" />
      </div>

      <h2 className="mx-auto max-w-6xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-black">
        <span className="block text-[46px] sm:text-[62px] md:text-[76px] lg:text-[86px]">
          Implantez votre activité
        </span>
        <span className="block text-[46px] sm:text-[62px] md:text-[76px] lg:text-[86px]">
          chez <span className="text-red-600">SED-X.</span>
        </span>
      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-base leading-7 text-zinc-600 md:text-lg">
        Une base industrielle flexible pour les transporteurs, importateurs,
        artisans, exploitants logistiques et opérateurs techniques qui veulent
        s’installer, stocker, livrer ou développer une activité sans lourdeur.
      </p>
    </div>

    {/* Main partner cards */}
    <div className="mt-18 grid gap-5 md:grid-cols-3 lg:mt-20">
      {[
        {
          title: "Transport & logistique",
          desc: "Parking sécurisé, base arrière pour chauffeurs, gestion des flux et solutions de transport pour compléter vos opérations.",
          tag: "Flux & mobilité",
          href: "#contact",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
              <path
                d="M12 47H46V28H12V47Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M46 47H68V38L60 30H46V47Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="25" cy="52" r="5" stroke="currentColor" strokeWidth="3" />
              <circle cx="58" cy="52" r="5" stroke="currentColor" strokeWidth="3" />
              <path
                d="M16 47H40"
                stroke="#DC0000"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          title: "Import / Export",
          desc: "Réception, stockage, préparation, inspection et organisation des marchandises ou véhicules avant livraison ou redistribution.",
          tag: "Stock & transit",
          href: "#contact",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
              <path
                d="M40 10L62 22.5V47.5L40 60L18 47.5V22.5L40 10Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M18 22.5L40 35L62 22.5"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path d="M40 35V60" stroke="currentColor" strokeWidth="3" />
              <path
                d="M53 30V43"
                stroke="#DC0000"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          title: "Artisans & ateliers",
          desc: "Boxes, ateliers et espaces techniques pour mécanique, detailing, covering, préparation, maintenance ou activité légère.",
          tag: "Espaces techniques",
          href: "#contact",
          icon: (
            <svg viewBox="0 0 80 80" fill="none" className="h-12 w-12">
              <path
                d="M16 38L40 20L64 38V64H16V38Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M29 64V44H51V64"
                stroke="#DC0000"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M23 38H57"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.25"
              />
            </svg>
          ),
        },
      ].map((p) => (
        <a
          key={p.title}
          href={p.href}
          className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white p-8 text-black no-underline shadow-[0_24px_80px_rgba(0,0,0,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:shadow-[0_36px_100px_rgba(0,0,0,0.10)]"
        >
          <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />

          <div className="mb-8 flex items-start justify-between gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-zinc-200 bg-[#FAFAFA] text-black transition duration-300 group-hover:border-red-600/25 group-hover:text-red-600 group-hover:shadow-[0_18px_45px_rgba(220,0,0,0.10)]">
              {p.icon}
            </div>

            <span className="rounded-full bg-[#FAFAFA] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500 transition group-hover:text-red-600">
              {p.tag}
            </span>
          </div>

          <h3 className="max-w-[320px] text-[22px] font-black uppercase leading-tight tracking-[-0.02em] text-black md:text-2xl">
            {p.title}
          </h3>

          <p className="mt-6 max-w-md text-[14px] leading-7 text-zinc-600">
            {p.desc}
          </p>

          <div className="mt-auto pt-10">
            <div className="inline-flex items-center gap-5 border-b-2 border-red-600 pb-2 text-[12px] font-black uppercase tracking-[0.08em] text-black transition group-hover:text-red-600">
              Devenir partenaire
              <span className="text-xl leading-none text-red-600 transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>

    {/* Commercial manifesto */}
<div className="mt-6 overflow-hidden rounded-[34px] bg-black text-white shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
  <div className="relative flex flex-col gap-8 px-8 py-8 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-7">
    {/* Subtle red accent */}
    <div className="absolute left-0 top-0 h-full w-[4px] bg-red-600" />

    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
        Une base, plusieurs opportunités
      </p>

      <p className="mt-3 max-w-3xl text-xl font-black uppercase leading-tight tracking-[-0.03em] text-white md:text-2xl">
        Stocker, stationner, transporter.
        <span className="text-zinc-400"> Tout part du même endroit.</span>
      </p>
    </div>

    <a
      href="#contact"
      className="inline-flex shrink-0 items-center justify-center gap-4 rounded-full bg-white px-7 py-4 text-[11px] font-black uppercase tracking-[0.08em] text-black no-underline transition hover:bg-red-600 hover:text-white"
    >
      Discuter de mon projet
      <span className="text-base leading-none">→</span>
    </a>
  </div>

    </div>
  </div>
</section>


{/* CONTACT */}
<section
  id="contact"
  className="relative overflow-hidden bg-[#FAFAFA] px-6 py-24 text-black lg:px-10 lg:py-32"
>
  {/* Background accents */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute left-[-10%] top-[12%] h-[420px] w-[420px] rounded-full bg-red-600/[0.035] blur-3xl" />
    <div className="absolute right-[-12%] bottom-[8%] h-[480px] w-[480px] rounded-full bg-black/[0.035] blur-3xl" />
  </div>

  <div className="relative z-10 mx-auto max-w-[1500px]">
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
      {/* Left panel */}
      <div className="relative overflow-hidden rounded-[34px] bg-black p-8 text-white shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:p-10 lg:p-12">
        <div className="absolute left-0 top-0 h-full w-[4px] bg-red-600" />
        <div className="absolute right-[-18%] top-[-18%] h-72 w-72 rounded-full bg-red-600/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-[2px] w-9 bg-red-600" />
            <span className="text-[12px] font-black uppercase tracking-[0.22em] text-white">
              Contact
            </span>
          </div>

          <h2 className="max-w-2xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
            <span className="block text-[46px] sm:text-[62px] md:text-[76px] lg:text-[78px]">
              Parlons de
            </span>
            <span className="block text-[46px] sm:text-[62px] md:text-[76px] lg:text-[78px]">
              votre <span className="text-red-500">besoin.</span>
            </span>
          </h2>

          <p className="mt-8 max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
            Stockage, parking poids lourds, box, atelier, transport ou
            implantation d’activité : décrivez votre besoin, nous vous orientons
            vers la solution la plus simple et la plus adaptée.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Sedan",
                desc: "Zone industrielle stratégique",
              },
              {
                title: "24/7",
                desc: "Accès flexible selon vos besoins",
              },
              {
                title: "Sécurisé",
                desc: "Site surveillé et accès contrôlés",
              },
              {
                title: "Transport",
                desc: "Solution logistique complémentaire",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-2xl font-black tracking-[-0.04em] text-red-500">
                  {item.title}
                </p>
                <p className="mt-2 text-[12px] font-semibold uppercase leading-5 tracking-[0.12em] text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="overflow-hidden rounded-[34px] border border-zinc-200/70 bg-white p-8 shadow-[0_28px_90px_rgba(0,0,0,0.07)] md:p-10 lg:p-12">
        <div className="mb-8">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-red-600">
            Demande rapide
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Réponse claire, sans engagement. Indiquez les informations utiles et
            nous revenons vers vous rapidement.
          </p>
        </div>

        <form className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                Nom / Société
              </label>
              <input
                type="text"
                placeholder="Votre nom ou société"
                className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                Email
              </label>
              <input
                type="email"
                placeholder="contact@entreprise.com"
                className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                Téléphone
              </label>
              <input
                type="tel"
                placeholder="+33 6 00 00 00 00"
                className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
                Type de besoin
              </label>
              <select className="w-full rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10">
                <option>Parking poids lourds</option>
                <option>Stockage véhicules</option>
                <option>Stockage marchandises</option>
                <option>Location atelier / box</option>
                <option>Transport & logistique</option>
                <option>Implantation d’activité</option>
                <option>Partenariat</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-zinc-700">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="Décrivez brièvement votre besoin : volume, durée, accès souhaité, transport éventuel..."
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-5 text-zinc-500">
              En envoyant votre demande, vous nous permettez de vous recontacter
              avec une proposition adaptée.
            </p>

            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-4 rounded-full bg-black px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-white outline-none transition hover:bg-red-600"
            >
              Envoyer ma demande
              <span className="text-base leading-none">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 text-zinc-500 text-center py-8 text-xs">
        © {new Date().getFullYear()} SED-X — Hub Automobile & Logistique — Sedan
      </footer>

    </main>
  );
}