"use client";

import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initContactHeroAnimation, initContactHeroScrollAnimation } from "@/utils/animations/contact-animations";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
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
