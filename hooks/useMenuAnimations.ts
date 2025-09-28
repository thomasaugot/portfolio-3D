import { useEffect, RefObject } from 'react'
import { initMenuAnimations } from '@/utils/animations/menu-animations'
import { initContactBlockAnimations } from '@/utils/animations/contact-block-animations'
import { initMobileContactBlockAnimations } from '@/utils/animations/mobile-contact-animations'

export function useMenuAnimations(menuTriggerRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!menuTriggerRef.current) {
      return
    }

    const timeoutId = setTimeout(() => {
      if (menuTriggerRef.current) {
        initMenuAnimations()
        
        // Initialize appropriate contact animations based on screen size
        const isMobile = window.innerWidth < 1024 // lg breakpoint
        
        if (isMobile) {
          initMobileContactBlockAnimations()
        } else {
          initContactBlockAnimations()
        }
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [menuTriggerRef])
}