import { gsap } from "./gsap-init";

let mobileContactTimeline: gsap.core.Timeline | null = null;

export function initMobileContactBlockAnimations() {
  const mobileContacts = document.querySelectorAll('[data-animate^="mobile-contact-"]');
  
  if (!mobileContacts.length) return;

  // Initial states
  gsap.set(mobileContacts, { 
    scale: 0, 
    opacity: 0,
    y: 20
  });

  // Entrance sequence
  mobileContactTimeline = gsap.timeline();

  mobileContactTimeline.to(mobileContacts, {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)",
  });

  return () => {
    if (mobileContactTimeline) {
      mobileContactTimeline.kill();
      mobileContactTimeline = null;
    }
  };
}

export function resetMobileContactBlockToClosedState() {
  const mobileContacts = document.querySelectorAll('[data-animate^="mobile-contact-"]');

  if (mobileContactTimeline) {
    mobileContactTimeline.kill();
    mobileContactTimeline = null;
  }

  gsap.set(mobileContacts, { 
    scale: 0, 
    opacity: 0,
    y: 20
  });
}

export function animateMobileContactBlockIn() {
  const mobileContacts = document.querySelectorAll('[data-animate^="mobile-contact-"]');
  
  if (!mobileContacts.length) return null;

  if (mobileContactTimeline) {
    mobileContactTimeline.kill();
    mobileContactTimeline = null;
  }

  mobileContactTimeline = gsap.timeline();

  mobileContactTimeline.to(mobileContacts, {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 0.4,
    stagger: 0.08,
    ease: "back.out(1.7)",
  });

  return mobileContactTimeline;
}

export function animateMobileContactBlockOut() {
  const mobileContacts = document.querySelectorAll('[data-animate^="mobile-contact-"]');

  if (mobileContactTimeline) {
    mobileContactTimeline.kill();
    mobileContactTimeline = null;
  }

  const exitTimeline = gsap.timeline();

  exitTimeline.to([...mobileContacts].reverse(), {
    scale: 0,
    opacity: 0,
    y: -20,
    duration: 0.3,
    stagger: 0.05,
    ease: "power2.in",
  });

  return exitTimeline;
}