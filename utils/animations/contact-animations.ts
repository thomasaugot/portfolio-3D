import { gsap, ScrollTrigger, THREE } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

let heroTitleTimeline: gsap.core.Timeline | null = null;
let contactHeroScrollTrigger: ScrollTrigger | null = null;

const isLowPerformanceDevice = () => {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as any).connection;
  const memory = (performance as any).memory;

  return (
    (connection && connection.saveData) ||
    (memory && memory.jsHeapSizeLimit < 1073741824) ||
    navigator.hardwareConcurrency < 4
  );
};

// Title animation (tetris-style)
function initContactHeroTitleAnimation() {
  const badge = document.querySelector("[data-hero-badge]");
  const lines = document.querySelectorAll("[data-hero-line]");
  const subtitle = document.querySelector("[data-hero-subtitle]");
  const contactInfo = document.querySelector("[data-hero-contact-info]");
  const formWrapper = document.querySelector("[data-contact-form-wrapper]");

  if (!badge || lines.length < 2 || !subtitle) return null;

  const dot = badge.querySelector(".animate-pulse") as HTMLElement;

  gsap.set([badge, subtitle], { opacity: 0 });
  if (contactInfo) gsap.set(contactInfo, { opacity: 0, y: 20 });
  if (formWrapper) gsap.set(formWrapper, { opacity: 0, x: 50 });
  if (dot) {
    gsap.set(dot, { opacity: 0, y: -50, scale: 0, borderRadius: "0%" });
  }

  const tl = gsap.timeline({ delay: 0.8 });

  // Fade in badge
  tl.to(badge, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  });

  const line1 = lines[0] as HTMLElement;
  const line2 = lines[1] as HTMLElement;

  // Split line2 (the gradient text) for tetris-style animation
  const text = line2.textContent?.trim() || "";
  const chars = text.split("");
  const midPoint = Math.ceil(chars.length / 2);
  const firstHalf = chars.slice(0, midPoint).join("");
  const secondHalf = chars.slice(midPoint).join("");

  line2.style.position = "relative";
  line2.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "flex-start";
  wrapper.style.gap = "0";

  const leftPiece = document.createElement("span");
  leftPiece.textContent = firstHalf;
  leftPiece.className =
    "tetris-left gradient-primary bg-clip-text text-transparent font-fun font-extralight tracking-tighter";
  leftPiece.style.display = "inline-block";
  leftPiece.style.whiteSpace = "nowrap";
  leftPiece.style.transformOrigin = "center center";
  wrapper.appendChild(leftPiece);

  const rightPiece = document.createElement("span");
  rightPiece.textContent = secondHalf;
  rightPiece.className =
    "tetris-right gradient-primary bg-clip-text text-transparent font-fun font-extralight tracking-tighter";
  rightPiece.style.display = "inline-block";
  rightPiece.style.whiteSpace = "nowrap";
  rightPiece.style.transformOrigin = "center center";
  wrapper.appendChild(rightPiece);

  line2.appendChild(wrapper);

  // Set initial states
  gsap.set(line1, { opacity: 0, y: -150 });
  gsap.set(line2, { opacity: 1 });
  gsap.set(leftPiece, { opacity: 0, x: -300, rotationZ: 90 });
  gsap.set(rightPiece, { opacity: 0, x: 300 });

  // Animate left piece sliding in
  tl.to(
    leftPiece,
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
    },
    0.2
  );

  // Rotate left piece into place
  tl.to(
    leftPiece,
    {
      rotationZ: 0,
      duration: 0.5,
      ease: "back.out(2)",
    },
    0.7
  );

  // Animate first line sliding down
  tl.to(
    line1,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
    },
    0.9
  );

  // Animate right piece sliding in
  tl.to(
    rightPiece,
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
    },
    0.6
  );

  // Animate subtitle
  tl.to(
    subtitle,
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    },
    1.5
  );

  // Animate contact info
  if (contactInfo) {
    tl.to(
      contactInfo,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      },
      1.7
    );
  }

  // Animate form wrapper
  if (formWrapper) {
    tl.to(
      formWrapper,
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      1.9
    );
  }

  // Animate dot with bounce
  if (dot) {
    tl.to(
      dot,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        borderRadius: "50%",
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      2.1
    );
  }

  return tl;
}

