"use client";

import { initMenuAnimations } from "@/utils/animations/menu-animations";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initContactHeroAnimation, initContactHeroScrollAnimation } from "@/utils/animations/contact-animations";
import ContactHero from "@/components/contact-page/ContactHero";

export default function ContactPage() {
  useGSAPAnimations(() => {
    initMenuAnimations();
    initContactHeroAnimation();
    initContactHeroScrollAnimation();
  });

  return (
    <main className="text-text bg-bg overflow-x-hidden">
      <Menu />
      <ContactHero />
      <Footer />
    </main>
  );
}
