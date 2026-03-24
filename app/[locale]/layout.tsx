import "../globals.css";
import { notFound } from "next/navigation";
import { TranslationProvider } from "@/contexts/TranslationProvider";
import { MotionPreferenceProvider } from "@/contexts/MotionPreferenceProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { TabTitleAnimationProvider } from "@/contexts/TabTitleAnimationProvider";
import ClientLoadingWrapper from "@/components/layout/ClientLoadingWrapper";
import SkipLink from "@/components/ui/SkipLink";
import { locales, type Language } from "@/utils/locales";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale - trigger 404 for unsupported locales
  if (!locales.includes(locale as Language)) {
    notFound();
  }

  const navbarMessages = (
    await import(`@/locales/${locale}/navbar.json`)
  ).default as { skip_to_main_content?: string };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" id="theme-color-meta" />
        <meta name="color-scheme" content="light dark" />
        <link
          rel="preload"
          href="/assets/models/laptop-logo.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
          <SkipLink
            href="#stage-content"
            label={navbarMessages.skip_to_main_content ?? "skip_to_content"}
          />
          <TranslationProvider>
            <ThemeProvider>
              <MotionPreferenceProvider>
                <ClientLoadingWrapper>
                  <TabTitleAnimationProvider />
                  <main id="main-content" tabIndex={-1}>
                    {children}
                  </main>
                </ClientLoadingWrapper>
              </MotionPreferenceProvider>
            </ThemeProvider>
          </TranslationProvider>
      </body>
    </html>
  );
}
