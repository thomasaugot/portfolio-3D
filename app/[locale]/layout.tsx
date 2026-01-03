import "../globals.css";
import { TranslationProvider } from "@/lib/providers/TranslationProvider";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { TabTitleAnimationProvider } from "@/lib/providers/TabTitleAnimationProvider";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";
import AdminKeySequenceListener from "@/components/AdminKeySequenceListener";

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
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.classList.add(theme);
            document.documentElement.style.background = theme === 'dark' ? '#212121' : '#e8e4de';
          })();
        ` }} />
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
        <ThemeProvider>
          <TranslationProvider>
            <TabTitleAnimationProvider />
            <AdminKeySequenceListener />
            <ClientLoadingWrapper>
              <main>{children}</main>
            </ClientLoadingWrapper>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}