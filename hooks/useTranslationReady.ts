import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export function useTranslationReady() {
  const [isReady, setIsReady] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Test if translations are loaded by checking a basic key
    const testKey = 'homepage.hero_title'
    const translatedValue = t(testKey)
    
    // If translation returns the key itself, it's not loaded yet
    if (translatedValue !== testKey) {
      setIsReady(true)
    } else {
      setIsReady(false)
    }
  }, [t])

  return isReady
}