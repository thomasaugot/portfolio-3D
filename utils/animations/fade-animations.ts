import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initFadeAnimations() {
  // Slide up from bottom
  gsap.utils.toArray('[data-animate="slide-up"]').forEach((element) => {
    gsap.fromTo(element as Element, 
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Slide down from top
  gsap.utils.toArray('[data-animate="slide-down"]').forEach((element) => {
    gsap.fromTo(element as Element, 
      {
        opacity: 0,
        y: -60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Slide in from right
  gsap.utils.toArray('[data-animate="slide-left"]').forEach((element) => {
    gsap.fromTo(element as Element, 
      {
        opacity: 0,
        x: 60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Slide in from left
  gsap.utils.toArray('[data-animate="slide-right"]').forEach((element) => {
    gsap.fromTo(element as Element, 
      {
        opacity: 0,
        x: -60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Simple fade in
  gsap.utils.toArray('[data-animate="fade"]').forEach((element) => {
    gsap.fromTo(element as Element, 
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Stagger children
  gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
    const items = (container as Element).children
    gsap.fromTo(items, 
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: container as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })
}