import { gsap } from "@/lib/animations/gsap";

/**
 * Blog Article Hero Animation
 * Animates the hero section with title, metadata, and image entrance
 */
export function initBlogArticleHeroAnimation() {
  const heroSection = document.querySelector('[data-blog-article-hero]');
  if (!heroSection) return;

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" }
  });

  // Animate category badge
  timeline.from('[data-article-category]', {
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    ease: "back.out(1.7)"
  });

  // Animate title lines
  const titleLines = gsap.utils.toArray('[data-article-title-line]');
  timeline.from(titleLines, {
    opacity: 0,
    y: 100,
    rotateX: -45,
    stagger: 0.15,
    duration: 1,
    ease: "power4.out"
  }, "-=0.3");

  // Animate metadata (author, date, read time)
  timeline.from('[data-article-meta]', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1
  }, "-=0.5");

  // Animate hero image with mask reveal
  timeline.from('[data-article-hero-image]', {
    opacity: 0,
    scale: 1.2,
    duration: 1.5,
    ease: "power2.out"
  }, "-=0.8");

  timeline.from('[data-article-hero-image]', {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 1.2,
    ease: "power3.inOut"
  }, "-=1.5");

  return () => {
    timeline.kill();
  };
}

/**
 * Blog Article Content Scroll Animation
 * Reveals content sections as user scrolls
 */
export function initBlogArticleScrollAnimation() {
  const contentSections = gsap.utils.toArray('[data-article-section]');

  contentSections.forEach((section: any) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "top 30%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out"
    });
  });

  // Parallax effect on images within content
  const contentImages = gsap.utils.toArray('[data-article-content-image]');
  contentImages.forEach((img: any) => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      },
      y: -50,
      ease: "none"
    });
  });

  return () => {
    contentSections.forEach((section: any) => {
      const trigger = (section as any).scrollTrigger;
      if (trigger) trigger.kill();
    });
  };
}

/**
 * Comment Section Entrance Animation
 * Animates the comment form and existing comments
 */
export function initCommentSectionAnimation() {
  const commentSection = document.querySelector('[data-comment-section]');
  if (!commentSection) return;

  gsap.from('[data-comment-section]', {
    scrollTrigger: {
      trigger: '[data-comment-section]',
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 80,
    duration: 1,
    ease: "power3.out"
  });

  // Animate individual comments
  const comments = gsap.utils.toArray('[data-comment-item]');
  gsap.from(comments, {
    scrollTrigger: {
      trigger: '[data-comment-list]',
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    x: -30,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out"
  });

  return () => {
    const triggers = gsap.globalTimeline.getChildren();
    triggers.forEach((tl: any) => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
    });
  };
}

/**
 * Reading Progress Bar Animation
 * Shows reading progress as user scrolls through article
 */
export function initReadingProgressBar() {
  const progressBar = document.querySelector('[data-reading-progress]');
  if (!progressBar) return;

  const article = document.querySelector('[data-article-content]');
  if (!article) return;

  gsap.to(progressBar, {
    scrollTrigger: {
      trigger: article,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.to(progressBar, {
          scaleX: self.progress,
          transformOrigin: "left center",
          duration: 0.1
        });
      }
    }
  });

  return () => {
    const trigger = (progressBar as any).scrollTrigger;
    if (trigger) trigger.kill();
  };
}

/**
 * Table of Contents Highlight Animation
 * Highlights active section in TOC as user scrolls
 */
export function initTableOfContentsHighlight() {
  const tocLinks = gsap.utils.toArray('[data-toc-link]');
  const sections = gsap.utils.toArray('[data-article-section]');

  sections.forEach((section: any, index) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          tocLinks.forEach((link, i) => {
            if (i === index) {
              gsap.to(link, { scale: 1.05, color: "#02bccc", duration: 0.3 });
            } else {
              gsap.to(link, { scale: 1, color: "inherit", duration: 0.3 });
            }
          });
        },
        onEnterBack: () => {
          tocLinks.forEach((link, i) => {
            if (i === index) {
              gsap.to(link, { scale: 1.05, color: "#02bccc", duration: 0.3 });
            } else {
              gsap.to(link, { scale: 1, color: "inherit", duration: 0.3 });
            }
          });
        }
      }
    });
  });

  return () => {
    sections.forEach((section: any) => {
      const trigger = (section as any).scrollTrigger;
      if (trigger) trigger.kill();
    });
  };
}