// Hero scroll animation
function initContactHeroScrollAnimation() {
  const waitForScene = () => {
    const heroScene = (window as any).__contactHeroScene;
    if (!heroScene) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const heroContainer = document.querySelector(
      '[data-3d-container="contact-hero"]'
    ) as HTMLElement;
    const heroSection = heroContainer?.parentElement?.parentElement;
    const heroContent = heroSection?.querySelector(
      "[data-contact-hero-content]"
    );
    const scrollIndicator = heroSection?.querySelector(".absolute.bottom-12");

    if (!heroContainer || !heroSection || !heroContent) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const initMeasure = perfMonitor.startMeasure("contact-hero-scroll-init");

    const { camera, hexFloor, networkGroup, nodes, connections } = heroScene;
    const lowPerf = isLowPerformanceDevice();
    const scrubSpeed = lowPerf ? 1.5 : 2.2;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=150%", // Shorter scroll - ends at morphed state
        scrub: scrubSpeed,
        pin: true,
        id: "contact-hero-scroll",
        anticipatePin: 1,
        snap: {
          snapTo: [0, 1],
          duration: { min: 0.4, max: 0.8 },
          delay: 0.1,
          ease: "power2.inOut",
        },
        onRefresh: (self) => {
          contactHeroScrollTrigger = self;
        },
      },
    });

    // Fade out hero content (keep centered)
    if (heroContent) {
      tl.to(
        heroContent,
        {
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        0
      );
    }

    // Fade out scroll indicator
    if (scrollIndicator) {
      tl.to(
        scrollIndicator,
        {
          opacity: 0,
          y: 15,
          scale: 0.85,
          duration: 0.2,
          ease: "power1.in",
        },
        0
      );
    }

    // Camera movement - zoom in and rotate around the hexagon floor
    const startX = camera.position.x;
    const startZ = camera.position.z;
    const startY = camera.position.y;
    const radius = Math.sqrt(startX * startX + startZ * startZ);

    // First camera movement - closer and slight rotation
    tl.to(
      camera.position,
      {
        x: radius * Math.cos(Math.PI / 8),
        z: radius * Math.sin(Math.PI / 8) + 80,
        y: startY + 40,
        duration: 0.5,
        ease: "sine.inOut",
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
        },
      },
      0.12
    );

    // Second camera movement - zoom in more and continue rotation
    tl.to(
      camera.position,
      {
        x: radius * Math.cos(Math.PI / 4) * 1.1,
        z: radius * Math.sin(Math.PI / 4) * 1.1 + 150,
        y: startY + 140,
        duration: 0.7,
        ease: "sine.inOut",
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
        },
      },
      0.5
    );

    // Rotate and tilt the hexagon floor
    tl.to(
      hexFloor.rotation,
      {
        x: 0, // Keep it flat (was Math.PI / 3.5)
        y: Math.PI / 5, // Only spin horizontally
        z: 0, // No roll (was Math.PI / 36)
        duration: 1.3,
        ease: "sine.inOut",
      },
      0.18
    );

    // Move the hexagon floor
    tl.to(
      hexFloor.position,
      {
        y: -60,
        z: -70,
        x: -10,
        duration: 1.3,
        ease: "sine.inOut",
      },
      0.18
    );

    // Morph nodes into envelope icon at title position
    if (nodes && nodes.length > 0) {
      // Fade out connections first
      if (connections && connections.length > 0) {
        connections.forEach((connection: any) => {
          const material = connection.material as THREE.LineBasicMaterial;
          tl.to(
            material,
            {
              opacity: 0,
              duration: 0.3,
              ease: "sine.in",
            },
            0.35
          );
        });
      }

      // Stop network rotation
      tl.to(
        networkGroup.rotation,
        {
          y: 0,
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.4
      );

      // Collapse all nodes into single point
      nodes.forEach((node: any, index: number) => {
        const delay = 0.45 + (index / nodes.length) * 0.2;

        tl.to(
          node.position,
          {
            x: (node as any).envelopePosition.x,
            y: (node as any).envelopePosition.y,
            z: (node as any).envelopePosition.z,
            duration: 0.6,
            ease: "power2.inOut",
          },
          delay
        );

        // Fade out nodes as they collapse
        const material = node.material as THREE.MeshPhongMaterial;
        tl.to(
          material,
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          delay + 0.4
        );
      });
    }

    // Fade out original title (h1) and subtitle
    const titleElement = heroContent?.querySelector("h1");
    const subtitleElement = heroContent?.querySelector("[data-hero-subtitle]");

    if (titleElement) {
      tl.to(
        titleElement,
        {
          opacity: 0,
          y: -30,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.4
      );
    }

    if (subtitleElement) {
      tl.to(
        subtitleElement,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.4
      );
    }

    // TETRIS ANIMATED THANK YOU MESSAGE
    const thankYouMessage = heroSection?.querySelector(
      "[data-thank-you-message]"
    ) as HTMLElement;
    const thankYouTitle = thankYouMessage?.querySelector(
      "[data-thank-you-title]"
    ) as HTMLElement;
    const thankYouSubtitle = thankYouMessage?.querySelector(
      "[data-thank-you-subtitle]"
    ) as HTMLElement;

    if (thankYouMessage && thankYouTitle && thankYouSubtitle) {
      // Split the title for tetris animation
      const text = thankYouTitle.textContent?.trim() || "";
      const chars = text.split("");
      const midPoint = Math.ceil(chars.length / 2);
      const firstHalf = chars.slice(0, midPoint).join("");
      const secondHalf = chars.slice(midPoint).join("");

      thankYouTitle.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "flex-start";
      wrapper.style.gap = "0";

      const leftPiece = document.createElement("span");
      leftPiece.textContent = firstHalf;
      leftPiece.className =
        "gradient-primary bg-clip-text text-transparent font-fun font-extralight tracking-tighter";
      leftPiece.style.display = "inline-block";
      leftPiece.style.whiteSpace = "nowrap";
      wrapper.appendChild(leftPiece);

      const rightPiece = document.createElement("span");
      rightPiece.textContent = secondHalf;
      rightPiece.className =
        "gradient-primary bg-clip-text text-transparent font-fun font-extralight tracking-tighter";
      rightPiece.style.display = "inline-block";
      rightPiece.style.whiteSpace = "nowrap";
      wrapper.appendChild(rightPiece);

      thankYouTitle.appendChild(wrapper);

      // Set initial states
      gsap.set(leftPiece, { opacity: 0, x: -200, rotationZ: 90 });
      gsap.set(rightPiece, { opacity: 0, x: 200 });
      gsap.set(thankYouSubtitle, { opacity: 0, y: 20 });

      // TETRIS ANIMATION - starts RIGHT AFTER dots finish collapsing (at ~1.5)
      tl.to(
        leftPiece,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        1.5
      );

      tl.to(
        leftPiece,
        {
          rotationZ: 0,
          duration: 0.5,
          ease: "back.out(2)",
        },
        2.0
      );

      tl.to(
        rightPiece,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        1.8
      );

      tl.to(
        thankYouSubtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        2.3
      );
    }

    // Fade out network dots
    tl.to(
      networkGroup,
      {
        opacity: 0,
        duration: 0.4,
        ease: "sine.in",
      },
      0.9
    );

    initMeasure();
  };

  waitForScene();

  return () => {
    if (contactHeroScrollTrigger) contactHeroScrollTrigger.kill();
    contactHeroScrollTrigger = null;
  };
}

// Main initialization function
export function initContactHeroAnimation() {
  const waitForScene = () => {
    const heroScene = (window as any).__contactHeroScene;
    if (!heroScene) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const measure = perfMonitor.startMeasure("contact-hero-animation-init");

    const titleAnimation = initContactHeroTitleAnimation();
    if (titleAnimation) {
      heroTitleTimeline = titleAnimation;
    }

    measure();
  };

  waitForScene();

  return () => {
    if (heroTitleTimeline) heroTitleTimeline.kill();
    heroTitleTimeline = null;
  };
}

// Export the scroll animation separately
export { initContactHeroScrollAnimation };
