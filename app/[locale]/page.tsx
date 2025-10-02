"use client"

import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { initFadeAnimations } from '@/utils/animations/fade-animations'
import { initProjectsScrollAnimation } from '@/utils/animations/projects-scroll-animation'
import { initSkillsScrollAnimation } from '@/utils/animations/skills-scroll-animation'
import Menu from '@/components/layout/Menu'
import HeroSection from '@/components/homepage/HeroSection'
import SkillsSection from '@/components/homepage/SkillsSection'
import ProjectsShowcase from '@/components/homepage/ProjectsShowcase'
import { useHomepageScrollAnimation } from '@/hooks/useHomepageScrollAnimation'

export default function Home() {
  useGSAPAnimations([
    initFadeAnimations, 
    initProjectsScrollAnimation,
    initSkillsScrollAnimation
  ])
  useHomepageScrollAnimation()
  
  return (
    <main className="min-h-screen bg-bg text-text">
      <Menu />
      <HeroSection />
      <SkillsSection />
      <ProjectsShowcase />
    </main>
  )
}