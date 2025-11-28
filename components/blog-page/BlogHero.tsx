"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { BlogPost } from "@/types/blog";
import Blog3DCarousel from "./Blog3DCarousel";

interface BlogHeroProps {
  posts: BlogPost[];
}

export default function BlogHero({ posts }: BlogHeroProps) {
  const { t } = useTranslation();

  return (
    <section
      data-blog-header
      className="relative min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Title Section */}
          <div className="space-y-6 md:space-y-8">
            <div
              data-animate="slide-up"
              className="glass inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl border border-border bg-bg/80 backdrop-blur-md"
            >
              <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-wider text-text/60">
                {t("blog.hero.badge")}
              </span>
            </div>

            <h1
              data-blog-title
              data-two-part-title
              className="space-y-0 md:-space-y-6 lg:-space-y-8 relative"
            >
              <span
                data-hero-line
                className="block title-hero text-text pb-1"
                style={{
                  wordSpacing: "normal",
                  letterSpacing: "inherit",
                  whiteSpace: "normal"
                }}
              >
                {t("blog.hero.title_1")}
              </span>
              <span
                data-hero-line
                className="block title-hero font-fun gradient-text"
                style={{
                  wordSpacing: "normal",
                  letterSpacing: "inherit",
                  whiteSpace: "normal"
                }}
              >
                {t("blog.hero.title_2")}
              </span>
            </h1>

            <p
              data-blog-subtitle
                className="subtitle max-w-xl md:max-w-2xl bg-bg/40 backdrop-blur-sm pt-2 pb-3 px-5 rounded-xl mt-2 md:mt-3"
            >
              {t("blog.hero.subtitle")}
            </p>
          </div>

          {/* Right Side - 3D Carousel */}
          {posts && posts.length > 0 && (
            <div data-featured-section className="w-full max-w-lg">
              <Blog3DCarousel posts={posts} />
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        data-scroll-hint
        className="absolute bottom-12 left-0 right-0 mx-auto flex flex-col items-center gap-3 opacity-70 w-fit z-20"
      >
        <span className="text-label">{t("blog.scroll")}</span>
        <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
          <div
            className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>
    </section>
  );
}
