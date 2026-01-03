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
        className="fixed top-6 left-6 md:top-8 md:left-8 z-20 group cursor-pointer"
      >
        {/* Gradient border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Glow effect on hover */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Button content */}
        <div className="relative flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-bg rounded-full">
          <FaArrowLeft className="text-sm md:text-base text-text group-hover:text-primary transition-all duration-300 group-hover:-translate-x-0.5" />
          <span className="text-sm md:text-base font-bold text-text group-hover:text-primary transition-colors duration-300 hidden sm:inline">
            {t('blog.article.back_to_blog')}
          </span>
        </div>
      </Link>

      <BlogArticleHero post={post} />
      <BlogArticleContent post={post} />
      <CommentSection articleSlug={commentSlug} />
      <Footer />
    </main>
  );
}
