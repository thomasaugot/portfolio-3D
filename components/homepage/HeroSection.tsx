'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { initHero3DScene } from '@/utils/animations/hero-3d-animations'

export default function HeroSection() {
  const { t } = useTranslation()
  const cleanupRef = useRef<(() => void) | null | undefined>(null)

  useEffect(() => {
    const init = async () => {
      cleanupRef.current = await initHero3DScene()
    }
    init()

    return () => {
      if (cleanupRef.current) cleanupRef.current()
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-visible z-0">
      {/* Charcoal background with overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/assets/images/charcoal-texture.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Three.js container (grid + model) */}
      <div
        data-3d-container="hero"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-animate="slide-up" className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-mono text-white tracking-wider uppercase">
                {t('homepage.hero_title')}
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight overflow-visible w-fit">
              <span className="block text-[var(--color-text)]">
                {t('homepage.hero_main_title_1')}
              </span>
              <span className="block text-transparent bg-clip-text gradient-primary font-fun tracking-wide">
                {t('homepage.hero_main_title_2')}
              </span>
              <span className="block text-[var(--color-text)]">
                {t('homepage.hero_main_title_3')}
              </span>
            </h1>

            <p className="text-xl text-[var(--color-text-muted)] max-w-xl leading-relaxed font-inter">
              {t('homepage.hero_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="filled"
                size="lg"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                {t('homepage.hero_cta')}
              </Button>

              <Button variant="outlined" size="lg">
                {t('nav.contact')}
              </Button>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce z-20">
        <span className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
          {t('homepage.scroll')}
        </span>
        <svg
          className="w-6 h-6 text-[var(--primary-color)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
