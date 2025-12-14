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
import { useTranslation } from "@/lib/providers/TranslationProvider";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import ThreeContainer from "@/components/ui/ThreeContainer";
import BlogHero from "@/components/blog-page/BlogHero";
import BlogCategoriesMarquee from "@/components/blog-page/BlogCategoriesMarquee";
import BlogArticleGrid from "@/components/blog-page/BlogArticleGrid";
import { FaSync, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function BlogPage() {
  const { t, language } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const containerRef = useThreeScene(initBlog3DDataStream, "blog");

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch(`/api/blog?lang=${language}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(normalizeBlogPosts(data) as any);
        } else {
          console.error('Failed to load posts:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]);
      }
    }
    loadPosts();

    // Check if user is admin
    const adminAuth = sessionStorage.getItem('admin_auth');
    setIsAdmin(!!adminAuth);
  }, [language]);

  const handleUpdateArticles = async () => {
    const password = sessionStorage.getItem('admin_auth');
    if (!password) return;

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await fetch('/api/blog/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage({
          type: 'success',
          text: `${t('admin.messages.success')} ${data.inserted} inserted, ${data.updated} updated`
        });
        // Reload posts
        const res = await fetch(`/api/blog?lang=${language}`);
        const newData = await res.json();
        if (Array.isArray(newData)) {
          setPosts(normalizeBlogPosts(newData) as any);
        }
      } else {
        setUpdateMessage({ type: 'error', text: data.error || t('admin.messages.error') });
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: t('admin.messages.error') });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(null), 5000);
    }
  };

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

      {/* Admin Update Button */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
          {updateMessage && (
            <div
              className={`px-6 py-3 rounded-xl backdrop-blur-md border flex items-center gap-2 ${
                updateMessage.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {updateMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              <span className="text-sm font-medium">{updateMessage.text}</span>
            </div>
          )}

          <button
            onClick={handleUpdateArticles}
            disabled={isUpdating}
            className="group px-6 py-4 bg-gradient-to-r from-cyan-500 to-primary text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            <FaSync className={isUpdating ? 'animate-spin' : ''} />
            <span>{isUpdating ? t('admin.updating') : t('admin.update_button')}</span>
          </button>
        </div>
      )}

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
