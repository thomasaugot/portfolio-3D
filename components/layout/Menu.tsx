'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { getLocalizedMenuItems } from '@/data/menu'
import { initMenuAnimations } from '@/utils/animations/menu-animations'
import { initPureNeonAnimations } from '@/utils/animations/burger-animations'

export default function Menu() {
  const { t, language } = useTranslation()
  const localizedMenuItems = getLocalizedMenuItems(language)
  
  useGSAPAnimations([initMenuAnimations, initPureNeonAnimations])
  
  return (
    <>
      {/* Desktop: Styled like mobile */}
      <div
        data-animate="menu-trigger"
        className="fixed left-14 top-1/2 -translate-y-1/2 z-50 cursor-pointer hidden md:block"
      >
        <div className="relative flex items-center justify-center w-16 h-20 bg-surface/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110">
          <div className="flex items-center space-x-2">
            <div 
              data-animate="line-1"
              className="w-1 h-10 bg-text rounded-full transition-all duration-300"
            />
            <div 
              data-animate="line-2"
              className="w-1 h-10 bg-text rounded-full transition-all duration-300"
            />
            <div 
              data-animate="line-3"
              className="w-1 h-10 bg-text rounded-full transition-all duration-300"
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              data-animate="cross-1"
              className="absolute w-10 h-1 bg-text rounded-full opacity-0"
            />
            <div 
              data-animate="cross-2"
              className="absolute w-10 h-1 bg-text rounded-full opacity-0"
            />
          </div>
        </div>
      </div>

      {/* Mobile: Styled like theme toggle */}
      <div
        data-animate="menu-trigger"
        className="fixed right-6 top-6 z-50 cursor-pointer block md:hidden"
      >
        <div className="relative flex items-center justify-center w-12 h-12 bg-surface/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110">
          <div className="flex flex-col space-y-1.5">
            <div 
              data-animate="line-1"
              className="w-5 h-0.5 bg-text rounded-full transition-all duration-300"
            />
            <div 
              data-animate="line-2"
              className="w-5 h-0.5 bg-text rounded-full transition-all duration-300"
            />
            <div 
              data-animate="line-3"
              className="w-5 h-0.5 bg-text rounded-full transition-all duration-300"
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              data-animate="cross-1"
              className="absolute w-6 h-1 bg-text rounded-full opacity-0"
            />
            <div 
              data-animate="cross-2"
              className="absolute w-6 h-1 bg-text rounded-full opacity-0"
            />
          </div>
        </div>
      </div>
             
      {/* Full Screen Menu Overlay */}
      <div
        data-animate="menu-overlay"
        className="fixed inset-0 z-40 bg-bg opacity-0 pointer-events-none"
      >
        <div className="h-full flex items-center justify-center">
          <nav className="text-center">
            <ul className="space-y-8 py-12">
              {localizedMenuItems.map((item) => (
                <li
                  key={item.labelKey}
                  data-animate="menu-item"
                  className="opacity-0"
                >
                  <a
                    href={item.localizedHref}
                    className="block group cursor-pointer"
                  >
                    <div className="text-6xl md:text-8xl font-bold text-text mb-2 font-inter">
                      {t(item.labelKey)}
                    </div>
                    <div className="text-sm text-text-muted font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t(item.descriptionKey)}
                    </div>
                    <div className="w-0 h-px bg-electric-blue group-hover:w-full transition-all duration-500 mx-auto mt-4" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}