"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useTransition } from "@/lib/providers/LoadingProvider";
import { BlogPost } from "@/types/blog";
import { createSlugFromTitle } from "@/utils/slugify";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Blog3DCarouselProps {
  posts: BlogPost[];
}

export default function Blog3DCarousel({ posts }: Blog3DCarouselProps) {
  const { t, language } = useTranslation();
  const { startTransition } = useTransition();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get 3 latest posts
  const latestPosts = posts.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % latestPosts.length);
  }, [latestPosts.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + latestPosts.length) % latestPosts.length
    );
  }, [latestPosts.length]);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  // Scroll-based navigation - VERY SENSITIVE
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollTime = 0;
    const cooldown = 600; // ms between transitions

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();

      // Check cooldown
      if (now - lastScrollTime < cooldown) {
        return;
      }

      // Very sensitive - only need 10px of scroll
      if (Math.abs(e.deltaY) > 10) {
        lastScrollTime = now;

        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [nextSlide, prevSlide]);

  // Smooth drag/swipe functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleMouseMove = () => {
    if (!isDragging) return;
  };

  const handleTouchMove = () => {
    if (!isDragging) return;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const endX = "clientX" in e ? e.clientX : e.changedTouches[0].clientX;
    const diff = endX - dragStartX;

    // Lower threshold for more sensitive drag (30px instead of 50px)
    const threshold = 30;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    setIsDragging(false);
  };

  const getCardStyle = (index: number) => {
    const position = (index - currentIndex + 3) % 3;

    if (position === 0) {
      // Front/Featured
      return {
        transform: "translateZ(0px) scale(1)",
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
      };
    } else if (position === 1) {
      // Right background - slightly behind the main card
      return {
        transform:
          "translateX(55%) translateZ(-500px) scale(0.45) rotateY(-30deg)",
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    } else {
      // Left background - slightly behind the main card
      return {
        transform:
          "translateX(-55%) translateZ(-500px) scale(0.45) rotateY(30deg)",
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ perspective: "2000px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="relative w-full h-[600px]">
        {latestPosts.map((post, index) => {
          const position = (index - currentIndex + 3) % 3;
          const isFeatured = position === 0;

          return (
            <div
              key={post.id}
              className="absolute inset-0 transition-all duration-[1200ms] ease-out"
              style={{
                ...getCardStyle(index),
                transformStyle: "preserve-3d",
              }}
              onClick={async () => {
                if (!isFeatured) {
                  setCurrentIndex(index);
                } else {
                  // Navigate to article when clicking featured card
                  const slug = createSlugFromTitle(post.originalTitle || post.titleKey);
                  const internalUrl = `/${language}/blog/${slug}`;
                  await startTransition(internalUrl, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
                }
              }}
            >
              <div className={`group relative h-full ${isFeatured ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Gradient border */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl md:rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card content */}
                <div className="relative bg-bg rounded-2xl md:rounded-3xl overflow-hidden h-full border border-border/30">
                  {/* Image with gradient fade - takes 60% height */}
                  {post.image && (
                    <div className="absolute top-0 left-0 right-0 h-[60%] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.titleKey}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{
                          maskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                        }}
                      />
                    </div>
                  )}

                  {/* Decorative corner gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content - positioned to overlap with faded image */}
                  <div className="relative h-full flex flex-col">
                    {/* Latest badge for featured */}
                    {isFeatured && (
                      <div className="absolute top-8 left-8 z-10">
                        <div className="glass inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border bg-bg/80 backdrop-blur-md">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
                          <span className="text-xs font-mono uppercase tracking-wider text-text/60">
                            {t("blog.card.latest")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Title & Meta - starts at 45% to overlap image fade */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 space-y-4">
                      <h2
                        className={`font-bold text-text leading-[1.1] group-hover:text-primary transition-colors duration-300 drop-shadow-lg ${
                          isFeatured
                            ? "text-3xl md:text-4xl"
                            : "text-2xl md:text-3xl"
                        }`}
                      >
                        {post.titleKey}
                      </h2>

                      {isFeatured && (
                        <p className="text-text/70 leading-relaxed line-clamp-2">
                          {post.excerptKey}
                        </p>
                      )}

                      <div className="relative pt-4 border-t border-border/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-text/50 font-mono">
                            <span>{post.readTime} min</span>
                            <span>·</span>
                            <span>{formatDate(post.date)}</span>
                          </div>

                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const slug = createSlugFromTitle(post.originalTitle || post.titleKey);
                              const internalUrl = `/${language}/blog/${slug}`;
                              const clickPosition = {
                                x: e.clientX,
                                y: e.clientY,
                              };
                              await startTransition(internalUrl, clickPosition);
                            }}
                            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 cursor-pointer z-10 relative"
                          >
                            <span>{t("blog.card.read_more")}</span>
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation dots and hint */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40">
        <div className="flex gap-3">
          {latestPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-text/30 hover:bg-text/50"
              }`}
              aria-label={`Go to article ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
