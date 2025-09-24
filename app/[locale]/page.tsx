'use client'

import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { initFadeAnimations } from '@/utils/animations/fade-animations'
import { initMenuAnimations } from '@/utils/animations/menu-animations'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import Menu from '@/components/layout/Menu'
import HeroSection from '@/components/homepage/HeroSection'
import SkillsSection from '@/components/homepage/SkillsSection'
import ExperienceSection from '@/components/homepage/ExperienceSection'
import CTASection from '@/components/homepage/CTASection'

export default function Home() {
  useGSAPAnimations([initFadeAnimations, initMenuAnimations])
 
  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="fixed top-8 left-8 z-50">
        <ThemeToggle />
      </div>
      
      <Menu />
     
      <HeroSection />
      {/* <SkillsSection />
      <ExperienceSection />
      <CTASection /> */}
    </main>
  )
}