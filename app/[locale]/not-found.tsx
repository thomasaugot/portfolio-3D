"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import gsap from "gsap";

export default function NotFound() {
  const { language } = useTranslation();
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate]",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.2, ease: "power2.out" }
      );
    });

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  const messages = {
    en: {
      error: "Error: Path not found",
      subtitle: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved.",
      back: "Back to Home",
    },
    fr: {
      error: "Erreur: Chemin introuvable",
      subtitle: "Page Introuvable",
      description: "La page que vous recherchez n'existe pas ou a été déplacée.",
      back: "Retour à l'Accueil",
    },
    es: {
      error: "Error: Ruta no encontrada",
      subtitle: "Página No Encontrada",
      description: "La página que buscas no existe o ha sido movida.",
      back: "Volver al Inicio",
    },
  };

  const t = messages[language] || messages.en;

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-6">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div data-animate className="relative z-10 w-full max-w-2xl">
        {/* Terminal Window */}
        <div className="bg-bg-surface rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <span className="ml-4 text-xs text-white/40 font-mono">
              error.sh
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base">
            <div className="mb-4">
              <span className="text-primary">❯</span>
              <span className="text-white ml-2">cd /requested/page</span>
            </div>

            <div className="mb-6 text-red-400">
              {t.error}
            </div>

            <div className="text-8xl md:text-9xl font-bold text-white/10 text-center my-8">
              404
            </div>

            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                {t.subtitle}
              </h1>
              <p className="text-white/50">
                {t.description}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <span className="text-primary">❯</span>
              <span className={`w-2 h-5 bg-primary ${showCursor ? "opacity-100" : "opacity-0"}`} />
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <a
            href={`/${language}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary text-black font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/25"
          >
            {t.back}
            <span className="text-black/50 font-mono text-xs">~/home</span>
          </a>
        </div>
      </div>
    </main>
  );
}
