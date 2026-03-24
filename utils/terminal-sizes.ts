/**
 * Terminal Size Configurations (Single Source of Truth)
 *
 * All dimensions use clamp(min, preferred-vw/vh, max) so terminals scale
 * fluidly across every viewport instead of hitting a hard px cap.
 * Numeric values mirror the CSS clamp for GSAP animation targets.
 *
 * Breakpoint order in each function: portrait-tablet → landscape-tablet → mobile → desktop
 */

// Viewport detection helper
export const getViewportConfig = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 375;
  const height = typeof window !== "undefined" ? window.innerHeight : 812;
  const isPortrait = height > width;
  const isTabletSize = width >= 768 && width < 1024;
  const isMobile = width < 768 || (isTabletSize && isPortrait);
  return {
    width,
    height,
    isMobile,
    isTallMobile: isMobile && height > 800,
    isTabletPortrait: isTabletSize && isPortrait,
    isTablet: isTabletSize && !isPortrait,
    isDesktop: width >= 1024 || (isTabletSize && !isPortrait),
  };
};

// Compute a clamped numeric value matching a CSS clamp()
const clamp = (min: number, pct: number, max: number, viewport: number) =>
  Math.max(min, Math.min(max, Math.round(viewport * pct)));

// =====================================================
// MEASUREMENT STORE
// Populated by StageMeasurer during the loading phase.
// Once set, size functions use real measured heights instead of estimates.
// =====================================================
const measured: Partial<Record<string, number>> = {};

export const setMeasuredStageHeight = (stage: string, height: number) => {
  if (measured[stage] === height) return false;
  measured[stage] = height;
  return true;
};

const getMeasured = (stage: string): number | null =>
  measured[stage] ?? null;

const getDomMeasuredStageHeight = (stage: string): number | null => {
  if (typeof document === "undefined") return null;

  const exactMeasurer = document.querySelector(`[data-stage-measurer-exact="${stage}"]`) as HTMLElement | null;
  if (exactMeasurer?.offsetHeight) return exactMeasurer.offsetHeight;

  const measurer = document.querySelector(`[data-stage-measurer="${stage}"]`) as HTMLElement | null;
  if (measurer?.offsetHeight) return measurer.offsetHeight;

  return null;
};

const getResolvedStageHeight = (stage: string): number | null =>
  getDomMeasuredStageHeight(stage) ?? getMeasured(stage);

export const hasStageMeasurement = (stage: string): boolean =>
  getResolvedStageHeight(stage) !== null;

export const getStageMeasurement = (stage: string): number | null =>
  getResolvedStageHeight(stage);

export const waitForStableStageMeasurement = async (stage: string): Promise<number | null> => {
  if (typeof window === "undefined") return null;

  if (typeof document !== "undefined" && "fonts" in document) {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  }

  return new Promise<number | null>((resolve) => {
    let attempts = 0;
    let lastHeight: number | null = null;
    let stableFrames = 0;
    const maxAttempts = 90;
    const requiredStableFrames = 4;

    const tick = () => {
      const height = getStageMeasurement(stage);

      if (height !== null) {
        stableFrames = height === lastHeight ? stableFrames + 1 : 0;
        lastHeight = height;

        if (stableFrames >= requiredStableFrames) {
          resolve(height);
          return;
        }
      }

      if (attempts >= maxAttempts) {
        resolve(height);
        return;
      }

      attempts += 1;
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
};

// =====================================================
// LOADER TERMINAL
// =====================================================
export const getLoaderTerminalSize = () => {
  const config = getViewportConfig();
  const width = config.isMobile
    ? clamp(280, 0.88, 340, config.width)
    : clamp(300, 0.30, 380, config.width);
  const height = config.isMobile ? 220 : 250;
  return {
    width,
    height,
    widthCss: config.isMobile ? "clamp(280px, 88vw, 340px)" : "clamp(300px, 30vw, 380px)",
    heightCss: config.isMobile ? "220px" : "250px",
  };
};

// =====================================================
// HERO TERMINAL
// =====================================================
export const getHeroTerminalSize = () => {
  const config = getViewportConfig();
  const measuredH = getResolvedStageHeight("hero");

  if (config.isTabletPortrait) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:  clamp(280, 0.60, 500, config.width),
      height,
      widthCss:  "clamp(280px, 60vw, 500px)",
      heightCss: `${height}px`,
      left: "35%",
      top: "65%",
    };
  }

  if (config.isTablet) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:  clamp(260, 0.40, 400, config.width),
      height,
      widthCss:  "clamp(260px, 40vw, 400px)",
      heightCss: `${height}px`,
      left: "35%",
    };
  }

  if (config.isMobile) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:  clamp(280, 0.92, 520, config.width),
      height,
      widthCss:  "clamp(280px, 92vw, 520px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  // Desktop
  const height = measuredH ?? getLoaderTerminalSize().height;
  return {
    width:  clamp(400, 0.44, 600, config.width),
    height,
    widthCss:  "clamp(400px, 44vw, 600px)",
    heightCss: `${height}px`,
    left: "35%",
  };
};

