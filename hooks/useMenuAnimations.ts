import { useEffect } from 'react';
import { initMenuAnimations } from '@/utils/animations/menu-animations';

export function useMenuAnimations(menuTriggerRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const cleanupMenu = initMenuAnimations();

    return () => {
      if (cleanupMenu) cleanupMenu();
    };
  }, [menuTriggerRef]);
}