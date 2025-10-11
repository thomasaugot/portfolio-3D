import { gsap } from "@/lib/animations";

export function initFooterAnimations() {
  // Use multiple RAF calls to ensure DOM is fully ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const footer = document.querySelector('footer');
      if (!footer) {
        console.warn('Footer not found, skipping animations');
        return;
      }

      // Kill any existing ScrollTriggers on footer to prevent conflicts
      const existingTriggers = (window as any).ScrollTrigger?.getAll() || [];
      existingTriggers.forEach((trigger: any) => {
        if (trigger.trigger === footer || footer.contains(trigger.trigger)) {
          trigger.kill();
        }
      });

      // Animate logo section
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

      // Animate social buttons with stagger
      const socials = footer.querySelector('[data-animate="footer-socials"]');
      if (socials) {
        const buttons = Array.from(socials.querySelectorAll('button'));
        if (buttons.length > 0) {
          gsap.set(buttons, { opacity: 0, scale: 0, rotation: 180 });
          gsap.to(buttons, {
            scrollTrigger: {
              trigger: socials,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            },
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(2)",
            delay: 0.3
          });
        }
      }

      // Animate 3D cards
      const cards = Array.from(footer.querySelectorAll('[data-animate="footer-card"]'));
      cards.forEach((card, idx) => {
        if (!card || !(card instanceof HTMLElement)) return;
        
        gsap.set(card, { 
          opacity: 0, 
          y: 60,
          rotateX: -15,
          rotateY: idx % 2 === 0 ? 15 : -15,
          z: -50
        });
        
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true
          },
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          duration: 1,
          delay: idx * 0.2,
          ease: "power3.out"
        });

        // 3D tilt effect on hover
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 15;
          const rotateY = (centerX - x) / 15;
          
          gsap.to(card, {
            rotateX: -rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
            overwrite: 'auto'
          });
        };
        
        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: 'auto'
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });

      // Animate navigation links
      const navLinks = Array.from(footer.querySelectorAll('nav a'));
      if (navLinks.length > 0) {
        const navCard = navLinks[0]?.closest('[data-animate="footer-card"]');
        if (navCard) {
          gsap.set(navLinks, { opacity: 0, x: -30 });
          gsap.to(navLinks, {
            scrollTrigger: {
              trigger: navCard,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            },
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.4
          });
        }
      }

      // Animate service items
      const serviceItems = Array.from(footer.querySelectorAll('ul li'));
      if (serviceItems.length > 0) {
        const serviceCard = serviceItems[0]?.closest('[data-animate="footer-card"]');
        if (serviceCard) {
          gsap.set(serviceItems, { opacity: 0, x: -30 });
          gsap.to(serviceItems, {
            scrollTrigger: {
              trigger: serviceCard,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            },
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.4
          });
        }
      }

      // Animate contact info
      const contactCard = footer.querySelector('[data-animate="footer-card"]:last-child');
      if (contactCard) {
        const contactLinks = Array.from(contactCard.querySelectorAll('a'));
        if (contactLinks.length > 0) {
          gsap.set(contactLinks, { opacity: 0, y: 20 });
          gsap.to(contactLinks, {
            scrollTrigger: {
              trigger: contactCard,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.5
          });
        }
      }

      // Animate bottom section
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