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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.style.background='#212121'` }} />
        <meta name="theme-color" content="#212121" />
        <meta name="color-scheme" content="dark" />
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