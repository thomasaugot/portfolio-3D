'use client'

import { useEffect } from 'react'
import { initHeroScrollTransition } from '@/utils/animations/hero-scroll-transition'

export function useHeroScrollTransition() {
  useEffect(() => {
    const cleanup = initHeroScrollTransition()
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])
}