"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initHero3DScene } from "@/utils/animations/hero-3d-scene";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { FaExclamationCircle } from "react-icons/fa";

export default function AdminPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const containerRef = useThreeScene(initHero3DScene, "admin");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        router.push(`/${language}/blog`);
      } else {
        setError(data.error || t('admin.messages.invalid_password'));
      }
    } catch (error) {
      setError(t('admin.messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

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
