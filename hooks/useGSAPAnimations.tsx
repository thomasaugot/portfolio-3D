// hooks/useGSAPAnimations.ts
'use client'

import { useEffect } from 'react'
import { initializeGSAP, ScrollTrigger } from '@/utils/animations/gsap-init'
import { initMenuAnimations } from '@/utils/animations/menu-animations'

type AnimationFunction = () => void

export function useGSAPAnimations(animations: AnimationFunction[] = []) {
  useEffect(() => {
    initializeGSAP()
    
    const timer = setTimeout(() => {
      initMenuAnimations()
      
      animations.forEach(animation => animation())
    }, 100)
    
    return () => {
      clearTimeout(timer)
      // Don't kill ScrollTriggers here - each animation manages its own cleanup
    }
  }, [])
}