// =====================================================
// ABOUT TERMINAL
// =====================================================
export const getAboutTerminalSize = () => {
  const config = getViewportConfig();
  const measuredH = getResolvedStageHeight("about");

  if (config.isTabletPortrait) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:    clamp(300, 0.68, 540, config.width),
      height,
      widthCss:  "clamp(300px, 68vw, 540px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  if (config.isTablet) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:    clamp(300, 0.48, 480, config.width),
      height,
      widthCss:  "clamp(300px, 48vw, 480px)",
      heightCss: `${height}px`,
      left: "65%",
    };
  }

  if (config.isMobile) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:    clamp(280, 0.92, 600, config.width),
      height,
      widthCss:  "clamp(280px, 92vw, 600px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  // Desktop
  const height = measuredH ?? getLoaderTerminalSize().height;
  return {
    width:    clamp(480, 0.48, 720, config.width),
    height,
    widthCss:  "clamp(480px, 48vw, 720px)",
    heightCss: `${height}px`,
    left: "65%",
  };
};

// =====================================================
// PROJECTS TERMINAL (Intro state — centered, compact)
// =====================================================
export const getProjectsIntroSize = () => {
  const config = getViewportConfig();

  const width = clamp(280, 0.88, 640, config.width);
  const height = config.isTallMobile
    ? clamp(300, 0.58, 520, config.height)
    : config.isMobile
      ? clamp(280, 0.75, 560, config.height)
      : clamp(320, 0.52, 540, config.height);

  return {
    width,
    height,
    widthCss: "clamp(280px, 88vw, 640px)",
    heightCss: config.isTallMobile
      ? "clamp(300px, 58vh, 520px)"
      : config.isMobile
        ? "clamp(280px, 75vh, 560px)"
        : "clamp(320px, 52vh, 540px)",
  };
};

// =====================================================
// PROJECTS TERMINAL (Expanded state — left side, taller)
// =====================================================
export const getProjectsExpandedSize = () => {
  const config = getViewportConfig();
  const navbarHeight = 80;
  const padding = config.isMobile ? 8 : config.isTablet ? 24 : 32;

  const width = config.isDesktop
    ? clamp(340, 0.42, 680, config.width)
    : config.width - padding * 2;

  const availableHeight = config.height - navbarHeight - padding * 2;
  const height = config.isDesktop
    ? Math.min(720, availableHeight * 0.96)
    : config.isMobile
      ? Math.min(availableHeight * 0.97, availableHeight - 8)
      : Math.min(540, availableHeight * 0.92);

  const left = config.isDesktop ? config.width * 0.28 : config.width / 2;
  const top = config.isMobile
    ? config.height / 2
    : navbarHeight + availableHeight / 2;

  return { width, height, top, left, xPercent: -50, yPercent: -50, scale: 1 };
};

// =====================================================
// PROJECTS CTA TERMINAL (Centered, for final CTA slide)
// =====================================================
export const getProjectsCtaSize = () => {
  const config = getViewportConfig();
  const navbarHeight = 80;
  const padding = config.isMobile ? 16 : config.isTablet ? 24 : 32;

  const width = config.isDesktop
    ? clamp(360, 0.46, 600, config.width)
    : config.width - padding * 2;

  const availableHeight = config.height - navbarHeight - padding * 2;
  const height = config.isDesktop
    ? Math.min(460, availableHeight * 0.7)
    : config.isMobile
      ? config.isTallMobile
        ? Math.min(480, availableHeight * 0.58)
        : Math.min(availableHeight * 0.93, availableHeight - 20)
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
  const measuredH = getResolvedStageHeight("contact");

  if (config.isTabletPortrait) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:    clamp(300, 0.62, 520, config.width),
      height,
      widthCss:  "clamp(300px, 62vw, 520px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  if (config.isTablet) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:    clamp(300, 0.44, 460, config.width),
      height,
      widthCss:  "clamp(300px, 44vw, 460px)",
      heightCss: `${height}px`,
      left: "62%",
    };
  }

  if (config.isMobile) {
    const height = measuredH ?? getLoaderTerminalSize().height;
    return {
      width:    clamp(280, 0.92, 580, config.width),
      height,
      widthCss:  "clamp(280px, 92vw, 580px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  // Desktop
  const height = measuredH ?? getLoaderTerminalSize().height;
  return {
    width:    clamp(400, 0.44, 640, config.width),
    height,
    widthCss:  "clamp(400px, 44vw, 640px)",
    heightCss: `${height}px`,
    left: "62%",
  };
};

// =====================================================
// CENTERED TERMINAL (for prompts between sections)
// =====================================================
export const CENTERED_TERMINAL = {
  width: "clamp(280px, 88vw, 560px)",
};
