import { gsap, ScrollTrigger } from "@/lib/animations";

export function initBlogScrollAnimation() {
  const heroSection = document.querySelector("[data-blog-header]");
  const featuredSection = document.querySelector("[data-featured-section]");
  const featuredLabel = document.querySelector("[data-featured-label]");
  const featuredCard = document.querySelector("[data-featured-card]");
  const featuredImage = document.querySelector("[data-featured-image]");
  const featuredContent = document.querySelector("[data-featured-content]");
  const articlesSection = document.querySelector("[data-articles-section]");
  const articlesHeader = document.querySelector("[data-articles-header]");
  const articleCarousel = document.querySelector("[data-article-carousel]");
  const carouselCards = document.querySelectorAll("[data-carousel-card]");

  const timelines: gsap.core.Timeline[] = [];

  // Get 3D scene for parallax effects
  const blogScene = (window as any).__blogScene;

  // Hero section - parallax with 3D scene
  if (heroSection && blogScene) {
    const { camera, hexFloor } = blogScene;

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        id: "blog-hero",
      },
    });

    // Camera moves as you scroll
    heroTl
      .to(
        camera.position,
        {
          y: 250,
          z: 500,
          duration: 1,
          ease: "none",
        },
        0
      )
      .to(
        hexFloor.rotation,
        {
          y: Math.PI / 8,
          x: 0.1,
          duration: 1,
          ease: "none",
        },
        0
      );

    timelines.push(heroTl);
  }

  // Featured section - dramatic entrance
  if (featuredSection) {
    if (featuredLabel) {
      gsap.set(featuredLabel, { opacity: 0, y: 50 });

      const labelTl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredLabel,
          start: "top 75%",
          end: "top 40%",
          scrub: 2,
          id: "featured-label",
        },
      });

      labelTl.to(featuredLabel, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });

      timelines.push(labelTl);
    }

    if (featuredCard) {
      const cardInner = featuredCard.querySelector("[data-featured-card-inner]");

      if (cardInner) {
        // Set initial state - far back and looking left
        gsap.set(cardInner, {
          rotateY: -15,
          translateZ: -400,
          scale: 0.7,
        });

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: featuredCard,
            start: "top 80%",
            end: "top 30%",
            scrub: 1.5,
            id: "featured-card",
          },
        });

        // Animate card to front
        cardTl.to(cardInner, {
          rotateY: 0,
          translateZ: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        });

        // Also animate hex grid if available
        if (blogScene) {
          const { camera, hexFloor } = blogScene;

          cardTl
            .to(camera.position, {
              y: 200,
              z: 600,
              duration: 1,
              ease: "power2.out",
            }, 0)
            .to(hexFloor.rotation, {
              y: Math.PI / 6,
              x: 0.05,
              duration: 1,
              ease: "power2.out",
            }, 0);
        }

        timelines.push(cardTl);
      }
    }

    // Parallax between image and content
    if (featuredImage && featuredContent) {
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredCard,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          id: "featured-parallax",
        },
      });

      parallaxTl
        .fromTo(
          featuredImage,
          { y: 100, scale: 1.1 },
          { y: -100, scale: 1, duration: 1, ease: "none" },
          0
        )
        .fromTo(
          featuredContent,
          { y: 50 },
          { y: -50, duration: 1, ease: "none" },
          0
        );

      timelines.push(parallaxTl);
    }
  }

  // Articles section header with split animation
  if (articlesHeader) {
    gsap.set(articlesHeader, { opacity: 0 });

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: articlesHeader,
        start: "top 75%",
        end: "top 40%",
        scrub: 2,
        id: "articles-header",
      },
    });

    const headerElements = articlesHeader.children;
    headerTl
      .to(articlesHeader, { opacity: 1, duration: 0.5 }, 0)
      .fromTo(
        headerElements,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
        0
      );

    timelines.push(headerTl);
  }

  // Horizontal carousel - subtle entrance animation only
  if (articleCarousel && carouselCards.length > 0) {
    carouselCards.forEach((card, index) => {
      // Set subtle initial state - just slightly faded
      gsap.set(card, {
        opacity: 0.8,
      });

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "left 95%",
          end: "left 50%",
          scrub: 1,
          id: `carousel-card-${index}`,
        },
      });

      cardTl.to(card, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      timelines.push(cardTl);
    });
  }

  // Hex floor reaction to articles scroll
  if (blogScene && articlesSection) {
    const { hexFloor } = blogScene;

    const hexTl = gsap.timeline({
      scrollTrigger: {
        trigger: articlesSection,
        start: "top center",
        end: "bottom top",
        scrub: 1,
        id: "hex-articles",
      },
    });

    hexTl.to(hexFloor.rotation, {
      y: -Math.PI / 4,
      x: -0.15,
      duration: 1,
      ease: "none",
    });

    timelines.push(hexTl);
  }

  // Refresh ScrollTrigger after all animations are set
  ScrollTrigger.refresh();

  // Cleanup function
  return {
    kill: () => {
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    },
  };
}
