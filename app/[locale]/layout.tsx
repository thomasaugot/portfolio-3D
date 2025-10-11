import type { Metadata } from "next";
import "../globals.css";
import { TranslationProvider } from "@/lib/providers/TranslationProvider";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { TabTitleAnimationProvider } from "@/lib/providers/TabTitleAnimationProvider";
import LoadingProvider from "@/lib/providers/LoadingProvider";

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
            <LoadingProvider criticalScenes={["hero"]}>
              <main>{children}</main>
            </LoadingProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}