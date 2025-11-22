import { gsap } from "@/lib/animations";

let hasAnimated = false;

export function initAboutHeroAnimation() {
  // Prevent double animation
  if (hasAnimated) return;
  hasAnimated = true;

  const heroSection = document.querySelector('[data-about-hero]');
  if (!heroSection) return;

  const heroTitle = heroSection.querySelector('[data-hero-title]') as HTMLElement;
  const heroSubtitle = heroSection.querySelector('[data-hero-subtitle]');
  const photoContainer = heroSection.querySelector('[data-photo-container]');
  const photoGlow = heroSection.querySelector('[data-photo-glow]');
  const photoFrame = heroSection.querySelector('[data-photo-frame]');
  const introParagraphs = heroSection.querySelectorAll('[data-intro-paragraph]');
  const statCards = heroSection.querySelectorAll('[data-stat-card]');

  // Create master timeline
  const tl = gsap.timeline({ delay: 0.3 });

  // Tetris animation for hero title
  if (heroTitle) {
    const titleLines = heroTitle.querySelectorAll(':scope > span') as NodeListOf<HTMLElement>;
    const allWords: HTMLElement[] = [];

    titleLines.forEach((line) => {
      const lineText = line.textContent || "";
      const words = lineText.trim().split(/\s+/).filter(w => w.length > 0);
      const originalClasses = line.className.replace('block ', '');

      // Clear line and rebuild with word spans
      line.innerHTML = "";
      line.style.display = "block";

      words.forEach((word) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        // Preserve original line styling
        wordSpan.className = originalClasses;
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";
        wordSpan.style.marginRight = "0.3em";
        line.appendChild(wordSpan);
        allWords.push(wordSpan);
      });
    });

    // Set initial states for all words
    allWords.forEach((word, index) => {
      const isEven = index % 2 === 0;
      gsap.set(word, {
        opacity: 0,
        x: isEven ? -200 : 200,
        y: -100,
        rotationZ: isEven ? -90 : 90,
        scale: 0.5,
      });
    });

    // Animate each word with timeline
    allWords.forEach((word, index) => {
      const baseDelay = index * 0.15;

      tl.to(word, {
        opacity: 1,
        duration: 0.1,
        ease: "none",
      }, baseDelay);

      tl.to(word, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, baseDelay);

      tl.to(word, {
        rotationZ: 0,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      }, baseDelay + 0.25);
    });
  }

  // Subtitle - add to timeline
  if (heroSubtitle) {
    gsap.set(heroSubtitle, { opacity: 0, y: 20 });
    tl.to(heroSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    }, 0.8);
  }

  // Photo container
  if (photoContainer) {
    gsap.set(photoContainer, { y: 40, opacity: 0, scale: 0.9 });
    tl.to(photoContainer, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out",
    }, 0);
  }

  // Photo glow
  if (photoGlow) {
    gsap.set(photoGlow, { scale: 0.8, opacity: 0 });
    tl.to(photoGlow, {
      scale: 1,
      opacity: 0.6,
      duration: 1,
      ease: "power2.out",
    }, 0.1);
  }

  // Photo frame reveal
  if (photoFrame) {
    gsap.set(photoFrame, { clipPath: "circle(0% at 50% 50%)" });
    tl.to(photoFrame, {
      clipPath: "circle(100% at 50% 50%)",
      duration: 1,
      ease: "power3.inOut",
    }, 0.2);
  }

  // Paragraphs
  introParagraphs.forEach((paragraph, index) => {
    gsap.set(paragraph, { opacity: 0, y: 20 });
    tl.to(paragraph, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    }, 1 + index * 0.12);
  });

  // Stats
  statCards.forEach((stat, index) => {
    gsap.set(stat, { opacity: 0, scale: 0.8, y: 15 });
    tl.to(stat, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, 1.3 + index * 0.1);
  });
}

// Reset function for navigation
export function resetAboutHeroAnimation() {
  hasAnimated = false;
}
