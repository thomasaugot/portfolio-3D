'use client'

import { useEffect, useRef, useCallback } from 'react'
import { IoSunny, IoMoon } from 'react-icons/io5'
import { useTheme } from './ThemeProvider'
import { gsap } from '@/utils/animations/gsap-init'

type Props = {
  size?: number
}

export function ThemeToggle({ size = 50 }: Props) {
  const { theme, setTheme } = useTheme()
  const cubeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const TILT_X = -22 // small constant tilt so you see the top
  const Y_ANGLE = 15 // slight turn to the side

  // Mount-only: set base transforms and perpetual idle animations (no stacking).
  useEffect(() => {
    if (!cubeRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // initial pose based on current theme
      const baseX = (theme === 'dark' ? 0 : -90) + TILT_X
      gsap.set(cubeRef.current, {
        rotationY: Y_ANGLE,
        rotationX: baseX,
        transformStyle: 'preserve-3d',
      })

      // idle float
      gsap.to(containerRef.current, {
        y: -5,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      // gentle wobble
      gsap.to(cubeRef.current, {
        rotationZ: 2,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once

  // If theme changes from elsewhere, just snap to the correct tilted face.
  useEffect(() => {
    if (!cubeRef.current) return
    const targetX = (theme === 'dark' ? 0 : -90) + TILT_X
    gsap.set(cubeRef.current, { rotationX: targetX, rotationY: Y_ANGLE })
  }, [theme])

  const handleClick = useCallback(() => {
    if (!cubeRef.current) return

    const nextTheme = theme === 'light' ? 'dark' : 'light'
    const baseTargetX = nextTheme === 'dark' ? 0 : -90

    // sometimes spin the long way for fun
    const goLongWay = Math.random() > 0.6
    let finalTarget = baseTargetX
    if (goLongWay) finalTarget = nextTheme === 'dark' ? 360 : -450

    gsap.to(cubeRef.current, {
      rotationX: finalTarget + TILT_X, // keep the tilt!
      rotationY: Y_ANGLE,              // keep Y stable
      duration: goLongWay ? 0.9 : 0.6,
      ease: 'back.inOut(1.2)',
      onComplete: () => {
        // normalize angles and then update theme (which also snaps via the effect)
        gsap.set(cubeRef.current, { rotationX: baseTargetX + TILT_X, rotationY: Y_ANGLE })
        setTheme(nextTheme)
      },
    })
  }, [theme, setTheme])

  return (
    <div ref={containerRef} style={{ perspective: '500px' }}>
      <button
        onClick={handleClick}
        className="block focus:outline-none"
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="Toggle theme"
      >
        <div
          ref={cubeRef}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: 'relative',
            transformStyle: 'preserve-3d',
            // No inline transform here—GSAP owns all transforms.
          }}
        >
          {/* Front - Moon (Dark theme) */}
          <div
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${size / 2}px)`,
              padding: '4px',
              background:
                'linear-gradient(222deg, var(--secondary-color-1) 67.22%, var(--primary-color-1) 93.57%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IoMoon size={size * 0.6} className="text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Top - Sun (Light theme) */}
          <div
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(90deg) translateZ(${size / 2}px)`,
              padding: '4px',
              background:
                'linear-gradient(222deg, var(--primary-color-1) 67.22%, var(--secondary-color-1) 93.57%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IoSunny
                size={size * 0.6}
         className="text-white drop-shadow-lg"
              />
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(90deg) translateZ(${size / 2}px)`,
              padding: '3px',
              background: 'linear-gradient(45deg, var(--primary-color-1) 30%, var(--secondary-color-1) 70%)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
              }}
            />
          </div>

          {/* Left */}
          <div
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
              padding: '3px',
              background: 'linear-gradient(135deg, var(--secondary-color-1) 40%, var(--primary-color-1) 60%)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
              }}
            />
          </div>

          {/* Back */}
          <div
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(180deg) translateZ(${size / 2}px)`,
              padding: '3px',
              background: 'linear-gradient(42deg, var(--secondary-color-1) 6.43%, var(--primary-color-1) 22.78%)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
              }}
            />
          </div>

          {/* Bottom */}
          <div
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
              padding: '3px',
              background: 'linear-gradient(315deg, var(--primary-color-1) 50%, var(--secondary-color-1) 50%)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
              }}
            />
          </div>
        </div>
      </button>
    </div>
  )
}
