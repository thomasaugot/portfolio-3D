"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initHero3DScene } from "@/utils/animations/hero-3d-scene";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { FaExclamationCircle, FaCheckCircle, FaTrash, FaSync, FaClock, FaUser } from "react-icons/fa";

interface PendingComment {
  id: number;
  article_slug: string;
  article_title?: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
}

export default function AdminPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const containerRef = useThreeScene(initHero3DScene, "admin");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth) {
      setIsLoggedIn(true);
      setPassword(adminAuth);
      loadPendingComments(adminAuth);
    }
  }, []);

  // Redirect if no pending comments after loading
  useEffect(() => {
    if (isLoggedIn && !loadingComments && pendingComments.length === 0) {
      const timer = setTimeout(() => {
        router.push(`/${language}/blog`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, loadingComments, pendingComments.length, router, language]);

  const loadPendingComments = async (pwd: string) => {
    setLoadingComments(true);
    try {
      const response = await fetch('/api/comments/pending', {
        headers: {
          'Authorization': `Bearer ${pwd}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error loading pending comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('admin_auth', password);
        setIsLoggedIn(true);
        loadPendingComments(password);
      } else {
        setError(data.error || t('admin.messages.invalid_password'));
      }
    } catch (error) {
      setError(t('admin.messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments/approve/${commentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setActionMessage({ type: 'success', text: t('admin.comments.approved_success') });
        const newComments = pendingComments.filter(c => c.id !== commentId);
        setPendingComments(newComments);

        // Redirect to blog if no more pending comments
        if (newComments.length === 0) {
          setTimeout(() => {
            router.push(`/${language}/blog`);
          }, 2000);
        } else {
          setTimeout(() => setActionMessage(null), 3000);
        }
      } else {
        setActionMessage({ type: 'error', text: t('admin.comments.approve_error') });
      }
    } catch (error) {
      setActionMessage({ type: 'error', text: t('admin.comments.approve_error') });
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm(t('admin.comments.delete_confirm'))) return;

    try {
      const response = await fetch(`/api/comments/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setActionMessage({ type: 'success', text: t('admin.comments.deleted_success') });
        const newComments = pendingComments.filter(c => c.id !== commentId);
        setPendingComments(newComments);

        // Redirect to blog if no more pending comments
        if (newComments.length === 0) {
          setTimeout(() => {
            router.push(`/${language}/blog`);
          }, 2000);
        } else {
          setTimeout(() => setActionMessage(null), 3000);
        }
      } else {
        setActionMessage({ type: 'error', text: t('admin.comments.delete_error') });
      }
    } catch (error) {
      setActionMessage({ type: 'error', text: t('admin.comments.delete_error') });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoggedIn) {
    return (
      <main className="text-text bg-bg overflow-x-hidden min-h-screen">
        <Menu />

        <section className="relative py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <h1 className="title-section">{t('admin.dashboard_title')}</h1>
              <button
                onClick={() => loadPendingComments(password)}
                className="p-3 hover:text-primary transition-colors"
                disabled={loadingComments}
              >
                <FaSync className={`text-xl ${loadingComments ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Messages */}
            {actionMessage && (
              <div className={`mb-8 p-4 rounded-xl border ${
                actionMessage.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              } flex items-center gap-3`}>
                {actionMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                {actionMessage.text}
              </div>
            )}

            {/* Comments */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                {t('admin.comments.pending_title')} ({pendingComments.length})
              </h2>

              {loadingComments ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-text/60">{t('admin.comments.loading')}</p>
                </div>
              ) : pendingComments.length === 0 ? (
                <div className="glass bg-bg/60 backdrop-blur-md border border-border/50 rounded-2xl p-12 text-center">
                  <p className="text-text/60">{t('admin.comments.no_pending')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="glass bg-bg/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-text">{comment.author_name}</h4>
                          <p className="text-sm text-text/50">{comment.author_email}</p>
                          <p className="text-xs text-text/40 mt-1">{formatDate(comment.created_at)}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-text/80 leading-relaxed mb-4">{comment.content}</p>

                      {/* Article */}
                      <div className="mb-4 pb-4 border-b border-border/30">
                        <span className="text-sm text-text/50">{t('admin.comments.article')}: </span>
                        <span className="text-sm text-primary">
                          {comment.article_title || comment.article_slug}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(comment.id)}
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-600"
                        >
                          <FaCheckCircle className="mr-2" />
                          {t('admin.comments.approve')}
                        </Button>
                        <Button
                          onClick={() => handleDelete(comment.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash className="mr-2" />
                          {t('admin.comments.delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="text-text bg-bg overflow-x-hidden">
      <Menu />

      <section className="relative min-h-screen flex items-center justify-center py-32 overflow-visible">
        <div
          ref={containerRef}
          data-3d-container="admin"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 md:opacity-50"
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 lg:px-8 w-full">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight">
              {t('admin.title')}
            </h1>
          </div>

          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl md:rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-bg backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-12 border border-border/30">
              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <label htmlFor="password" className="block text-sm font-mono uppercase tracking-wider text-text/60 mb-3">
                    {t('admin.password_label')}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-bg/80 border border-border/50 rounded-xl focus:border-primary/50 outline-none transition-all duration-300 text-text text-lg"
                    placeholder={t('admin.password_placeholder')}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="p-6 rounded-xl flex items-center gap-3 border bg-red-500/10 border-red-500/30 text-red-400">
                    <FaExclamationCircle className="text-xl" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="filled"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>{t('admin.updating')}</span>
                    </div>
                  ) : (
                    t('admin.login_button')
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
