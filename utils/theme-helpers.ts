// utils/theme-helpers.ts
export function getThemeState() {
  if (typeof window === 'undefined') return { isLight: true, isDark: false };
  
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  const isLight = !isDark;
  
  return { isLight, isDark };
}

export function getThemeAwareStyles(lightStyle: string, darkStyle: string) {
  const { isLight } = getThemeState();
  return isLight ? lightStyle : darkStyle;
}

export function getThemeAwareColors() {
  const { isLight } = getThemeState();
  
  return {
    surface: isLight ? 'var(--color-surface)' : 'var(--color-surface)',
    surfaceElevated: isLight ? 'var(--color-surface-elevated)' : 'var(--color-surface-elevated)',
    border: isLight ? 'var(--color-border)' : 'var(--color-border)',
    borderStrong: isLight ? 'var(--color-border-strong)' : 'var(--color-border-strong)',
    text: isLight ? 'var(--color-text)' : 'var(--color-text)',
    textMuted: isLight ? 'var(--color-text-muted)' : 'var(--color-text-muted)',
    textSubtle: isLight ? 'var(--color-text-subtle)' : 'var(--color-text-subtle)',
    accentBg: isLight ? 'var(--color-accent-bg)' : 'var(--color-accent-bg)',
    accentBgHover: isLight ? 'var(--color-accent-bg-hover)' : 'var(--color-accent-bg-hover)',
    accentBorder: isLight ? 'var(--color-accent-border)' : 'var(--color-accent-border)',
    shadowLight: isLight ? 'var(--color-shadow-light)' : 'var(--color-shadow-light)',
    shadowMedium: isLight ? 'var(--color-shadow-medium)' : 'var(--color-shadow-medium)',
    shadowStrong: isLight ? 'var(--color-shadow-strong)' : 'var(--color-shadow-strong)',
  };
}