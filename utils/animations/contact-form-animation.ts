import { gsap } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

export function initContactFormAnimation() {
  const measure = perfMonitor.startMeasure("contact-form-animation-init");

  const formSection = document.querySelector("[data-contact-form-section]");
  if (!formSection) {
    measure();
    return { kill: () => {} };
  }

  const info = formSection.querySelector("[data-contact-info]");
  const form = formSection.querySelector("[data-contact-form]");
  const formGlow = form?.querySelector("[data-form-glow]");
  const fields = formSection.querySelectorAll("[data-form-field]");
  const button = formSection.querySelector("[data-form-button]");

  gsap.set(info, { opacity: 0, x: -50, y: 30 });
  gsap.set(form, { opacity: 0, x: 50, y: 30, rotationY: -15 });
  gsap.set(fields, { opacity: 0, y: 20 });
  gsap.set(button, { opacity: 0, scale: 0.9 });

  const infoTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: info,
      start: "top 80%",
      end: "top 40%",
      scrub: 0.5,
    },
  });

  infoTimeline.to(info, {
    opacity: 1,
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  const formTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: form,
      start: "top 75%",
      end: "top 35%",
      scrub: 1,
    },
  });
  
  formTimeline
    .to(form, {
      opacity: 1,
      x: 0,
      y: 0,
      rotationY: 0,
      duration: 0.6,
      ease: "power2.out",
    }, 0);
  
  // only animate formGlow if it exists
  if (formGlow) {
    formTimeline.to(formGlow, {
      opacity: 0.4,
      duration: 0.4,
      ease: "power2.out",
    }, 0.2);
  }
  
  formTimeline
    .to(fields, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    }, 0.3)
    .to(button, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.3)",
    }, 0.7);

  measure();

  return {
    kill: () => {
      infoTimeline.scrollTrigger?.kill();
      formTimeline.scrollTrigger?.kill();
    },
  };
}