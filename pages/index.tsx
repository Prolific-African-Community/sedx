"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ------------------ Utils ------------------ */
type ClassValue = string | false | null | undefined;
const cn = (...c: ClassValue[]) => c.filter(Boolean).join(" ");

/* ------------------ Tokens ------------------ */
const SECTION = "py-24 px-6";
const TITLE = "text-5xl md:text-6xl font-semibold tracking-tight leading-tight";

const HERO_SLIDES = [
  "/hero-1.webp",
  "/hero-2.webp",
  "/hero-3.jpg",
  "/hero-4.jpg",
  "/hero-5.jpg",
  "/hero-6.jpg",
  "/hero-7.jpg",
  "/hero-8.webp",
];

export default function SedxHome() {
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", () => setScrollY(window.scrollY), { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white text-black selection:bg-red-600 selection:text-white">
      {/* HEADER */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all",
          scrolled
            ? "bg-white/95 backdrop-blur border-b border-zinc-200"
            : "bg-white"
        )}
      >
        <nav className="max-w-8xl mx-auto px-6 py-6 flex justify-between items-center">
          <img src="/logo-sedx2.png" alt="SED-X logo" className="h-12 w-auto" />

          <div className="hidden lg:flex gap-10 text-sm text-semibold uppercase tracking-wider text-black">
            <a href="#services" className="text-black text-sm no-underline hover:text-red-600 transition">Services</a>
            <a href="#modele" className="text-black text-sm no-underline hover:text-red-600 transition">Contact</a>
            <a href="#pourquoi" className="text-black text-sm no-underline hover:text-red-600 transition">Partenaires</a>
          </div>

          <a
            href="#contact"
            className="bg-red-600 no-underline hover:bg-red-700 rounded-full transition px-6 py-3 text-sm font-semibold text-white"
          >
            Louer un espace
          </a>
        </nav>
      </header>

      {/* HERO AVEC SLIDER */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Images */}
        {HERO_SLIDES.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="SED-X infrastructure"
            className={cn(
              "absolute inset-0 w-full h-full object-fit transition-opacity duration-1000",
              index === slide ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-zinc-800/60" />

        {/* Content */}
        <div
          className="relative z-10 max-w-5xl pt-16 px-6 text-white transition-all duration-700 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.25}px) scale(${1 - scrollY * 0.0003})`,
            opacity: 1 - scrollY * 0.0015,
          }}
        >
          <h1 className={TITLE}>
            Zone Industrielle Sécurisée à Sedan.
          </h1>

          <p className="mt-8 text-xl text-zinc-200">
            Parking poids lourds 24/7, Stockage véhicules et matériaux, 
            Ateliers et Espaces logistiques disponibles immédiatement.
          </p>

          {/* Tags descriptifs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {["12 000 m²", "Accès 24/7", "Parking Camions", "Stockage Véhicules & Matériaux", 
              "Ateliers & Boxes", "Bornes Électriques", "Frontière BE / LU"].map((tag) => (
              <span
                key={tag}
                className="px-5 py-2 text-sm bg-slate-700 border border-white/40 rounded-full backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-6">
            <a
              href="/reserver"
              className="bg-red-600 text-white rounded-full no-underline hover:bg-red-700 transition px-8 py-4 font-semibold"
            >
              Louer un espace
            </a>
            <a
              href="#contact"
              className="bg-black text-white rounded-full no-underline hover:bg-white hover:text-black transition px-8 py-4 font-semibold"
            >
              Devenir partenaire
            </a>
          </div>
        </div>
      </section>

     {/* SERVICES */}
<section
  id="services"
  className={cn(SECTION, "bg-zinc-100 border-t border-zinc-200")}
>
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h2 className="text-4xl font-semibold">Services</h2>
        <p className="mt-4 text-zinc-600 max-w-3xl">
          Sélectionnez votre besoin. Réservez immédiatement.
        </p>
      </div>

      <Link href="/reserver">
        <a className="inline-flex items-center justify-center bg-black text-white rounded-full hover:bg-red-600 transition px-6 py-3 text-sm font-semibold w-full md:w-auto">
          Demander un devis rapide
        </a>
      </Link>
    </div>

    <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          id: "stockage_vehicule",
          title: "Stockage Véhicule",
          price: "À partir de 69€ / mois",
          img: "/hero-5.jpg",
          bullets: ["Longue durée", "Sécurité 24/7", "Accès contrôlé"],
          cta: "Réserver un emplacement",
        },
        {
          id: "logistique",
          title: "Emplacement Logistique",
          price: "À partir de 3€ / m²",
          img: "/hero-3.jpg",
          bullets: ["Palettes", "Stock tampon", "Flux e-commerce"],
          cta: "Louer une zone",
        },
        {
          id: "parking_pl",
          title: "Parking Poids Lourds",
          price: "À partir de 15€ / jour",
          img: "/hero-1.webp",
          bullets: ["Accès 24/7", "Zone sécurisée", "Arrêt rapide"],
          cta: "Réserver une place",
        },
        {
          id: "atelier",
          title: "Ateliers & Boxes",
          price: "À partir de 350€ / mois",
          img: "/hero-6.jpg",
          bullets: ["Box privatif", "Électricité", "Accès indépendant"],
          cta: "Demander un box",
        },
        {
          id: "recharge",
          title: "Stations de recharge",
          price: "À partir de 5€",
          img: "/hero-4.jpg",
          bullets: ["Bornes rapides", "Accès 24/7", "Paiement simple"],
          cta: "Réserver",
        },
        {
          id: "import",
          title: "Import / Export",
          price: "À partir de 290€",
          img: "/hero-9.jpg",
          bullets: ["Réception et stockage sécurisé", "Inspection & contrôle qualité", "Préparation avant revente ou livraison"],
          cta: "Réserver",
        },
        {
          id: "boutique",
          title: "La Boutique Smart",
          price: "Cashless",
          img: "/hero-8.webp",
          bullets: ["Sandwich", "Rafraîchissements", "Hygiène"],
          cta: "Découvrir",
        },
      ].map((service) => (
        <Link
          key={service.id}
          href={`/reserver?service=${service.id}`}
        >
          <a className="block no-underline text-black group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition">
            
            {/* Image */}
            <div className="relative h-64">
              <img
                src={service.img}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-semibold text-black border border-zinc-200">
                  {service.price}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-8">
              <h3 className="text-xl no-underline font-semibold">{service.title}</h3>

              <ul className="mt-5 space-y-2 no-underline text-sm text-zinc-700">
                {service.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-red-600">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 bg-black no-underline text-white text-center py-3 font-semibold group-hover:bg-red-600 transition rounded-full">
                {service.cta}
              </div>
            </div>

          </a>
        </Link>
      ))}
    </div>
  </div>
