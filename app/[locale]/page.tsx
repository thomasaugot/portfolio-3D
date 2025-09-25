'use client'

import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { initFadeAnimations } from '@/utils/animations/fade-animations'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import Menu from '@/components/layout/Menu'
import HeroSection from '@/components/homepage/HeroSection'
import SkillsSection from '@/components/homepage/SkillsSection'
import ExperienceSection from '@/components/homepage/ExperienceSection'
import CTASection from '@/components/homepage/CTASection'

export default function Home() {
  useGSAPAnimations([initFadeAnimations])
  
  return (
    <main className="min-h-screen bg-bg text-text">
      <Menu />
      <HeroSection />
      {/* <SkillsSection />
      <ExperienceSection />
      <CTASection /> */}
    </main>
  )
}