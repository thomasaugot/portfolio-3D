import { gsap } from "./gsap-init";

let contactTimeline: gsap.core.Timeline | null = null;
let continuousAnimations: gsap.core.Timeline[] = [];

export function initContactBlockAnimations() {
  const megaLogo = document.querySelector('[data-animate="mega-logo"]');
  const logoAura = document.querySelector('[data-animate="logo-aura"]');
  const plasmaWaves = document.querySelectorAll(
    '[data-animate^="plasma-wave-"]'
  );
  const gridLines = document.querySelectorAll('[data-animate^="grid-line-"]');
  const contacts = [
    document.querySelector('[data-animate="contact-whatsapp"]'),
    document.querySelector('[data-animate="contact-email"]'),
    document.querySelector('[data-animate="contact-calendar"]'),
    document.querySelector('[data-animate="contact-linkedin"]'),
    document.querySelector('[data-animate="contact-github"]'),
  ];

  if (!megaLogo || contacts.some((c) => !c)) return;

  // Initial states
  gsap.set(contacts, { scale: 0, opacity: 0 });
  gsap.set(megaLogo, { scale: 0, opacity: 0 });
  gsap.set(plasmaWaves, {
    scale: 0.5,
    rotation: () => gsap.utils.random(-180, 180),
    opacity: 0,
  });
  gsap.set(gridLines, { scaleX: 0, opacity: 0 });
  gsap.set(logoAura, { opacity: 0, scale: 1 });

  // Entrance sequence with STAGGERED contacts
  contactTimeline = gsap.timeline();

  contactTimeline
    .to(plasmaWaves, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.05,
      ease: "power2.out",
    })
    .to(
      gridLines,
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=1"
    )
    .to(
      megaLogo,
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    )
    .to(
      logoAura,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .to(
      contacts,
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15, // STAGGERED entrance
        ease: "back.out(1.7)",
      },
      "-=0.4"
    );

  // Start continuous animations
  contactTimeline.call(() => {
    startContinuousAnimations();
  });

  return () => {
    if (contactTimeline) {
      contactTimeline.kill();
      contactTimeline = null;
    }
    continuousAnimations.forEach((tl) => tl.kill());
    continuousAnimations = [];
  };
}

export function resetContactBlockToClosedState() {
  const megaLogo = document.querySelector('[data-animate="mega-logo"]');
  const logoAura = document.querySelector('[data-animate="logo-aura"]');
  const plasmaWaves = document.querySelectorAll(
    '[data-animate^="plasma-wave-"]'
  );
  const gridLines = document.querySelectorAll('[data-animate^="grid-line-"]');
  const contacts = [
    document.querySelector('[data-animate="contact-whatsapp"]'),
    document.querySelector('[data-animate="contact-email"]'),
    document.querySelector('[data-animate="contact-calendar"]'),
    document.querySelector('[data-animate="contact-linkedin"]'),
    document.querySelector('[data-animate="contact-github"]'),
  ];

  if (contactTimeline) {
    contactTimeline.kill();
    contactTimeline = null;
  }

  continuousAnimations.forEach((tl) => tl.kill());
  continuousAnimations = [];

  gsap.set(contacts, { scale: 0, opacity: 0 });
  gsap.set(megaLogo, { scale: 0, opacity: 0 });
  gsap.set(logoAura, { opacity: 0, scale: 1 });
  gsap.set(plasmaWaves, { scale: 0.5, rotation: 0, opacity: 0 });
  gsap.set(gridLines, { scaleX: 0, opacity: 0 });
}

