"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { BlogPost } from "@/types/blog";

interface BlogFloatingCardProps {
  post: BlogPost;
  index: number;
  total: number;
}

export default function BlogFloatingCard({
  post,
  index,
  total,
}: BlogFloatingCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      data-floating-card={index}
      className="sticky top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none"
    >
      <div className="max-w-6xl w-full px-6 md:px-12 lg:px-20 pointer-events-auto">
        <div
          data-card-inner={index}
          className="group relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-primary/20 overflow-hidden shadow-2xl shadow-primary/10 hover:shadow-primary/30 transition-all duration-700"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Left Side - Image */}
            <div
              data-card-image={index}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.titleKey}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                  <svg
                    className="w-24 h-24"
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

              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 mix-blend-overlay" />
            </div>

            {/* Right Side - Content */}
            <div
              data-card-content={index}
              className="flex flex-col justify-center space-y-6"
            >
              {/* Index Number */}
              <div className="flex items-center gap-4">
                <span className="text-6xl font-fun font-bold gradient-text opacity-30">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl text-sm font-mono font-semibold uppercase tracking-wider">
                  {t(`blog.categories.${post.categoryKey}`)}
                </span>
                <span className="text-text/30">•</span>
                <span className="text-text/50 text-sm font-mono">
                  {post.readTime} {t("blog.card.min_read")}
                </span>
                <span className="text-text/30">•</span>
                <span className="text-text/50 text-sm font-mono">
                  {formatDate(post.date)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-text leading-tight group-hover:gradient-text transition-all duration-500">
                {post.titleKey}
              </h2>

              {/* Excerpt */}
              <p className="text-text/70 leading-relaxed line-clamp-4">
                {post.excerptKey}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 5).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-surface/30 text-text/60 border border-border/20 rounded-full text-xs font-mono backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="pt-4">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 gradient-primary text-black font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
                >
                  <span>{t("blog.card.read_full_article")}</span>
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
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
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
