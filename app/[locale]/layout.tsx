import type { Metadata } from "next";
import "../globals.css";
import { TranslationProvider } from "@/lib/providers/TranslationProvider";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { TabTitleAnimationProvider } from "@/lib/providers/TabTitleAnimationProvider";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";

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
            <ClientLoadingWrapper>
              <main>{children}</main>
            </ClientLoadingWrapper>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}