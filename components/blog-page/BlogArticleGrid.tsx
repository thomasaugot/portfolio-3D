"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { BlogPost } from "@/types/blog";
import BlogCard from "./BlogCard";

export default function BlogArticleGrid({ posts }: { posts: BlogPost[] }) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const animationInitialized = useRef(false);

  // Skip the first post (it's featured)
  const gridPosts = posts.slice(1);

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // 3D Train entrance animation - runs when posts are loaded
  useEffect(() => {
    if (gridPosts.length === 0 || animationInitialized.current) return;

    const section = sectionRef.current;
    const cards = document.querySelectorAll("[data-carousel-card]");

    if (!section || cards.length === 0) return;

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      animationInitialized.current = true;

      // Initial state - cards start way back on the Z axis, staggered like train cars
      cards.forEach((card, index) => {
        gsap.set(card, {
          opacity: 0,
          scale: 0.3,
          x: -200 - (index * 50),
          rotateY: -45,
          transformOrigin: "left center",
        });
      });

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "center center",
          scrub: 0.5,
          onEnter: () => {
            ScrollTrigger.refresh();
          },
        },
      });

      // Animate each card - they come in one after another like train cars
      cards.forEach((card, index) => {
        tl.to(
          card,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
          },
          index * 0.1
        );
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) {
          st.kill();
        }
      });
    };
  }, [gridPosts.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

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
    <section ref={sectionRef} data-articles-section className="relative py-12" style={{ perspective: "1000px" }}>
      {/* Section Header */}
      <div className="px-6 md:px-12 lg:px-20 mb-12">
        <div className="w-full max-w-7xl mx-auto">
          <div
            data-articles-header
            className="flex items-center justify-between gap-3 mb-4"
          >
            <h2 className="title-section whitespace-nowrap">
              {t("blog.sections.latest")}
            </h2>
            {/* Drag hint */}
            <div className="hidden md:flex items-center gap-2 text-text/40 text-sm font-mono">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>Drag or scroll</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Container */}
      <div
        ref={scrollContainerRef}
        data-article-carousel
        className={`flex gap-6 px-6 md:px-12 lg:px-20 overflow-x-auto py-12 scrollbar-hide ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {gridPosts.map((post, index) => (
          <div
            key={post.id}
            data-carousel-card={index}
            className="flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-[40vw] lg:w-[350px]"
          >
            <BlogCard post={post} index={index} />
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0" style={{ width: "1px" }} />
      </div>

      {/* Scroll indicators */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-full bg-gradient-to-r from-bg to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-full bg-gradient-to-l from-bg to-transparent pointer-events-none z-10"></div>
    </section>
  );
}
