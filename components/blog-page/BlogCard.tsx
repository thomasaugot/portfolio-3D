"use client";

import { BlogPost } from "@/types/blog";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
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
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      data-blog-card={index}
      className="group block relative w-full h-[440px]"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Border */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative bg-surface rounded-2xl overflow-hidden h-full border border-border/30">
        {/* IMAGE */}
        {post.image && (
          <div className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden">
            <img
              src={post.image}
              alt={post.titleKey}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>
        )}

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* CONTENT */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          {/* FULL TITLE — NO CLAMP, NO ELLIPSIS — OVER IMAGE */}
          <h2
            className="
              font-bold text-text text-2xl leading-tight
              drop-shadow-xl
              group-hover:text-primary transition-colors duration-300
              absolute left-6 right-6
              -top-14
              whitespace-normal
              break-words
            "
          >
            {post.titleKey}
          </h2>

          {/* SPACING SO TITLE DOESN'T TOUCH EXCERPT */}
          <div className="pt-20 space-y-4">
            {/* EXCERPT — THIS is the ONLY thing CLAMPED */}
            <p
              className="
                text-text/70 text-sm leading-relaxed
                line-clamp-2
                overflow-hidden
              "
            >
              {post.excerptKey}
            </p>

            {/* META + CTA */}
            <div className="pt-3 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-text/50">
                  <span>{post.readTime} min</span>
                  <span>·</span>
                  <span>{formatDate(post.date)}</span>
                </div>

                <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all duration-300">
                  <span className="text-sm">{t("blog.card.read_more")}</span>
                  <svg
                    className="w-5 h-5"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
