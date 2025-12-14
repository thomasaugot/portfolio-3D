import { Translate } from '@google-cloud/translate/build/src/v2';

// Initialize the translate client
// For Google Cloud Translate API, you'll need to set GOOGLE_TRANSLATE_API_KEY in .env
const translate = process.env.GOOGLE_TRANSLATE_API_KEY
  ? new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY })
  : null;

export interface TranslatedText {
  fr: string;
  es: string;
}

/**
 * Translates text to French and Spanish
 * @param text Text to translate (in English)
 * @returns Object with fr and es translations
 */
export async function translateText(text: string): Promise<TranslatedText> {
  if (!translate) {
    console.warn('Translation API key not configured. Skipping translation.');
    return { fr: text, es: text }; // Return original text if no API key
  }

  try {
    // Translate to French
    const [frTranslation] = await translate.translate(text, 'fr');

    // Translate to Spanish
    const [esTranslation] = await translate.translate(text, 'es');

    return {
      fr: frTranslation,
      es: esTranslation,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { fr: text, es: text }; // Fallback to original text on error
  }
}

/**
 * Translates HTML content to French and Spanish
 * @param html HTML content to translate (in English)
 * @returns Object with fr and es translations
 */
export async function translateHTML(html: string): Promise<TranslatedText> {
  if (!translate) {
    console.warn('Translation API key not configured. Skipping translation.');
    return { fr: html, es: html };
  }

  try {
    // Translate to French (with HTML format)
    const [frTranslation] = await translate.translate(html, {
      from: 'en',
      to: 'fr',
      format: 'html',
    });

    // Translate to Spanish (with HTML format)
    const [esTranslation] = await translate.translate(html, {
      from: 'en',
      to: 'es',
      format: 'html',
    });

    return {
      fr: frTranslation,
      es: esTranslation,
    };
  } catch (error) {
    console.error('HTML translation error:', error);
    return { fr: html, es: html };
  }
}
