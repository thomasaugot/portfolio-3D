'use client'

import { useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useMenuAnimations } from '@/hooks/useMenuAnimations'
import { getLocalizedMenuItems } from '@/data/menu'

export default function Menu() {
  const { t, language } = useTranslation()
  const localizedMenuItems = getLocalizedMenuItems(language)
  const menuTriggerRef = useRef<HTMLDivElement>(null)

  useMenuAnimations(menuTriggerRef)

  return (
    <>
      {/* Trigger */}
      <div
        ref={menuTriggerRef}
        data-animate="menu-trigger"
        className="fixed top-8 right-8 z-50 cursor-pointer group"
      >
        <div className="relative w-16 h-16" style={{ perspective: '1000px' }}>
          {/* Blob that expands (kept behind with -z-10) */}
          <div
            data-animate="menu-blob"
            className="absolute inset-0 rounded-xl gradient-primary shadow-lg shadow-[var(--primary-color)]/30 transition-all duration-300 group-hover:shadow-[var(--primary-color)]/50 -z-10"
            style={{
              transform: 'rotateX(8deg) rotateY(-8deg)',
              transformStyle: 'preserve-3d'
            }}
          />
          {/* Burger / Cross */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 z-20">
            <div data-animate="burger-line-1" className="w-8 h-0.5 bg-black rounded-full" />
            <div data-animate="burger-line-2" className="w-8 h-0.5 bg-black rounded-full" />
            <div data-animate="burger-line-3" className="w-8 h-0.5 bg-black rounded-full" />
          </div>
        </div>
      </div>

      {/* Overlay + Menu */}
      <div
        data-animate="menu-overlay"
        className="fixed inset-0 z-40 bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-surface)] opacity-0 pointer-events-none backdrop-blur-xl"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("/assets/images/charcoal-texture.webp")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div 
          data-animate="menu-content"
          className="h-full flex items-center justify-center relative px-8"
        >
          <nav className="text-center w-full max-w-3xl relative !z-50">
            <ul className="space-y-10 !z-[999]">
              {localizedMenuItems.map((item) => (
                <li
                  key={item.labelKey}
                  data-animate="menu-item"
                  className="opacity-0 group relative"
                >
                  <a href={item.localizedHref} className="block relative">
                    <div
                      data-animate="menu-text"
                      className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-2 relative"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {t(item.labelKey)}
                    </div>

                    <div
                      data-animate="menu-desc"
                      className="text-sm text-[var(--color-text-muted)] font-mono opacity-0 translate-y-2 mb-4"
                    >
                      {t(item.descriptionKey)}
                    </div>

                    <div
                      data-animate="menu-line"
                      className="h-0.5 gradient-primary mx-auto origin-left rounded-full"
                      style={{ width: '60px', transform: 'scaleX(0)' }}
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-16 flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase mb-1">
                  {t('homepage.languages')}
                </div>
                <div className="flex gap-3">
                  <span className="text-sm font-mono text-[var(--primary-color)]">EN</span>
                  <span className="text-sm font-mono text-[var(--color-text-muted)]">FR</span>
                  <span className="text-sm font-mono text-[var(--color-text-muted)]">ES</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase mb-1">
                  {t('nav.contact')}
                </div>
                <div className="text-sm font-mono text-[var(--secondary-color)]">
                  thomas.augot@hotmail.fr
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}