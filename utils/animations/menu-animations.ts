import { gsap } from '@/utils/animations/gsap-init'

export function initMenuAnimations() {
  // Menu trigger click handler
  const menuTrigger = document.querySelector('[data-animate="menu-trigger"]')
  const menuOverlay = document.querySelector('[data-animate="menu-overlay"]')
  
  if (!menuTrigger || !menuOverlay) return

  let isOpen = false

  menuTrigger.addEventListener('click', () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
    isOpen = !isOpen
  })

  function openMenu() {
    const morphElement = document.querySelector('[data-animate="menu-morph"]')
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]')
    
    const tl = gsap.timeline()
    
    tl.to(morphElement, {
      scale: 50,
      duration: 0.8,
      ease: 'power2.inOut'
    })
    .to(menuOverlay, {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.3
    }, '-=0.5')
    .fromTo(menuItems, {
      y: 100,
      opacity: 0,
      rotateX: 45
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.3')
  }

  function closeMenu() {
    const morphElement = document.querySelector('[data-animate="menu-morph"]')
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]')
    
    const tl = gsap.timeline()
    
    tl.to(menuItems, {
      y: -50,
      opacity: 0,
      rotateX: -45,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in'
    })
    .to(menuOverlay, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.3
    }, '-=0.1')
    .to(morphElement, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.2')
  }

  // Menu item hover effects
  const menuItems = document.querySelectorAll('[data-animate="menu-item"]')
  
  menuItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      menuItems.forEach((otherItem, i) => {
        gsap.to(otherItem, {
          scale: i === index ? 1.05 : 0.95,
          opacity: i === index ? 1 : 0.6,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
    
    item.addEventListener('mouseleave', () => {
      menuItems.forEach((otherItem) => {
        gsap.to(otherItem, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
}