import { gsap } from "@/lib/gsap";

export function initMobileMenuOpen(
  menuEl: HTMLElement,
  items: HTMLButtonElement[]
) {
  gsap.fromTo(menuEl, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });

  const rings = menuEl.querySelectorAll("[data-ring-outer], [data-ring-middle]");
  rings.forEach((ring, i) => {
    gsap.fromTo(
      ring,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        delay: 0.1 + i * 0.08,
        ease: "power2.out",
        onComplete: () => { gsap.set(ring, { clearProps: "all" }); },
      }
    );
  });

  items.forEach((item, i) => {
    if (!item) return;
    gsap.fromTo(
      item,
      { y: 60, opacity: 0, rotateX: -15 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.5, delay: 0.15 + i * 0.1, ease: "power3.out" }
    );
  });
}
