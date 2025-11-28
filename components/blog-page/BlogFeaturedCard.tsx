"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { BlogPost } from "@/types/blog";
import { useEffect, useRef, useState } from "react";

interface BlogFeaturedCardProps {
  post: BlogPost;
}

export default function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      return () => card.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block cursor-pointer"
      style={{
        perspective: "2000px",
      }}
    >
      <div className="relative min-h-[600px] md:min-h-[700px]">
        {/* Holographic Border Effect */}
        <div
          className="absolute -inset-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #ccff02, #02bccc, transparent 70%)`,
          }}
        />

        {/* Main Container with 3D Transform */}
        <div
          className="relative bg-[#161616] rounded-3xl overflow-hidden border border-[#2a2a2a] group-hover:border-primary/40 transition-all duration-700"
          style={{
            transform: isHovered
              ? `rotateX(${(mousePos.y - 50) * 0.05}deg) rotateY(${
                  (mousePos.x - 50) * 0.05
                }deg) scale3d(1.02, 1.02, 1.02)`
              : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transformStyle: "preserve-3d",
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan" />
          </div>

          {/* DATA STREAM BACKGROUND */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0 font-mono text-xs text-primary/40 leading-relaxed whitespace-pre-wrap break-all">
              {isHovered &&
                Array.from({ length: 50 })
                  .map(() =>
                    Math.random()
                      .toString(36)
                      .substring(2, 15)
                  )
                  .join(" ")}
            </div>
          </div>

          {/* DECONSTRUCTED LAYOUT */}
          <div className="relative p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDE - Content (takes 7 columns on desktop) */}
            <div className="lg:col-span-7 space-y-6 z-10">
              {/* Terminal Header */}
              <div className="flex items-center gap-3 font-mono text-xs text-primary/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="opacity-60">featured_article.md</span>
              </div>

              {/* Featured Badge with Glitch */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-primary/30 relative overflow-hidden group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse relative z-10" />
                <span className="text-primary text-sm font-semibold font-mono uppercase tracking-wider relative z-10">
                  Featured
                </span>
                {/* Glitch effect on hover */}
                {isHovered && (
                  <span className="absolute inset-0 flex items-center px-4 text-secondary text-sm font-semibold font-mono uppercase tracking-wider opacity-50 transform translate-x-[2px] translate-y-[1px]">
                    Featured
                  </span>
                )}
              </div>

              {/* Category & Meta - Floating */}
              <div
                className="flex flex-wrap items-center gap-3 transform transition-transform duration-500"
                style={{
                  transform: isHovered
                    ? "translateZ(20px)"
                    : "translateZ(0px)",
                }}
              >
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/15 text-primary border border-primary/30 rounded-lg text-sm font-mono font-semibold uppercase tracking-wide backdrop-blur-sm">
                  <span className="text-primary/60">//</span>
                  {t(`blog.categories.${post.categoryKey}`)}
                </span>
                <span className="text-text/30 text-sm font-mono">|</span>
                <span className="text-text/50 text-sm font-mono">
                  {post.readTime} min
                </span>
                <span className="text-text/30 text-sm font-mono">|</span>
                <span className="text-text/50 text-sm font-mono">
                  {formatDate(post.date)}
                </span>
              </div>

              {/* Title - Large & Bold with Gradient */}
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-fun font-bold leading-[1.1] transform transition-all duration-500"
                style={{
                  transform: isHovered
                    ? "translateZ(40px)"
                    : "translateZ(0px)",
                }}
              >
                <span className="inline-block group-hover:gradient-text-animated transition-all duration-500">
                  {post.titleKey}
                </span>
              </h2>

              {/* Excerpt - Stylized */}
              <div
                className="relative pl-4 border-l-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-500"
                style={{
                  transform: isHovered
                    ? "translateZ(30px)"
                    : "translateZ(0px)",
                }}
              >
                <p className="text-base md:text-lg text-text/70 leading-relaxed line-clamp-4 font-light">
                  {post.excerptKey}
                </p>
              </div>

              {/* Tags - Floating Pills */}
              {post.tags && post.tags.length > 0 && (
                <div
                  className="flex flex-wrap gap-2 pt-2 transform transition-transform duration-500"
                  style={{
                    transform: isHovered
                      ? "translateZ(25px)"
                      : "translateZ(0px)",
                  }}
                >
                  {post.tags.slice(0, 5).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-surface/30 text-text/60 border border-border/30 rounded-full text-xs font-mono backdrop-blur-sm hover:bg-surface/50 hover:text-text/80 hover:border-primary/30 transition-all duration-300"
                      style={{
                        transitionDelay: `${idx * 50}ms`,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Button - Cyberpunk Style */}
              <div
                className="pt-4 transform transition-transform duration-500"
                style={{
                  transform: isHovered
                    ? "translateZ(50px)"
                    : "translateZ(0px)",
                }}
              >
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-black font-bold rounded-xl group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 text-sm md:text-base uppercase tracking-wider">
                    {t("blog.card.read_full_article")}
                  </span>
                  <svg
                    className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Image (takes 5 columns on desktop) */}
            <div className="lg:col-span-5 relative">
              {/* Image Container - Floating & Rotated */}
              <div
                className="relative h-full min-h-[300px] lg:min-h-[500px] transform transition-all duration-700"
                style={{
                  transform: isHovered
                    ? "translateZ(60px) rotateY(-5deg) rotateX(3deg)"
                    : "translateZ(0px) rotateY(0deg) rotateX(0deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Glowing frame */}
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Image wrapper */}
                <div className="relative h-full rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-500">
                  {post.image ? (
                    <>
                      <img
                        src={post.image}
                        alt={post.titleKey}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      {/* Scanlines on image */}
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] opacity-20" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <svg
                        className="w-24 h-24 text-text/10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-secondary" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-secondary" />
                </div>

                {/* Floating data points */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center font-mono text-xs text-primary font-bold transform group-hover:scale-110 transition-transform duration-500">
                  {post.readTime}'
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Outer Glow */}
        <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000 -z-10" />
      </div>
    </a>
  );
}
