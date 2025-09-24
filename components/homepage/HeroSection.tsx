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
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        data-3d-container="hero"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-animate="slide-up" className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary-color)]/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse" />
              <span className="text-sm font-mono text-[var(--primary-color)] tracking-wider uppercase">
                {t('homepage.hero_title')}
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="block text-[var(--color-text)] font-inter">
                {t('homepage.hero_main_title_1')}
              </span>
              <span className="block text-transparent bg-clip-text gradient-primary" style={{ fontFamily: 'var(--font-display)' }}>
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
              
              <Button 
                variant="outlined"
                size="lg"
              >
                {t('nav.contact')}
              </Button>
            </div>

            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-[var(--primary-color)] font-mono">3+</div>
                <div className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider">
                  {t('homepage.stats_years')}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--secondary-color)] font-mono">50+</div>
                <div className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider">
                  {t('homepage.stats_projects')}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--primary-color)] font-mono">∞</div>
                <div className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider">
                  {t('homepage.stats_possibilities')}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
        <span className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
          {t('homepage.scroll')}
        </span>
        <svg className="w-6 h-6 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}