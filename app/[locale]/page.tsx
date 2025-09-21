'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          {t('homepage.hero_title')}
        </h1>
        <p className="text-xl text-text-muted mb-8">
          {t('homepage.hero_subtitle')}
        </p>
        <button className="bg-electric-blue text-white px-8 py-4 rounded-full hover:scale-105 transition-transform">
          {t('homepage.hero_cta')}
        </button>
      </div>
    </div>
  )
}