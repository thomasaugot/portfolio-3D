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
  const isSmallDesktop = width >= 1024 && width < 1280;
  const isMobile = width < 768 || (isTabletSize && isPortrait);
  const isTinyMobile = isMobile && width <= 380;
  return {
    width,
    height,
    isMobile,
    isTinyMobile,
    isTallMobile: isMobile && height > 800,
    isTabletPortrait: isTabletSize && isPortrait,
    isTablet: isTabletSize && !isPortrait,
    isSmallDesktop,
    useCompactAboutLayout: isMobile || isTabletSize || isSmallDesktop,
    isDesktop: width >= 1024 || (isTabletSize && !isPortrait),
  };
};

// Compute a clamped numeric value matching a CSS clamp()
const clamp = (min: number, pct: number, max: number, viewport: number) =>
  Math.max(min, Math.min(max, Math.round(viewport * pct)));

const getMobileTerminalMaxHeight = (viewportHeight: number) =>
  Math.floor(viewportHeight * 0.75);

const getTerminalMaxHeight = (viewportHeight: number) =>
  Math.floor(viewportHeight * 0.85);

const capTerminalHeight = (height: number, viewportHeight: number) =>
  Math.min(height, getTerminalMaxHeight(viewportHeight));

const getMobileTerminalWidth = (viewportWidth: number) =>
  Math.max(280, Math.min(600, viewportWidth - 16));

export const MOBILE_TERMINAL_WIDTH_CSS = "min(600px, calc(100vw - 16px))";

// =====================================================
// MEASUREMENT STORE
// Populated by StageMeasurer during the loading phase.
// Once set, size functions use real measured heights instead of estimates.
// =====================================================
const measured: Partial<Record<string, number>> = {};
const measuredPortfolio: Partial<Record<string, number>> = {};

export const setMeasuredStageHeight = (stage: string, height: number) => {
  if (measured[stage] === height) return false;
  measured[stage] = height;
  return true;
};

export const setMeasuredPortfolioHeight = (key: string, height: number) => {
  if (measuredPortfolio[key] === height) return false;
  measuredPortfolio[key] = height;
  return true;
};

const getMeasured = (stage: string): number | null =>
  measured[stage] ?? null;

const getMeasuredPortfolio = (key: string): number | null =>
  measuredPortfolio[key] ?? null;

const getRenderedElementHeight = (element: HTMLElement | null): number | null => {
  if (!element) return null;

  const rectHeight = Math.round(element.getBoundingClientRect().height);
  if (rectHeight > 0) return rectHeight;

  const scrollHeight = Math.round(element.scrollHeight);
  if (scrollHeight > 0) return scrollHeight;

  return element.offsetHeight > 0 ? element.offsetHeight : null;
};

const getPortfolioMeasuredShellHeight = (key: string): number | null => {
  const storedHeight = getMeasuredPortfolio(key);
  if (storedHeight) return storedHeight;

  if (typeof document === "undefined") return null;

  const shell = document.querySelector(
    `[data-portfolio-terminal-shell-measurer="${key}"]`
  ) as HTMLElement | null;

  const shellHeight = getRenderedElementHeight(shell);
  if (shellHeight) return shellHeight;

  const wrapper = document.querySelector(
    `[data-portfolio-terminal-measurer="${key}"]`
  ) as HTMLElement | null;

  return getRenderedElementHeight(wrapper);
};

const getDomMeasuredStageHeight = (stage: string): number | null => {
  if (typeof document === "undefined") return null;

  const exactMeasurer = document.querySelector(`[data-stage-measurer-exact="${stage}"]`) as HTMLElement | null;
  const exactHeight = getRenderedElementHeight(exactMeasurer);
  if (exactHeight) return exactHeight;

  const measurer = document.querySelector(`[data-stage-measurer="${stage}"]`) as HTMLElement | null;
  const height = getRenderedElementHeight(measurer);
  if (height) return height;

  return null;
};

const getPortfolioMeasuredHeight = (state: "intro" | "cta"): number | null => {
  return getPortfolioMeasuredShellHeight(state);
};

