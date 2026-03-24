import type { Language } from "@/utils/locales";

export type StagePathStage = "hero" | "about" | "projects" | "contact";

const stageSlugs: Record<Language, Record<StagePathStage, string>> = {
  en: {
    hero: "",
    about: "about",
    projects: "projects",
    contact: "contact",
  },
  fr: {
    hero: "",
    about: "a-propos",
    projects: "projets",
    contact: "contact",
  },
  es: {
    hero: "",
    about: "sobre-mi",
    projects: "proyectos",
    contact: "contacto",
  },
};

export function getStagePath(locale: Language, stage: StagePathStage): string {
  const slug = stageSlugs[locale][stage];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function getStageFromPathname(pathname: string): {
  locale: Language | null;
  stage: StagePathStage;
} {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (locale !== "en" && locale !== "fr" && locale !== "es") {
    return { locale: null, stage: "hero" };
  }

  const slug = segments[1] ?? "";
  const localeSlugs = stageSlugs[locale];

  const stageEntry = (Object.entries(localeSlugs) as Array<[StagePathStage, string]>).find(
    ([, value]) => value === slug
  );

  return {
    locale,
    stage: stageEntry?.[0] ?? "hero",
  };
}
