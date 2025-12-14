/**
 * Create a URL-friendly slug from article title
 * Example: "How to Fix WordPress Error" -> "how-to-fix-wordpress-error"
 */
export function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Remove special characters but keep spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract slug from Medium URL (fallback - extracts the article part before the hash)
 * URL format: https://medium.com/@username/article-title-slug-96d71da055cb
 * Returns: article-title-slug
 */
export function extractSlugFromMediumUrl(url: string): string {
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2];

    // Remove the hash at the end (last segment after last hyphen)
    // Format: article-title-words-96d71da055cb -> article-title-words
    const segments = lastPart.split('-');

    // Remove the last segment (hash) and rejoin
    if (segments.length > 1) {
      segments.pop(); // Remove hash
      return segments.join('-');
    }

    return lastPart;
  } catch (error) {
    console.error('Error extracting slug from URL:', url, error);
    return url;
  }
}

/**
 * Create a URL-friendly slug from a string (generic)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
