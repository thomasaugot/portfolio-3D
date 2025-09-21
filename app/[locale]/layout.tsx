import type { Metadata } from "next";
import "../globals.css";
import { TranslationProvider } from "@/hooks/useTranslation";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageDiscovery } from "@/components/ui/LanguageDiscovery";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Menu from "@/components/layout/Menu";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="antialiased">
        <ThemeProvider>
          <TranslationProvider>
            <LanguageDiscovery />
            
            <div className="fixed top-8 left-8 z-40">
              <ThemeToggle />
            </div>
            
            <div className="fixed bottom-8 left-8 z-40">
              <LanguageToggle />
            </div>
            
            <Menu />
            <main>{children}</main>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}