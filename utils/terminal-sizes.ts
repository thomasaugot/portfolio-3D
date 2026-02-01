/**
 * Terminal Size Configurations (Single Source of Truth)
 * All terminal dimensions across the app are controlled from this file
 */

import { config } from "@/middleware";

// Viewport detection helper
export const getViewportConfig = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 375;
  const height = typeof window !== "undefined" ? window.innerHeight : 812;
  const isPortrait = height > width;
  const isTabletSize = width >= 768 && width < 1024;
  return {
    width,
    height,
    isMobile: width < 768 || (isTabletSize && isPortrait),
    isTablet: isTabletSize && !isPortrait,
    isDesktop: width >= 1024 || (isTabletSize && !isPortrait),
  };
};

const toPx = (value: number) => `${Math.round(value)}px`;

// =====================================================
// LOADER TERMINAL
// =====================================================
export const getLoaderTerminalSize = () => {
  const config = getViewportConfig();
  const width = Math.min(
    config.isMobile ? 320 : 360,
    config.width * (config.isMobile ? 0.88 : 0.32),
  );
  const height = config.isMobile ? 220 : 250;
  return {
    width,
    height,
    widthCss: config.isMobile ? "min(320px, 88vw)" : toPx(width),
    heightCss: toPx(height),
  };
};

// =====================================================
// HERO TERMINAL
// =====================================================
export const getHeroTerminalSize = () => {
  const config = getViewportConfig();
  const width = config.isMobile
    ? Math.round(config.width * 0.92)
    : Math.min(
        config.isTablet
          ? Math.min(640, config.width * 0.8)
          : Math.min(600, config.width * 0.52),
        config.width,
      );
  const height = config.isMobile
    ? Math.min(Math.round(config.height * 0.78), 520)
    : Math.min(
        config.isTablet
          ? Math.min(520, config.height * 0.7)
          : Math.min(560, config.height * 0.62),
        config.height,
      );
  return {
    width,
    height,
    widthCss: toPx(width),
    heightCss: toPx(height),
    left: config.isDesktop ? "35%" : "50%",
  };
};

// =====================================================
// ABOUT TERMINAL
// =====================================================
export const getAboutTerminalSize = () => {
  const config = getViewportConfig();
  const heroSize = getHeroTerminalSize();

  const baseWidth = config.isMobile
    ? Math.round(config.width * 0.92)
    : Math.min(
        config.isTablet
          ? Math.min(820, config.width * 0.8)
          : Math.min(1040, config.width * 0.5),
        config.width,
      );
  const baseHeight = config.isMobile
    ? Math.min(Math.round(config.height * 0.8), 600)
    : Math.min(
        config.isTablet
          ? Math.min(520, config.height * 0.75)
          : Math.min(670, config.height * 0.74),
        config.height,
      );
  const width = Math.min(
    Math.max(
      baseWidth,
      config.isDesktop ? 820 : config.isMobile ? baseWidth : 600,
    ),
    config.width,
  );
  const height = Math.min(
    Math.max(baseHeight, config.isMobile ? baseHeight : heroSize.height + 40),
    config.height,
  );
  return {
    width,
    height,
    widthCss: toPx(width),
    heightCss: toPx(height),
    left: config.isDesktop ? "65%" : "50%",
  };
};

// =====================================================
// PROJECTS TERMINAL (Intro state - centered, compact)
// =====================================================
export const getProjectsIntroSize = () => {
  const viewportConfig = getViewportConfig();

  return {
    width: "min(640px, 88vw)",
    height: viewportConfig.isMobile ? "min(92vh, 75vh)" : "min(52vh, 52vh)",
  };
};

// =====================================================
// PROJECTS TERMINAL (Expanded state - left side, taller)
// =====================================================
export const getProjectsExpandedSize = () => {
  const config = getViewportConfig();
  const navbarHeight = 80;
  const padding = config.isMobile ? 16 : config.isTablet ? 24 : 32;

  const width = config.isDesktop
    ? Math.min(680, config.width * 0.45)
    : config.width - padding * 2;

  const availableHeight = config.height - navbarHeight - padding * 2;
  const height = config.isDesktop
    ? Math.min(640, availableHeight * 0.9)
    : config.isMobile
      ? Math.min(availableHeight * 0.93, availableHeight - 20)
      : Math.min(540, availableHeight * 0.92);

  const left = config.isDesktop ? config.width * 0.28 : config.width / 2;
  const top = navbarHeight + availableHeight / 2;

  return {
    width,
    height,
    top,
    left,
    xPercent: -50,
    yPercent: -50,
    scale: 1,
  };
};

// =====================================================
// PROJECTS CTA TERMINAL (Centered, for final CTA slide)
// =====================================================
export const getProjectsCtaSize = () => {
  const config = getViewportConfig();
  const navbarHeight = 80;
  const padding = config.isMobile ? 16 : config.isTablet ? 24 : 32;

  const width = config.isDesktop
    ? Math.min(600, config.width * 0.5)
    : config.width - padding * 2;

  const availableHeight = config.height - navbarHeight - padding * 2;
  const height = config.isDesktop
    ? Math.min(420, availableHeight * 0.65)
    : config.isMobile
      ? Math.min(availableHeight * 0.93, availableHeight - 20)
      : Math.min(540, availableHeight * 0.92);

  return {
    width,
    height,
    top: config.height / 2,
    left: config.width / 2,
    xPercent: -50,
    yPercent: -50,
    scale: 1,
  };
};

// =====================================================
// CONTACT TERMINAL
// =====================================================
export const getContactTerminalSize = () => {
  const config = getViewportConfig();
  const width = config.isMobile
    ? Math.round(config.width * 0.92)
    : Math.min(
        config.isTablet
          ? Math.min(620, config.width * 0.8)
          : Math.min(680, config.width * 0.45),
        config.width,
      );
  const height = config.isMobile
    ? Math.min(Math.round(config.height * 0.78), 580)
    : Math.min(
        config.isTablet
          ? Math.min(560, config.height * 0.72)
          : Math.min(620, config.height * 0.72),
        config.height,
      );
  return {
    width,
    height,
    widthCss: toPx(width),
    heightCss: toPx(height),
    left: config.isDesktop ? "62%" : "50%",
  };
};

// =====================================================
// CENTERED TERMINAL (for prompts between sections)
// =====================================================
export const CENTERED_TERMINAL = {
  width: "min(560px, 88vw)",
};
