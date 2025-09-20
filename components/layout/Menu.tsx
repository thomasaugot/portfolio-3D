'use client'

import { menuItems } from '@/data/menu'

export default function Menu() {
  return (
    <>
      {/* Menu Trigger */}
      <button
        data-animate="menu-trigger"
        className="fixed top-8 right-8 z-50 w-16 h-16 rounded-full bg-electric-blue flex items-center justify-center overflow-hidden group"
      >
        <div
          data-animate="menu-morph"
          className="absolute inset-0 bg-electric-blue rounded-full origin-center"
        />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </div>
      </button>

      {/* Full Screen Menu Overlay */}
      <div
        data-animate="menu-overlay"
        className="fixed inset-0 z-40 bg-bg opacity-0 pointer-events-none"
      >
        <div className="h-full flex items-center justify-center">
          <nav className="text-center">
            <ul className="space-y-8">
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  data-animate="menu-item"
                  className="opacity-0"
                >
                  <a
                    href={item.href}
                    className="block group cursor-pointer"
                  >
                    <div className="text-6xl md:text-8xl font-bold text-text mb-2 font-inter">
                      {item.label}
                    </div>
                    <div className="text-sm text-text-muted font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
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