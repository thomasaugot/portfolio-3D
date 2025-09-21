import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Initialize GSAP only on client side
let isInitialized = false

export function initializeGSAP() {
  if (typeof window === 'undefined' || isInitialized) return
  
  // Register plugins
  gsap.registerPlugin(ScrollTrigger)
  
  // Configure GSAP
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  })

  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  })
  
  isInitialized = true
}

// Export GSAP for reuse (will be configured after initialization)
export { gsap, ScrollTrigger }