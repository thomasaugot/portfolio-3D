"use client";

import { useRef, useEffect } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { BlogPost } from "@/types/blog";
import BlogCard from "./BlogCard";
import SafeLink from "@/components/ui/SafeLink";

export default function BlogArticleGrid({ posts }: { posts: BlogPost[] }) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const animationInitialized = useRef(false);

  // Show all posts in carousel
  const gridPosts = posts;

  // Horizontal slide on vertical scroll
  useEffect(() => {
    if (gridPosts.length === 0 || animationInitialized.current) return;

    const section = sectionRef.current;
    const container = scrollContainerRef.current;
    const cards = document.querySelectorAll("[data-carousel-card]");

    if (!section || !container || cards.length === 0) return;

    const initTimeout = setTimeout(() => {
      animationInitialized.current = true;

      // Calculate max scroll (spacers are now part of scrollable content)
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Pin section and slide carousel horizontally on vertical scroll
      gsap.to(container, {
        scrollLeft: maxScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${maxScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Entrance animation
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [gridPosts.length]);

  if (gridPosts.length === 0) {
    return (
      <section className="relative py-20 px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-text mb-2">
              {t("blog.empty.title")}
            </h3>
            <p className="text-text/60">{t("blog.empty.description")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} data-articles-section className="relative py-12">
      {/* Section Header */}
      <div className="px-6 md:px-12 lg:px-20 mb-8">
        <h2 className="title-section">{t("blog.sections.recent")}</h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          data-article-carousel
          className="flex gap-6 px-12 md:px-24 py-12 overflow-x-auto scrollbar-hide"
        >
          {gridPosts.map((post, index) => (
            <div
              key={post.id}
              data-carousel-card={index}
              className="flex-shrink-0 w-[320px] md:w-[380px] lg:w-[400px]"
            >
              <BlogCard post={post} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Medium CTA */}
      <div className="px-6 md:px-12 lg:px-20 my-16">
        <div className="max-w-2xl mx-auto">
          <SafeLink
            href="https://medium.com/@thomasaugot"
            className="group flex items-center justify-center gap-4 transition-all duration-300 hover:gap-6"
          >
            <div className="text-white group-hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
            </div>
            <span className="text-white text-lg md:text-xl font-medium">
              {t("blog.medium.cta")}
            </span>
          </SafeLink>
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg to-transparent pointer-events-none z-10"></div>
    </section>
  );
}
