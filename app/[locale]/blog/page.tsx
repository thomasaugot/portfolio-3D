"use client";

import { useEffect, useState } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { normalizeBlogPosts } from "@/utils/blog";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initBlog3DDataStream } from "@/utils/animations/blog-3d-data-stream";
import { initTetrisTextAnimation } from "@/utils/animations/tetris-text-animation";
import { initBlogScrollAnimation } from "@/utils/animations/blog-scroll-animation";
import { initMagneticCursor } from "@/utils/animations/magnetic-cursor";
import { initFeaturedCard3D } from "@/utils/animations/featured-card-3d";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import ThreeContainer from "@/components/ui/ThreeContainer";
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
      setPosts(normalizeBlogPosts(data) as any);
    }
    loadPosts();
  }, []);

  useGSAPAnimations(() => {
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
        <ThreeContainer containerRef={containerRef} name="blog" />
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
