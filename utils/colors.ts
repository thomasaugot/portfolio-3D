/**
 * Centralized theme colors for the application
 * Use these constants instead of hardcoding color values
 */

// Primary brand color (cyan)
export const PRIMARY_COLOR = {
  hex: 0x02bccc,          // For THREE.js Color constructor
  css: '#02bccc',         // For CSS styles
  rgb: [2, 188, 204] as const,  // For RGB operations
} as const;

// Secondary brand color (lime)
export const SECONDARY_COLOR = {
  hex: 0xccff02,
  css: '#ccff02',
  rgb: [204, 255, 2] as const,
} as const;

// Convenience object for quick access
export const THEME_COLORS = {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,
} as const;

/**
 * Create a THREE.Color instance from theme colors
 * @param colorHex - Hex value from THEME_COLORS
 */
export function createThreeColor(colorHex: number): any {
  // Note: Actual THREE.Color will be imported by the consumer
  // This is a type-safe helper to ensure correct color values
  return colorHex;
}
