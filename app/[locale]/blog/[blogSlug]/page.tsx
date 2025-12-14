"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the blog slug from URL
  const blogSlug = params?.blogSlug as string;

  useEffect(() => {
    async function loadArticle() {
      try {
        // Fetch articles from API (includes fullContent)
        const res = await fetch("/api/blog");
        const articles = await res.json();
        const normalizedPosts = normalizeBlogPosts(articles);

        // Find article by matching slug created from title
        const foundPost = normalizedPosts.find(p => {
          const postSlug = createSlugFromTitle(p.titleKey);
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
  }, [blogSlug, router]);

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
          <p className="text-text/60 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="text-text bg-bg overflow-x-hidden">
      <Menu />
      <BlogArticleHero post={post} />
      <BlogArticleContent post={post} />
      {/* <CommentSection articleSlug={blogSlug} /> */}
      <Footer />
    </main>
  );
}
