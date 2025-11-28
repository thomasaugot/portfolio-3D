"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { BlogPost } from "@/types/blog";

interface BlogFeaturedProps {
  post: BlogPost;
}

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section
      data-featured-section
      className="relative py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Label */}
        <div
          data-featured-label
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
          <span className="text-sm font-mono text-primary uppercase tracking-widest">
            {t("blog.sections.featured")}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent"></div>
        </div>

        {/* Featured Article Card */}
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          data-featured-card
          className="group relative block"
        >
          <div className="relative bg-surface/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden hover:border-primary/60 transition-all duration-500">
            {/* Top - Image (Horizontal) */}
            <div
              data-featured-image
              className="relative aspect-[21/9] bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden"
            >
              {post.image ? (
                <>
                  <img
                    src={post.image}
                    alt={post.titleKey}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text/10">
                  <svg
                    className="w-20 h-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={0.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Holographic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Bottom - Content */}
            <div
              data-featured-content
              className="p-6 md:p-8 space-y-4"
            >
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider">
                  {t(`blog.categories.${post.categoryKey}`)}
                </span>
                <span className="text-text/30">•</span>
                <span className="text-text/50 font-mono text-sm">
                  {post.readTime} {t("blog.card.min_read")}
                </span>
                <span className="text-text/30">•</span>
                <span className="text-text/50 font-mono text-sm">
                  {formatDate(post.date)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text leading-tight group-hover:gradient-text transition-all duration-500">
                {post.titleKey}
              </h2>

              {/* Excerpt */}
              <p className="text-base text-text/70 leading-relaxed line-clamp-3">
                {post.excerptKey}
              </p>

              {/* Tags & CTA */}
              <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-surface/30 text-text/60 border border-border/20 rounded-lg text-xs font-mono backdrop-blur-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-black font-bold rounded-lg shadow-lg shadow-primary/30 group-hover:shadow-primary/60 group-hover:scale-105 active:scale-95 transition-all duration-300">
                  <span className="text-sm">{t("blog.card.read_more")}</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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

            {/* Floating Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </div>
        </a>
      </div>
    </section>
  );
}
