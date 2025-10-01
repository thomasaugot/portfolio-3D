export function createTranslationLoader(
  locale: string,
  namespaces: string[] = ["common"]
) {
  return async (): Promise<void> => {
    if (typeof window === "undefined") return;

    const loadPromises = namespaces.map(async (ns) => {
      try {
        await import(`@/locales/${locale}/${ns}.json`);
      } catch (error) {
        console.warn(`Translation namespace ${ns} not found for ${locale}`);
      }
    });

    await Promise.all(loadPromises);
  };
}