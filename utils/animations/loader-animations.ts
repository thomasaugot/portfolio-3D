import { gsap } from '@/utils/animations/gsap-init'

export function initLoaderAnimations(containerRef: React.RefObject<HTMLElement>) {
  if (!containerRef.current) return

  const ctx = gsap.context(() => {
    gsap.fromTo(
      "[data-animate='logo']",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    )
    
    gsap.to("[data-animate='bar']", {
      scaleX: 1,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    })
  }, containerRef.current)

  return () => ctx.revert()
}