const getPortfolioMeasuredProjectHeight = (projectIndex: number): number | null => {
  return getPortfolioMeasuredShellHeight(`project-${projectIndex}`);
};

export const hasPortfolioMeasurement = (key: string): boolean =>
  getPortfolioMeasuredShellHeight(key) !== null;

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

export const waitForStablePortfolioProjectMeasurement = async (
  projectIndex: number
): Promise<number | null> => {
  if (typeof window === "undefined") return null;

  if (typeof document !== "undefined" && "fonts" in document) {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  }

  return new Promise<number | null>((resolve) => {
    let lastHeight: number | null = null;
    let stableFrames = 0;
    const requiredStableFrames = 4;

    const tick = () => {
      const height = getPortfolioMeasuredProjectHeight(projectIndex);

      if (height !== null && height > 0) {
        stableFrames = height === lastHeight ? stableFrames + 1 : 0;
        lastHeight = height;

        if (stableFrames >= requiredStableFrames) {
          resolve(height);
          return;
        }
      } else {
        stableFrames = 0;
        lastHeight = null;
      }
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
};

export const waitForStablePortfolioMeasurement = async (
  key: string
): Promise<number | null> => {
  if (typeof window === "undefined") return null;

  if (typeof document !== "undefined" && "fonts" in document) {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  }

  return new Promise<number | null>((resolve) => {
    let lastHeight: number | null = null;
    let stableFrames = 0;
    const requiredStableFrames = 4;

    const tick = () => {
      const height = getPortfolioMeasuredShellHeight(key);

      if (height !== null && height > 0) {
        stableFrames = height === lastHeight ? stableFrames + 1 : 0;
        lastHeight = height;

        if (stableFrames >= requiredStableFrames) {
          resolve(height);
          return;
        }
      } else {
        stableFrames = 0;
        lastHeight = null;
      }
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
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
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
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width:  clamp(260, 0.40, 400, config.width),
      height,
      widthCss:  "clamp(260px, 40vw, 400px)",
      heightCss: `${height}px`,
      left: "35%",
    };
  }

  if (config.isMobile) {
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width: getMobileTerminalWidth(config.width),
      height,
      widthCss: MOBILE_TERMINAL_WIDTH_CSS,
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  // Desktop
  const height = capTerminalHeight(
    measuredH ?? getLoaderTerminalSize().height,
    config.height
  );
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
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width:    clamp(300, 0.68, 540, config.width),
      height,
      widthCss:  "clamp(300px, 68vw, 540px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  if (config.isTablet) {
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width:    clamp(300, 0.48, 480, config.width),
      height,
      widthCss:  "clamp(300px, 48vw, 480px)",
      heightCss: `${height}px`,
      left: "67%",
    };
  }

  if (config.isMobile) {
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width: getMobileTerminalWidth(config.width),
      height,
      widthCss: MOBILE_TERMINAL_WIDTH_CSS,
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  // Desktop
  const height = capTerminalHeight(
    measuredH ?? getLoaderTerminalSize().height,
    config.height
  );
  return {
    width:    clamp(560, 0.54, 840, config.width),
    height,
    widthCss:  "clamp(560px, 54vw, 840px)",
    heightCss: `${height}px`,
    left: config.isSmallDesktop ? "66%" : "63.5%",
  };
};

// =====================================================
// PROJECTS TERMINAL (Intro state — centered, compact)
// =====================================================
export const getProjectsIntroSize = () => {
  const config = getViewportConfig();
  const measuredH = getPortfolioMeasuredHeight("intro");
  const width = config.isMobile
    ? getMobileTerminalWidth(config.width)
    : config.isTablet
      ? clamp(320, 0.56, 520, config.width)
      : clamp(280, 0.88, 640, config.width);
  const height = capTerminalHeight(measuredH ?? 0, config.height);

  return {
    width,
    height,
    widthCss: config.isMobile
      ? MOBILE_TERMINAL_WIDTH_CSS
      : config.isTablet
        ? "clamp(320px, 56vw, 520px)"
        : "clamp(280px, 88vw, 640px)",
    heightCss: `${height}px`,
  };
};

// =====================================================
// PROJECTS TERMINAL (Expanded state — left side, taller)
// =====================================================
export const getProjectsExpandedSize = (projectIndex = 0) => {
  const config = getViewportConfig();
  const measuredH = getPortfolioMeasuredProjectHeight(projectIndex);
  const navbarHeight = 80;
  const padding = config.isTinyMobile ? 6 : config.isMobile ? 8 : config.isTablet ? 24 : 32;

  const width = config.isTablet
    ? clamp(380, 0.60, 600, config.width)
    : config.isSmallDesktop
    ? clamp(420, 0.52, 620, config.width)
    : config.isDesktop
    ? clamp(340, 0.42, 680, config.width)
    : getMobileTerminalWidth(config.width);

  const maxMobileTerminalHeight = getMobileTerminalMaxHeight(config.height);
  const maxTerminalHeight = getTerminalMaxHeight(config.height);
  const availableHeight = config.isMobile
    ? Math.min(config.height - padding * 2, maxMobileTerminalHeight)
    : Math.min(config.height - navbarHeight - padding * 2, maxTerminalHeight);
  const mobileThreeDReserve = config.isMobile
    ? clamp(
        config.isTinyMobile ? 220 : 235,
        config.isTinyMobile ? 0.3 : 0.32,
        config.isTinyMobile ? 340 : 420,
        config.height
      )
    : 0;
  const height = config.isMobile
    ? Math.min((measuredH ?? 0) + mobileThreeDReserve, availableHeight)
    : Math.min(measuredH ?? 0, availableHeight);

  const left = config.isTablet
    ? config.width * 0.31
    : config.isSmallDesktop
      ? config.width * 0.30
    : config.isDesktop
      ? config.width * 0.28
      : config.width / 2;
  const top = config.isMobile
    ? config.height / 2
    : config.isTablet
      ? config.height / 2
      : navbarHeight + availableHeight / 2;

  return { width, height, top, left, xPercent: -50, yPercent: -50, scale: 1 };
};

// =====================================================
// PROJECTS CTA TERMINAL (Centered, for final CTA slide)
// =====================================================
export const getProjectsCtaSize = () => {
  const config = getViewportConfig();
  const measuredH = getPortfolioMeasuredHeight("cta");
  const padding = config.isMobile ? 8 : config.isTablet ? 24 : 32;

  const width = config.isTablet
    ? clamp(360, 0.58, 540, config.width)
    : config.isSmallDesktop
    ? clamp(400, 0.50, 580, config.width)
    : config.isDesktop
    ? clamp(360, 0.46, 600, config.width)
    : getMobileTerminalWidth(config.width);

  const height = Math.min(measuredH ?? 0, getTerminalMaxHeight(config.height));

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
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width:    clamp(300, 0.62, 520, config.width),
      height,
      widthCss:  "clamp(300px, 62vw, 520px)",
      heightCss: `${height}px`,
      left: "50%",
    };
  }

  if (config.isTablet) {
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width:    clamp(300, 0.44, 460, config.width),
      height,
      widthCss:  "clamp(300px, 44vw, 460px)",
      heightCss: `${height}px`,
      left: "67%",
    };
  }

  if (config.isSmallDesktop) {
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width:    clamp(400, 0.42, 600, config.width),
      height,
      widthCss:  "clamp(400px, 42vw, 600px)",
      heightCss: `${height}px`,
      left: "67%",
    };
  }

  if (config.isMobile) {
    const height = capTerminalHeight(
      measuredH ?? getLoaderTerminalSize().height,
      config.height
    );
    return {
      width: getMobileTerminalWidth(config.width),
      height,
      widthCss: MOBILE_TERMINAL_WIDTH_CSS,
      heightCss: `${height}px`,
      left: "50%",
      top: "calc(50% + 32px)",
    };
  }

  // Desktop
  const height = capTerminalHeight(
    measuredH ?? getLoaderTerminalSize().height,
    config.height
  );
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
