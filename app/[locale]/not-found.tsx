"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initNotFound } from "@/utils/animations/not-found-animation";
import en from "@/locales/en/not-found.json";
import fr from "@/locales/fr/not-found.json";
import es from "@/locales/es/not-found.json";

const messages = { en, fr, es };

export default function NotFound() {
  const { language } = useTranslation();
  const t = messages[language] ?? messages.en;

  useGSAPAnimations(initNotFound);

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div data-animate className="relative z-10 w-full max-w-2xl">
        <div className="bg-bg-surface rounded-xl border border-white/14 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-white/12">
            <div className="flex gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <span className="ml-4 text-xs text-white/65 font-mono">error.sh</span>
          </div>

          <div className="p-6 md:p-8 font-mono text-sm md:text-base">
            <div className="mb-4">
              <span className="text-primary">❯</span>
              <span className="text-white ml-2">cd /requested/page</span>
            </div>

            <div className="mb-6 text-red-400">{t.error}</div>

            <div className="text-8xl md:text-9xl font-bold text-white/10 text-center my-8">
              404
            </div>

            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{t.subtitle}</h1>
              <p className="text-white/78">{t.description}</p>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <span className="text-primary">❯</span>
              <span className="cursor-blink w-2 h-5 inline-block bg-primary" />
            </div>
          </div>
        </div>

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
