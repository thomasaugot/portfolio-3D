// utils/animations/footer.ts
import { gsap } from "@/lib/animations";

export function initFooterAnimations() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const footer = document.querySelector('footer');
      if (!footer) {
        console.warn('Footer not found, skipping animations');
        return;
      }

      const existingTriggers = (window as any).ScrollTrigger?.getAll() || [];
      existingTriggers.forEach((trigger: any) => {
        if (trigger.trigger === footer || footer.contains(trigger.trigger)) {
          trigger.kill();
        }
      });

      const logo = footer.querySelector('[data-animate="footer-logo"]');
      if (logo) {
        gsap.set(logo, { opacity: 0, y: 50 });
        gsap.to(logo, {
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            end: "top 20%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true
          },
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      }

      const socials = footer.querySelector('[data-animate="footer-socials"]');
      if (socials) {
        const buttons = Array.from(socials.querySelectorAll('button'));
        if (buttons.length > 0) {
          gsap.set(buttons, { opacity: 0, y: 30, scale: 0.8 });
          gsap.to(buttons, {
            scrollTrigger: {
              trigger: socials,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.7)",
            delay: 0.3
          });

          buttons.forEach((button) => {
            if (!(button instanceof HTMLElement)) return;
            
            button.addEventListener('mouseenter', () => {
              gsap.to(button, {
                scale: 1.15,
                rotation: 5,
                duration: 0.3,
                ease: "back.out(2)"
              });
            });

            button.addEventListener('mouseleave', () => {
              gsap.to(button, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
              });
            });
          });
        }
      }

      const sections = Array.from(footer.querySelectorAll('[data-animate="footer-section"]'));
      sections.forEach((section, idx) => {
        if (!section || !(section instanceof HTMLElement)) return;
        
        gsap.set(section, { opacity: 0, y: 40 });
        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: idx * 0.15,
          ease: "power3.out"
        });

        const links = Array.from(section.querySelectorAll('a, li'));
        if (links.length > 0) {
          gsap.set(links, { opacity: 0, x: -20 });
          gsap.to(links, {
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            },
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.3 + (idx * 0.15)
          });
        }
      });

      const bottomSection = footer.querySelector('.border-t');
      if (bottomSection) {
        gsap.set(bottomSection, { opacity: 0, y: 30 });
        gsap.to(bottomSection, {
          scrollTrigger: {
            trigger: bottomSection,
            start: "top 95%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    });
  });
}