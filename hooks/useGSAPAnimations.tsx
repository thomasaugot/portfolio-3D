'use client'

import { useEffect } from 'react'
import { initializeGSAP, ScrollTrigger } from '@/utils/animations/gsap-init'
import { initMenuAnimations } from '@/utils/animations/menu-animations'

type AnimationFunction = () => void

export function useGSAPAnimations(animations: AnimationFunction[] = []) {
  useEffect(() => {
    // Initialize GSAP first
    initializeGSAP()
    
    // Initialize animations with timeout
    const timer = setTimeout(() => {
      // Always initialize menu animations since menu is global
      initMenuAnimations()
      
      // Initialize page-specific animations
      animations.forEach(animation => animation())
    }, 100)
    
    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      ScrollTrigger.refresh()
    }
  }, [])
}