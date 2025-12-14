"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mediumArticles } from "@/data/medium-articles";
import { BlogPost } from "@/types/blog";
import { normalizeBlogPosts } from "@/utils/blog";
import { createSlugFromTitle } from "@/utils/slugify";
import BlogArticleHero from "@/components/blog-article/BlogArticleHero";
import BlogArticleContent from "@/components/blog-article/BlogArticleContent";
import CommentSection from "@/components/blog-article/CommentSection";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import {
  initMenuAnimations
} from "@/utils/animations/menu-animations";
import {
  initBlogArticleHeroAnimation,
  initBlogArticleScrollAnimation,
  initCommentSectionAnimation,
  initReadingProgressBar,
} from "@/utils/animations/blog-article-animations";
import { initMagneticCursor } from "@/utils/animations/magnetic-cursor";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "@/lib/providers/TranslationProvider";

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the blog slug from URL
  const blogSlug = params?.blogSlug as string;

  useEffect(() => {
    async function loadArticle() {
      try {
        // Fetch articles from API (includes fullContent)
        const res = await fetch(`/api/blog?lang=${language}`);
        const articles = await res.json();

        if (!Array.isArray(articles)) {
          console.error('Failed to load articles:', articles);
          router.push(`/blog`);
          return;
        }

        const normalizedPosts = normalizeBlogPosts(articles);

        // Find article by matching slug (use originalTitle for consistent slugs)
        const foundPost = normalizedPosts.find(p => {
          const postSlug = createSlugFromTitle(p.originalTitle || p.titleKey);
          return postSlug === blogSlug;
        });

        if (foundPost) {
          setPost(foundPost);
        } else {
          console.error(`Article not found for slug: ${blogSlug}`);
          router.push(`/blog`);
        }
      } catch (error) {
        console.error('Error loading article:', error);
        router.push(`/blog`);
      } finally {
        setIsLoading(false);
      }
    }

    if (blogSlug) {
      loadArticle();
    }
  }, [blogSlug, router, language]);

  // Initialize animations
  useGSAPAnimations(() => {
    setTimeout(() => {
      initMenuAnimations();
      initBlogArticleHeroAnimation();
      initBlogArticleScrollAnimation();
      initCommentSectionAnimation();
      initReadingProgressBar();
      initMagneticCursor();
    }, 100);
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text/60 text-lg">{t('blog.article.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Generate consistent slug from originalTitle for comments
  const commentSlug = createSlugFromTitle(post.originalTitle || post.titleKey);

  return (
    <main className="text-text bg-bg overflow-x-hidden">
      <Menu />

      {/* Back to Blog Button */}
      <Link
        href="/blog"
        className="fixed top-6 left-6 md:top-8 md:left-8 z-40 group flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-bg/80 backdrop-blur-md border border-border/50 rounded-lg md:rounded-xl hover:border-primary/50 transition-all duration-300 hover:scale-105"
      >
        <FaArrowLeft className="text-xs md:text-sm text-primary group-hover:scale-110 transition-transform" />
        <span className="text-xs md:text-sm font-medium gradient-primary bg-clip-text text-transparent hidden sm:inline">
          {t('blog.article.back_to_blog')}
        </span>
      </Link>

      <BlogArticleHero post={post} />
      <BlogArticleContent post={post} />
      <CommentSection articleSlug={commentSlug} />
      <Footer />
    </main>
  );
}
