"use client";

import { useTranslation } from "@/contexts/TranslationProvider";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-center justify-end py-4 px-6">
        <span className="text-sm text-white/50 font-mono">
          © {new Date().getFullYear()} Thomas Augot • {t("footer.rights")}
        </span>
      </div>
    </footer>
  );
}
