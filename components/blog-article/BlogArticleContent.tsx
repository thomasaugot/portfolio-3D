"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import { normalizeBlogPosts } from "@/utils/blog";
import BlogCard from "@/components/blog-page/BlogCard";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface BlogArticleContentProps {
  post: BlogPost;
}

export default function BlogArticleContent({ post }: BlogArticleContentProps) {
  const { t } = useTranslation();
  const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string }[]>([]);
  const [similarArticles, setSimilarArticles] = useState<BlogPost[]>([]);

  // Parse HTML content and extract only h2/h3 for TOC
  useEffect(() => {
    if (!post.fullContent) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.fullContent, 'text/html');
    const headings = doc.querySelectorAll('h2, h3'); // Only section titles (h2, h3)

    const tocItems = Array.from(headings).slice(0, 8).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id; // Add ID to heading for anchor links
      return {
        id,
        text: heading.textContent || ''
      };
    });

    setTableOfContents(tocItems);
  }, [post.fullContent]);

  // Fetch similar articles
  useEffect(() => {
    async function loadSimilarArticles() {
      try {
        const res = await fetch("/api/blog");
        const articles = await res.json();
        const normalizedPosts = normalizeBlogPosts(articles);

        // First try to get articles from same category
        let similar = normalizedPosts
          .filter(p => p.id !== post.id && p.categoryKey === post.categoryKey)
          .slice(0, 3);

        // If not enough, fill with recent articles
        if (similar.length < 3) {
          const remaining = normalizedPosts
            .filter(p => p.id !== post.id && !similar.find(s => s.id === p.id))
            .slice(0, 3 - similar.length);
          similar = [...similar, ...remaining];
        }

        setSimilarArticles(similar);
      } catch (error) {
        console.error('Error loading similar articles:', error);
      }
    }

    loadSimilarArticles();
  }, [post.id, post.categoryKey]);

  // Sanitize and prepare HTML content
  const prepareContent = (html: string): string => {
    // Remove all figure/image tags
    let processedHtml = html.replace(/<figure[^>]*>.*?<\/figure>/gi, '');
    processedHtml = processedHtml.replace(/<img[^>]*>/gi, '');

    // Add IDs to headings for TOC navigation
    processedHtml = processedHtml.replace(/<(h[1-4])[^>]*>/gi, (match, tag, offset) => {
      const index = processedHtml.substring(0, offset).match(/<h[1-4]/gi)?.length || 0;
      return `<${tag} id="heading-${index}">`;
    });

    return processedHtml;
  };

  return (
    <article className="relative bg-bg">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/20">
        <div
          data-reading-progress
          className="h-full bg-gradient-to-r from-cyan-500 to-primary origin-left scale-x-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents - Desktop */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <div className="glass bg-bg/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-secondary" />
                    <h3 className="text-base font-bold gradient-primary bg-clip-text text-transparent">
                      {t('blog.article.table_of_contents')}
                    </h3>
                  </div>
                  <nav>
                    <ul className="space-y-1">
                      {tableOfContents.map((heading, index) => (
                        <li key={index}>
                          <a
                            href={`#${heading.id}`}
                            data-toc-link
                            className="group relative flex items-start gap-3 text-sm text-text/60 hover:text-text transition-all py-2 px-3 rounded-lg hover:bg-primary/5"
                          >
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-2 transition-all duration-300" />
                            <span className="flex-1 leading-snug">
                              {heading.text.substring(0, 60)}
                              {heading.text.length > 60 ? '...' : ''}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div
            data-article-content
            className={`${tableOfContents.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}`}
          >
            {/* Rendered HTML Content */}
            <div
              className="article-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: prepareContent(post.fullContent || '') }}
              data-article-section
            />
          </div>
        </div>

        {/* Similar Articles Section */}
        {similarArticles.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border/30">
            <h2 className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-12">
              {t('blog.article.similar_articles')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarArticles.map((article, index) => (
                <BlogCard key={article.id} post={article} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
