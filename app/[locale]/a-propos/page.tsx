'use client'

import { useTranslation } from "@/lib/TranslationProvider"


export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pt-32 px-8 bg-bg text-text">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          {t('about_page.title')}
        </h1>
        <p className="text-xl text-text-muted mb-8">
          {t('about_page.subtitle')}
        </p>
        <div className="prose prose-lg text-text">
          <p>{t('about_page.intro')}</p>
        </div>
      </div>
    </div>
  )
}