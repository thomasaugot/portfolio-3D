import { gsap } from '@/utils/animations/gsap-init'

export function initCarousel3D() {
  const carousel = document.querySelector('[data-animate="carousel-3d"]') as HTMLElement
  const cards = document.querySelectorAll('[data-animate="card-3d"]') as NodeListOf<HTMLElement>
  
  if (!carousel || !cards.length) return

  const radius = 200 // Reduced from 300
  const total = cards.length
  const angle = 360 / total

  // Setup 3D space
  gsap.set(carousel, {
    transformStyle: 'preserve-3d'
  })

  // Position cards in 3D circle
  cards.forEach((card, i) => {
    const rotY = i * angle
    const x = Math.sin(rotY * Math.PI / 180) * radius
    const z = Math.cos(rotY * Math.PI / 180) * radius

    gsap.set(card, {
      rotationY: rotY,
      x: x,
      z: z,
      transformOrigin: 'center center',
      transformStyle: 'preserve-3d'
    })
  })
}

export function rotateCarousel3D(targetIndex: number) {
  const carousel = document.querySelector('[data-animate="carousel-3d"]') as HTMLElement
  const cards = document.querySelectorAll('[data-animate="card-3d"]') as NodeListOf<HTMLElement>
  
  if (!carousel || !cards.length) return

  const angle = 360 / cards.length
  const rotation = -targetIndex * angle

  // Rotate carousel
  gsap.to(carousel, {
    rotationY: rotation,
    duration: 1,
    ease: 'power2.inOut'
  })

  // Scale active card
  cards.forEach((card, i) => {
    gsap.to(card, {
      scale: i === targetIndex ? 1.05 : 0.85, // Reduced scaling
      duration: 0.6,
      ease: 'power2.out'
    })
  })
}