import { useEffect, RefObject } from 'react'
import { initMenuAnimations } from '@/utils/animations/menu-animations'

export function useMenuAnimations(menuTriggerRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    console.log('🎯 useMenuAnimations effect triggered')
    
    if (!menuTriggerRef.current) {
      console.error('❌ Menu trigger ref not available!')
      return
    }
    
    const timeoutId = setTimeout(() => {
      console.log('⏱️ About to initialize menu animations')
      if (menuTriggerRef.current) {
        initMenuAnimations()
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [menuTriggerRef])
}