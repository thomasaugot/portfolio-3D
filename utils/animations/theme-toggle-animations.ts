import { gsap } from './gsap-init'

export const createThemeToggleAnimation = (
  cubeRef: HTMLDivElement,
  containerRef: HTMLDivElement,
  isDark: boolean,
  onComplete: () => void
) => {
  const reduced = 
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  const targetRotation = isDark ? 0 : -90

  const tl = gsap.timeline({ 
    defaults: { ease: 'power2.inOut' },
    onComplete
  })

  // Enhanced cube rotation with improved easing
  tl.to(cubeRef, {
    rotateX: targetRotation,
    duration: reduced ? 0 : 0.9,
    ease: 'back.inOut(1.4)',
  }, 0)

  // Container animation with more dynamic movement
  if (!reduced) {
    tl.fromTo(containerRef, {
      rotateY: 0,
      scale: 1,
    }, {
      rotateY: 15,
      scale: 1.05,
      duration: 0.45,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    }, 0)

    // Add subtle floating effect
    tl.to(containerRef, {
      y: -2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    }, 0.1)
  }

  return tl
}

export const initThemeTogglePosition = (cubeRef: HTMLDivElement, isDark: boolean) => {
  gsap.set(cubeRef, { 
    rotateX: isDark ? 0 : -90,
    transformOrigin: 'center center'
  })
}