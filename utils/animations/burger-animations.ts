import { gsap } from '@/utils/animations/gsap-init'

export function initPureNeonAnimations() {
  const menuTriggers = document.querySelectorAll('[data-animate="menu-trigger"]')
  const menuOverlay = document.querySelector('[data-animate="menu-overlay"]')
  const menuItems = document.querySelectorAll('[data-animate="menu-item"]')
  
  if (menuTriggers.length === 0) return

  let isOpen = false

  menuTriggers.forEach(menuTrigger => {
    const lines = menuTrigger.querySelectorAll('[data-animate^="line-"]')
    const crossLines = menuTrigger.querySelectorAll('[data-animate^="cross-"]')
    
    if (lines.length !== 3) return

    const [line1, line2, line3] = lines
    const [cross1, cross2] = crossLines

    // Hover effects
    menuTrigger.addEventListener('mouseenter', () => {
      if (!isOpen) {
        gsap.to(lines, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
          stagger: 0.05
        })
      }
    })

    menuTrigger.addEventListener('mouseleave', () => {
      if (!isOpen) {
        gsap.to(lines, {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    })

    menuTrigger.addEventListener('click', () => {
      if (isOpen) {
        close()
      } else {
        open()
      }
      isOpen = !isOpen
    })
  })

  function open() {
    const allLines = document.querySelectorAll('[data-animate^="line-"]')
    const allCrossLines = document.querySelectorAll('[data-animate^="cross-"]')
    
    const tl = gsap.timeline()
    
    // Lines fade out
    tl.to(allLines, {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      stagger: 0.05
    })
    
    // Cross lines appear
    .to(allCrossLines, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out'
    }, 0.2)
    
    // Rotate cross lines to form X
    .set(allCrossLines, { transformOrigin: 'center center' })
    .to(allCrossLines[0], {
      rotation: 45,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, 0.3)
    .to(allCrossLines[1], {
      rotation: -45,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, 0.3)
    
    // For multiple triggers, apply same rotation to all cross lines
    .to(allCrossLines, {
      rotation: (index) => index % 2 === 0 ? 45 : -45,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, 0.3)
    
    // Show menu overlay
    .to(menuOverlay, {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.5,
      ease: 'power2.out'
    }, 0.2)
    
    // Animate menu items
    .to(menuItems, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }, 0.4)
  }

  function close() {
    const allLines = document.querySelectorAll('[data-animate^="line-"]')
    const allCrossLines = document.querySelectorAll('[data-animate^="cross-"]')
    
    const tl = gsap.timeline()
    
    // Hide menu items
    tl.to(menuItems, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.inOut',
      stagger: 0.05
    })
    
    // Hide menu overlay
    .to(menuOverlay, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.4,
      ease: 'power2.inOut'
    }, 0.2)
    
    // Cross lines disappear
    .to(allCrossLines, {
      rotation: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    }, 0.1)
    
    // Lines return
    .to(allLines, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
      stagger: 0.1
    }, 0.4)
  }
}