import { gsap } from "@/lib/animations";

export function initCarousel3D() {
  const carousel = document.querySelector(
    '[data-animate="carousel-3d"]'
  ) as HTMLElement;
  const cards = document.querySelectorAll(
    '[data-animate="card-3d"]'
  ) as NodeListOf<HTMLElement>;

  if (!carousel || !cards.length) return;

  const radius = 250;
  const angle = 360 / cards.length;

  gsap.set(carousel, {
    transformStyle: "preserve-3d",
    rotationX: -10, // Tilt down slightly
  });

  cards.forEach((card, i) => {
    const rotY = i * angle;
    const x = Math.sin((rotY * Math.PI) / 180) * radius;
    const z = Math.cos((rotY * Math.PI) / 180) * radius - 200; // Push forward

    gsap.set(card, {
      rotationY: rotY,
      x: x,
      z: z,
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
    });
  });
}

export function rotateCarousel3D(targetIndex: number) {
  const carousel = document.querySelector(
    '[data-animate="carousel-3d"]'
  ) as HTMLElement;
  const cards = document.querySelectorAll(
    '[data-animate="card-3d"]'
  ) as NodeListOf<HTMLElement>;

  if (!carousel || !cards.length) return;

  const angle = 360 / cards.length;
  const rotation = -targetIndex * angle;

  gsap.to(carousel, {
    rotationY: rotation,
    duration: 1,
    ease: "power2.inOut",
  });

  cards.forEach((card, i) => {
    gsap.to(card, {
      scale: i === targetIndex ? 1.05 : 0.85,
      duration: 0.6,
      ease: "power2.out",
    });
  });
}
