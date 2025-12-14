"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FaHome, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const translations = {
    en: {
      title: "404",
      subtitle: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved.",
      backHome: "Back to Home",
      goBack: "Go Back",
    },
    fr: {
      title: "404",
      subtitle: "Page Introuvable",
      description: "La page que vous recherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'Accueil",
      goBack: "Retour",
    },
    es: {
      title: "404",
      subtitle: "Página No Encontrada",
      description: "La página que buscas no existe o ha sido movida.",
      backHome: "Volver al Inicio",
      goBack: "Volver",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1
            className="text-[200px] md:text-[300px] font-bold leading-none gradient-text opacity-20"
            style={{
              WebkitTextStroke: "2px",
              WebkitTextStrokeColor: "var(--color-primary)",
            }}
          >
            {t.title}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                {t.subtitle}
              </h2>
              <p className="text-text/60 text-lg max-w-md mx-auto">
                {t.description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href={`/${locale}`}>
            <Button variant="filled" size="lg">
              <FaHome className="mr-2" />
              {t.backHome}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft className="mr-2" />
            {t.goBack}
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </main>
  );
}
