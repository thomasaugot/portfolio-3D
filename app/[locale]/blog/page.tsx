"use client";

import { useEffect, useState } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initBlog3DDataStream } from "@/utils/animations/blog-3d-data-stream";
import { initTetrisTextAnimation } from "@/utils/animations/tetris-text-animation";
import { initBlogScrollAnimation } from "@/utils/animations/blog-scroll-animation";
import { initMagneticCursor } from "@/utils/animations/magnetic-cursor";
import { initFeaturedCard3D } from "@/utils/animations/featured-card-3d";

import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog-page/BlogHero";
import BlogCategoriesMarquee from "@/components/blog-page/BlogCategoriesMarquee";
import BlogArticleGrid from "@/components/blog-page/BlogArticleGrid";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const containerRef = useThreeScene(initBlog3DDataStream, "blog");

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch("/api/blog");
      const data = await res.json();

      // Helper to map Medium categories to our predefined categories
      const mapCategory = (categories: string[] = []) => {
        const categoryMap: Record<string, string> = {
          'react': 'frontend',
          'nextjs': 'frontend',
          'nextjs-15': 'frontend',
          'javascript': 'frontend',
          'gsap': 'frontend',
          'animation': 'frontend',
          'frontend': 'frontend',
          'web-development': 'fullstack',
          'wordpress': 'fullstack',
          'backend': 'backend',
          'aws': 'backend',
          'amazon-web-services': 'backend',
          'design': 'design',
          'career': 'career',
        };

        for (const cat of categories) {
          const mapped = categoryMap[cat.toLowerCase()];
          if (mapped) return mapped;
        }
        return 'all';
      };

      const normalized = data.map((post: any) => {
        // Strip HTML and get a clean excerpt
        let excerpt = "";
        if (post.content && post.content.length > 0) {
          excerpt = post.content
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 200);
          if (excerpt.length > 0) excerpt += "...";
        }

        // Calculate read time
        const wordCount = post.content ? post.content.split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        return {
          id: post.link,
          slug: post.link,
          titleKey: post.title,
          excerptKey: excerpt || "Click to read more...",
          date: post.pubDate,
          author: "Thomas Augot",
          categoryKey: mapCategory(post.categories),
          readTime: readTime,
          featured: false,
          tags: post.categories?.slice(0, 3) || [],
          image: post.image || "/default-blog.jpg",
          link: post.link,
        };
      });

      setPosts(normalized);
    }

    loadPosts();
  }, []);

  useGSAPAnimations(() => {
    // Wait for DOM to be ready
    setTimeout(() => {
      initMenuAnimations();
      initTetrisTextAnimation();
      initBlogScrollAnimation();
      initMagneticCursor();
      initFeaturedCard3D();
    }, 100);
  });

  return (
    <>
      <Menu />
      <section className="relative bg-bg overflow-x-clip">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            ref={containerRef}
            data-3d-container="blog"
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 overflow-x-hidden">
          <BlogHero posts={posts} />
          <BlogCategoriesMarquee />
          <BlogArticleGrid posts={posts} />
          <Footer />
        </div>
      </section>
    </>
  );
}