export function animateContactBlockIn() {
  const megaLogo = document.querySelector('[data-animate="mega-logo"]');
  const logoAura = document.querySelector('[data-animate="logo-aura"]');
  const plasmaWaves = document.querySelectorAll(
    '[data-animate^="plasma-wave-"]'
  );
  const gridLines = document.querySelectorAll('[data-animate^="grid-line-"]');
  const contacts = [
    document.querySelector('[data-animate="contact-whatsapp"]'),
    document.querySelector('[data-animate="contact-email"]'),
    document.querySelector('[data-animate="contact-calendar"]'),
    document.querySelector('[data-animate="contact-linkedin"]'),
    document.querySelector('[data-animate="contact-github"]'),
  ];

  if (!megaLogo || contacts.some((c) => !c)) return null;

  if (contactTimeline) {
    contactTimeline.kill();
    contactTimeline = null;
  }
  continuousAnimations.forEach((tl) => tl.kill());
  continuousAnimations = [];

  contactTimeline = gsap.timeline();

  contactTimeline
    .to(plasmaWaves, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: "power2.out",
    })
    .to(
      gridLines,
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
      },
      "-=0.6"
    )
    .to(
      megaLogo,
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.3"
    )
    .to(
      logoAura,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2"
    )
    .to(
      contacts,
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.15, // STAGGERED entrance
        ease: "back.out(1.7)",
      },
      "-=0.2"
    );

  contactTimeline.call(() => {
    startContinuousAnimations();
  });

  return contactTimeline;
}

export function animateContactBlockOut() {
  const megaLogo = document.querySelector('[data-animate="mega-logo"]');
  const logoAura = document.querySelector('[data-animate="logo-aura"]');
  const plasmaWaves = document.querySelectorAll(
    '[data-animate^="plasma-wave-"]'
  );
  const gridLines = document.querySelectorAll('[data-animate^="grid-line-"]');
  const contacts = [
    document.querySelector('[data-animate="contact-whatsapp"]'),
    document.querySelector('[data-animate="contact-email"]'),
    document.querySelector('[data-animate="contact-calendar"]'),
    document.querySelector('[data-animate="contact-linkedin"]'),
    document.querySelector('[data-animate="contact-github"]'),
  ];

  continuousAnimations.forEach((tl) => tl.kill());
  continuousAnimations = [];

  if (contactTimeline) {
    contactTimeline.kill();
    contactTimeline = null;
  }

  const exitTimeline = gsap.timeline();

  exitTimeline
    .to([...contacts].reverse(), {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08, // STAGGERED exit
      ease: "power2.in",
    })
    .to(
      logoAura,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.2"
    )
    .to(
      megaLogo,
      {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.2"
    )
    .to(
      gridLines,
      {
        scaleX: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.in",
      },
      "-=0.3"
    )
    .to(
      plasmaWaves,
      {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.in",
      },
      "-=0.4"
    );

  return exitTimeline;
}

function startContinuousAnimations() {
  const logoAura = document.querySelector('[data-animate="logo-aura"]');
  const plasmaWaves = document.querySelectorAll(
    '[data-animate^="plasma-wave-"]'
  );
  const gridLines = document.querySelectorAll('[data-animate^="grid-line-"]');
  const contacts = [
    document.querySelector('[data-animate="contact-whatsapp"]'),
    document.querySelector('[data-animate="contact-email"]'),
    document.querySelector('[data-animate="contact-calendar"]'),
    document.querySelector('[data-animate="contact-linkedin"]'),
    document.querySelector('[data-animate="contact-github"]'),
  ];

  if (logoAura) {
    const auraTl = gsap.timeline({ repeat: -1, yoyo: true });
    auraTl.to(logoAura, {
      scale: 1.1,
      opacity: 0.6,
      duration: 4,
      ease: "power2.inOut",
    });
    continuousAnimations.push(auraTl);
  }

  plasmaWaves.forEach((wave, index) => {
    const waveTl = gsap.timeline({ repeat: -1 });
    waveTl.to(wave, {
      rotation: index % 2 === 0 ? 360 : -360,
      duration: 20 + index * 5,
      ease: "none",
    });
    continuousAnimations.push(waveTl);
  });

  gridLines.forEach((line, index) => {
    const lineTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: index * 0.3,
    });
    lineTl.to(line, {
      opacity: 0.8,
      duration: 3 + index * 0.5,
      ease: "power2.inOut",
    });
    continuousAnimations.push(lineTl);
  });

  contacts.forEach((contact, index) => {
    if (!contact) return;

    const contactTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: index * 0.8,
    });
    contactTl.to(contact, {
      y: "+=15",
      duration: 5 + index,
      ease: "power1.inOut",
    });
    continuousAnimations.push(contactTl);
  });
}
