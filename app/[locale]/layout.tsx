import type { Metadata } from "next";
import "../globals.css";
import { TranslationProvider } from "@/hooks/useTranslation";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageDiscovery } from "@/components/ui/LanguageDiscovery";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Menu from "@/components/layout/Menu";
import LoadingWrapper from "@/components/ui/LoadingWrapper";

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
            <LoadingWrapper>
              <LanguageDiscovery />
              <main>{children}</main>
            </LoadingWrapper>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
