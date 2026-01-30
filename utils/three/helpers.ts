/**
 * Device capability detection for Three.js scenes
 * Centralizes performance-based device detection logic
 */

/**
 * Detect if the current device is low performance
 * Used to adjust Three.js settings for better performance
 *
 * Checks for:
 * - Data saver mode enabled
 * - Low memory (< 1GB heap)
 * - Low CPU cores (< 4)
 *
 * @returns true if device is low performance
 */
export function isLowPerformanceDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  const connection = (navigator as any).connection;
  const memory = (performance as any).memory;

  return (
    (connection && connection.saveData) ||
    (memory && memory.jsHeapSizeLimit < 1073741824) || // Less than 1GB heap
    navigator.hardwareConcurrency < 4
  );
}

/**
 * Get device capabilities for Three.js optimization
 * @returns Object with device capability flags
 */
export function getDeviceCapabilities() {
  const isLowPerf = isLowPerformanceDevice();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return {
    isLowPerf,
    isMobile,
    supportsWebGL2: typeof WebGL2RenderingContext !== 'undefined',
    recommendedPixelRatio: isMobile ? 1.5 : 2,
    shouldUseAntialiasing: !isMobile && !isLowPerf,
    maxAnisotropy: isLowPerf ? 1 : (isMobile ? 2 : 16),
  };
}

/**
 * Get recommended max pixel ratio based on device
 * @param isMobile - Whether device is mobile
 * @returns Recommended pixel ratio cap
 */
export function getMaxPixelRatio(isMobile: boolean): number {
  return isMobile ? 1.5 : 2;
}
/**
 * Scene configuration utilities
 * Centralizes viewport and theme detection for Three.js scenes
 */

import type { SceneConfig } from "./scene";

/**
 * Get current viewport configuration
 * Detects device type and theme for scene customization
 *
 * @returns SceneConfig object with viewport and theme info
 */
export function getViewportConfig(): SceneConfig {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
}

/**
 * Get responsive value based on viewport
 * @param config - Scene configuration
 * @param mobileValue - Value for mobile devices
 * @param tabletValue - Value for tablets
 * @param desktopValue - Value for desktop
 * @returns Appropriate value for current viewport
 */
export function getResponsiveValue<T>(
  config: SceneConfig,
  mobileValue: T,
  tabletValue: T,
  desktopValue: T
): T {
  if (config.isMobile) return mobileValue;
  if (config.isTablet) return tabletValue;
  return desktopValue;
}

/**
 * Check if viewport configuration has changed
 * Useful for handling window resize events
 */
export function hasViewportChanged(oldConfig: SceneConfig, newConfig: SceneConfig): boolean {
  return (
    oldConfig.isMobile !== newConfig.isMobile ||
    oldConfig.isTablet !== newConfig.isTablet ||
    oldConfig.isDesktop !== newConfig.isDesktop
  );
}
