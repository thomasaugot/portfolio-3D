import { gsap } from '@/utils/animations/gsap-init'

export function initThemeToggleAnimations() {
  const morphBgRef = document.querySelector('[data-animate="morph-bg"]') as HTMLDivElement
  const sunRef = document.querySelector('[data-animate="sun"]') as HTMLDivElement
  const moonRef = document.querySelector('[data-animate="moon"]') as HTMLDivElement
  const orbit1Ref = document.querySelector('[data-animate="orbit-1"]') as HTMLDivElement
  const orbit2Ref = document.querySelector('[data-animate="orbit-2"]') as HTMLDivElement
  
  if (!morphBgRef || !sunRef || !moonRef || !orbit1Ref || !orbit2Ref) return

  // Get current theme from document class
  const isDark = document.documentElement.classList.contains('dark')
  
  if (!isDark) {
    animateToLightTheme(morphBgRef, sunRef, moonRef, orbit1Ref, orbit2Ref)
  } else {
    animateToDarkTheme(morphBgRef, sunRef, moonRef, orbit1Ref, orbit2Ref)
  }
}

function animateToLightTheme(
  morphBgRef: HTMLDivElement,
  sunRef: HTMLDivElement,
  moonRef: HTMLDivElement,
  orbit1Ref: HTMLDivElement,
  orbit2Ref: HTMLDivElement
) {
  const tl = gsap.timeline()
  
  tl.to(morphBgRef, {
    left: '8px',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
    duration: 0.6,
    ease: 'power2.out'
  })
  .to(sunRef, {
    scale: 1,
    rotate: 180,
    opacity: 1,
    duration: 0.4
  }, '-=0.3')
  .to(moonRef, {
    scale: 0.8,
    opacity: 0.3,
    duration: 0.3
  }, '-=0.4')
  .to([orbit1Ref, orbit2Ref], {
    rotate: 0,
    duration: 0.6
  }, '-=0.6')

  return tl
}

function animateToDarkTheme(
  morphBgRef: HTMLDivElement,
  sunRef: HTMLDivElement,
  moonRef: HTMLDivElement,
  orbit1Ref: HTMLDivElement,
  orbit2Ref: HTMLDivElement
) {
  const tl = gsap.timeline()
  
  tl.to(morphBgRef, {
    left: '56px',
    background: 'linear-gradient(135deg, #4338ca, #3730a3)',
    boxShadow: '0 4px 20px rgba(67, 56, 202, 0.4)',
    duration: 0.6,
    ease: 'power2.out'
  })
  .to(moonRef, {
    scale: 1,
    rotate: -180,
    opacity: 1,
    duration: 0.4
  }, '-=0.3')
  .to(sunRef, {
    scale: 0.8,
    opacity: 0.3,
    duration: 0.3
  }, '-=0.4')
  .to(orbit1Ref, {
    rotate: 180,
    duration: 0.6
  }, '-=0.6')
  .to(orbit2Ref, {
    rotate: -120,
    duration: 0.6
  }, '-=0.6')

  return tl
}