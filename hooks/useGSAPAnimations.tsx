'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initMenuAnimations } from '@/utils/animations/menu-animations'

type AnimationFunction = () => void

export function useGSAPAnimations(animations: AnimationFunction[] = []) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    })

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    })

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