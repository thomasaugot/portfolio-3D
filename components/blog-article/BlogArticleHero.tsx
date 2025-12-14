"use client";

import { BlogPost } from "@/types/blog";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initHero3DScene } from "@/utils/animations/hero-3d-scene";
import { FaClock, FaCalendar, FaUser } from "react-icons/fa";

interface BlogArticleHeroProps {
  post: BlogPost;
}

export default function BlogArticleHero({ post }: BlogArticleHeroProps) {
  const { t } = useTranslation();
  const containerRef = useThreeScene(initHero3DScene, "blog-article");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section
      data-blog-article-hero
      className="relative min-h-screen flex items-end overflow-hidden bg-bg"
    >
      {/* 3D Hex Grid Background */}
      <div
        ref={containerRef}
        data-3d-container="blog-article"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 md:opacity-30"
      />

      {/* FULL SCREEN FADING IMAGE */}
      {post.image && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={post.image}
            alt={post.titleKey}
            className="w-full h-full object-cover"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
      )}

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg" />

      {/* CONTENT - Positioned at bottom */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pb-16 md:pb-20">

        {/* Glass Badge */}
        <div
          data-article-badge
          className="glass inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl border border-border bg-bg/80 backdrop-blur-md mb-6 w-fit"
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
          <span className="text-xs md:text-sm font-mono uppercase tracking-wider text-text/60">
            {t(`blog.categories.${post.categoryKey}`)}
          </span>
        </div>

        {/* Title - Large and visible over fading image */}
        <h1
          data-article-title
          className="title-section mb-6 drop-shadow-2xl text-shadow-soft max-w-[90vw]"
        >
          {post.titleKey}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-text drop-shadow-lg">
          <div data-article-meta className="flex items-center gap-2 bg-bg/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <FaUser className="text-primary" />
            <span className="text-sm md:text-base font-medium">{post.author}</span>
          </div>

          <div data-article-meta className="flex items-center gap-2 bg-bg/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <FaCalendar className="text-primary" />
            <span className="text-sm md:text-base">{formatDate(post.date)}</span>
          </div>

          <div data-article-meta className="flex items-center gap-2 bg-bg/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <FaClock className="text-primary" />
            <span className="text-sm md:text-base">{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </section>
  );
}
