import { gsap, ScrollTrigger } from "@/lib/animations";

let tetrisScrollTrigger: ScrollTrigger | null = null;

export function initTetrisTextAnimation() {
  if (tetrisScrollTrigger) {
    tetrisScrollTrigger.kill();
    tetrisScrollTrigger = null;
  }

  const header = document.querySelector("[data-projects-header]") || document.querySelector("[data-blog-header]");
  if (!header) return;

  const subtitle = header.querySelector(
    "[data-projects-subtitle]"
  ) as HTMLElement || header.querySelector("[data-blog-subtitle]") as HTMLElement;
  const title = header.querySelector("[data-projects-title]") as HTMLElement || header.querySelector("[data-blog-title]") as HTMLElement;

  if (!title) return;

  gsap.set(subtitle, { opacity: 0 });

  // Check if this is a two-part title (portfolio page)
  const isTwoPartTitle = title.hasAttribute("data-two-part-title");
  let allWords: HTMLElement[] = [];

  if (isTwoPartTitle) {
    // For two-part titles, work with lines not individual words
    const lines = title.querySelectorAll(
      "[data-hero-line]"
    ) as NodeListOf<HTMLElement>;

    lines.forEach((line, lineIndex) => {
      const text = line.textContent?.trim() || "";
      const words = text.split(" ");

      // Store original classes
      const originalClasses = line.className;

      line.innerHTML = "";

      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.className = originalClasses;
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";
        wordSpan.style.marginRight = "0.5rem";

        line.appendChild(wordSpan);
        allWords.push(wordSpan);
      });
    });
  } else {
    // Original single-line logic for homepage
    const titleText = title.textContent?.trim() || "";
    const words = titleText.split(" ");

    title.innerHTML = "";

    words.forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.textContent = word;
      wordSpan.className = "font-normal";
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";
      wordSpan.style.marginRight = "0.5rem";
      title.appendChild(wordSpan);
      allWords.push(wordSpan);
    });
  }

  allWords.forEach((word, index) => {
    const isEven = index % 2 === 0;
    const startX = isEven ? -200 : 200;
    const startRotation = isEven ? -90 : 90;

    gsap.set(word, {
      opacity: 0,
      x: startX,
      y: -100,
      rotationZ: startRotation,
      scale: 0.5,
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: header,
      start: "top 80%",
      end: "top 50%",
      toggleActions: "play none none none",
      id: "projects-title",
    },
  });

  allWords.forEach((word, index) => {
    const baseDelay = index * 0.15;

    tl.to(
      word,
      {
        opacity: 1,
        duration: 0.1,
        ease: "none",
      },
      baseDelay
    );

    tl.to(
      word,
      {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      baseDelay
    );

    tl.to(
      word,
      {
        rotationZ: 0,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      },
      baseDelay + 0.25
    );
  });

  if (subtitle) {
    const lastWordDelay = (allWords.length - 1) * 0.15 + 0.6;

    tl.to(
      subtitle,
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      lastWordDelay
    );
  }

  if (tl.scrollTrigger) {
    tetrisScrollTrigger = tl.scrollTrigger as ScrollTrigger;
  }

  return () => {
    if (tetrisScrollTrigger) {
      tetrisScrollTrigger.kill();
      tetrisScrollTrigger = null;
    }
  };
}
