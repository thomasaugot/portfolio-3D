'use client'

import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { useHeroScrollTransition } from '@/hooks/useHeroScrollTransition'
import { initFadeAnimations } from '@/utils/animations/fade-animations'
import Menu from '@/components/layout/Menu'
import HeroSection from '@/components/homepage/HeroSection'
import SkillsSection from '@/components/homepage/SkillsSection'

export default function Home() {
  useGSAPAnimations([initFadeAnimations])
  useHeroScrollTransition()
  
  return (
    <main className="min-h-screen bg-bg text-text">
      <Menu />
      <HeroSection />
      <SkillsSection />
    </main>
  )
}