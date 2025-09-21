'use client'

import { useTheme } from './ThemeProvider'
import { useEffect } from 'react'
import { initThemeToggleAnimations } from '@/utils/animations/theme-toggle-animations'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      initThemeToggleAnimations()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [theme])

  return (
    <div className="relative w-fit">
      {/* Double Elliptical Orbits - positioned around the entire toggle */}
      <div 
        data-animate="orbit-1"
        className="absolute inset-0 flex items-center justify-center w-30 h-22 border border-electric-blue/20 rounded-full animate-[orbit_25s_linear_infinite] -z-10 m-auto"
      >
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-electric-blue rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-violet rounded-full" />
      </div>
      
      <div 
        data-animate="orbit-2"
        className="absolute inset-0 flex items-center justify-center w-32 h-20 border border-pink/15 rounded-full animate-[orbit_35s_linear_infinite_reverse] -z-10 m-auto"
      >
        <div className="absolute left-0 top-1/3 w-0.5 h-0.5 bg-pink rounded-full" />
        <div className="absolute right-1/4 top-3/4 w-0.5 h-0.5 bg-teal rounded-full" />
      </div>

      <div className="relative flex items-center bg-surface/80 backdrop-blur-md border border-border/50 rounded-2xl p-2 shadow-lg">
        {/* Morphing Background */}
        <div
          data-animate="morph-bg"
          className="absolute top-2 w-12 h-12 rounded-xl"
          style={{
            left: '56px',
            background: 'linear-gradient(135deg, #4338ca, #3730a3)',
            boxShadow: '0 4px 20px rgba(67, 56, 202, 0.4)',
          }}
        />

        {/* Sun Button */}
        <button
          onClick={() => setTheme('light')}
          className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110"
        >
          <div 
            data-animate="sun"
            className="relative flex items-center justify-center"
            style={{
              transform: theme === 'light' ? 'scale(1)' : 'scale(0.8)',
              opacity: theme === 'light' ? 1 : 0.3
            }}
          >
            <div className="w-6 h-6 bg-white rounded-full relative">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-white rounded-full"
                  style={{
                    top: '-6px',
                    left: '50%',
                    transformOrigin: '50% 18px',
                    transform: `translateX(-50%) rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </div>
          </div>
        </button>

        {/* Moon Button */}
        <button
          onClick={() => setTheme('dark')}
          className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110"
        >
          <div 
            data-animate="moon"
            className="relative flex items-center justify-center"
            style={{
              transform: theme === 'dark' ? 'scale(1)' : 'scale(0.8)',
              opacity: theme === 'dark' ? 1 : 0.3
            }}
          >
            <div className="relative w-6 h-6">
              <div className="w-6 h-6 bg-gray-300 rounded-full absolute"></div>
              <div 
                className="w-6 h-6 rounded-full absolute"
                style={{
                  background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.9) 60%, transparent 80%)',
                  transform: 'translateX(1px)'
                }}
              ></div>
              <div className="absolute top-1.5 left-1 w-1 h-1 bg-gray-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-1.5 left-1.5 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-40"></div>
              <div className="absolute top-3 left-0.5 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-50"></div>
            </div>
          </div>
        </button>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue/40 rounded-full animate-[particleFloat_2s_ease-in-out_infinite_alternate]"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(i) * 40}%`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}