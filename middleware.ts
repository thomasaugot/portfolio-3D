import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, routeTranslations } from "./utils/route-translations";

// Create reverse mapping: for each locale, map any route variant to the correct one
const routeVariants: Record<string, Record<string, string>> = {
  en: {
    "about": "about",
    "a-propos": "about",
    "acerca-de": "about",
    "contact": "contact",
    "contacto": "contact",
    "portfolio": "portfolio",
    "blog": "blog",
  },
  fr: {
    "about": "a-propos",
    "a-propos": "a-propos",
    "acerca-de": "a-propos",
    "contact": "contact",
    "contacto": "contact",
    "portfolio": "portfolio",
    "blog": "blog",
  },
  es: {
    "about": "acerca-de",
    "a-propos": "acerca-de",
    "acerca-de": "acerca-de",
    "contact": "contacto",
    "contacto": "contacto",
    "portfolio": "portfolio",
    "blog": "blog",
  },
};

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return pathname.split("/")[1];
  }

  const acceptLanguage = request.headers.get("Accept-Language");

  if (acceptLanguage?.includes("fr")) {
    return "fr";
  }
  if (acceptLanguage?.includes("es")) {
    return "es";
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // No locale in path, redirect to add locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Check if route needs to be translated for the current locale
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const locale = segments[0] as keyof typeof routeVariants;
    const route = segments[1];

    if (routeVariants[locale] && routeVariants[locale][route]) {
      const correctRoute = routeVariants[locale][route];

      if (route !== correctRoute) {
        // Route needs to be translated
        const newPathname = `/${locale}/${correctRoute}${segments.length > 2 ? '/' + segments.slice(2).join('/') : ''}`;
        request.nextUrl.pathname = newPathname;
        return NextResponse.redirect(request.nextUrl);
      }
    }
  }

  return;
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};