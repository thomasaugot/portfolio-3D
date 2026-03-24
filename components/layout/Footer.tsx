"use client";

import { useTranslation } from "@/contexts/TranslationProvider";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-center justify-center md:justify-end py-3 px-4 md:py-4 md:px-6">
        <span className="text-xs md:text-sm text-text/72 font-mono text-center">
          © {new Date().getFullYear()} Thomas Augot • {t("footer.rights")}
        </span>
      </div>
    </footer>
  );
}