</section>

        {/* PARTENAIRES */}
        <section
        id="partenaires"
        className="py-28 px-6 bg-white border-t border-zinc-200"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-semibold">Implantez votre activité chez SED-X</h2>
            <p className="mt-6 text-zinc-600 max-w-3xl mx-auto">
              Transporteurs, importateurs, artisans, exploitants logistiques ou
              opérateurs techniques : SED-X est conçu pour accueillir des
              activités complémentaires au sein d’une même base industrielle.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Transport & Logistique",
                desc: "Parking sécurisé 24/7, base arrière pour chauffeurs et gestion des flux transfrontaliers.",
              },
              {
                title: "Import / Export",
                desc: "Zone dédiée au stockage, préparation et inspection de marchandises et véhicules.",
              },
              {
                title: "Artisans & Ateliers",
                desc: "Boxes et espaces techniques pour detailing, mécanique, covering ou activité industrielle légère.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="border border-zinc-200 bg-zinc-100 rounded-2xl p-10 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-5 text-zinc-600 text-sm leading-relaxed">
                  {p.desc}
                </p>
                <a
                  href="#contact"
                  className="mt-8 inline-block bg-red-600 text-white no-underline px-6 py-3 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                >
                  Devenir partenaire
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* CONTACT */}
  <section
        id="contact"
        className="py-32 px-6 bg-zinc-900 text-white border-t border-zinc-800"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Parlons de votre besoin.
            </h2>
            <p className="mt-6 text-zinc-300 max-w-xl leading-relaxed">
              Parking poids lourds, stockage longue durée, location de box ou
              implantation d’activité : indiquez-nous votre besoin et nous
              revenons vers vous rapidement.
            </p>

            <div className="mt-10 space-y-4 text-sm text-zinc-400">
              <p>Sedan – Zone industrielle stratégique</p>
              <p>Accès 24/7</p>
              <p>Site sécurisé</p>
              <p>Accès poids lourds</p>
            </div>
          </div>

          {/* Right side form */}
          <div className="bg-white text-black rounded-2xl p-10 shadow-2xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom / Société
                </label>
                <input
                  type="text"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Votre nom ou société"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="contact@entreprise.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Type de besoin
                </label>
                <select
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option>Parking Poids Lourds</option>
                  <option>Stockage Véhicules</option>
                  <option>Stockage Matériaux</option>
                  <option>Location Atelier / Box</option>
                  <option>Implantation d’activité</option>
                  <option>Partenariat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Décrivez brièvement votre besoin"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white border no-border outline-none rounded-full py-4 font-semibold hover:bg-red-700 transition"
              >
                Envoyer ma demande
              </button>
            </form>
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


