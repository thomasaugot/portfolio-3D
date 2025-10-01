export async function waitForFonts(): Promise<void> {
  if (typeof window === "undefined") return;

  await document.fonts.ready;
}