import type { Metadata } from "next";
import "../globals.css";
import { TranslationProvider } from "@/lib/providers/TranslationProvider";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { LanguageDiscovery } from "@/components/ui/LanguageDiscovery";
import { TabTitleAnimationProvider } from "@/lib/providers/TabTitleAnimationProvider";

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
            <TabTitleAnimationProvider />
            {/* <LanguageDiscovery /> */}
            <main>{children}</main>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}