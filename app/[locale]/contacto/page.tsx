"use client";

import { initMenuAnimations } from "@/utils/animations/menu-animations";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initContactHeroAnimation } from "@/utils/animations/contact-hero-animations";
import { initContactFormAnimation } from "@/utils/animations/contact-form-animation";
import ContactHero from "@/components/contact-page/ContactHero";
import ContactFormSection from "@/components/contact-page/ContactFormSection";

export default function ContactPage() {
  useGSAPAnimations(() => {
    initMenuAnimations();
    initContactHeroAnimation();
    initContactFormAnimation();
  });

  return (
    <main className="text-text bg-bg overflow-x-hidden">
      <Menu />
      <ContactHero />
      <ContactFormSection />
      <Footer />
    </main>
  );
}
