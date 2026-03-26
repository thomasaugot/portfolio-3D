import { gsap } from "@/lib/gsap";

export function initMobileMenuOpen(
  menuEl: HTMLElement,
  items: HTMLButtonElement[]
) {
  gsap.fromTo(menuEl, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "power2.out" });

  const panel = menuEl.querySelector("[data-menu-panel]");
  if (panel) {
    gsap.fromTo(
      panel,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.42, ease: "power3.out" }
    );
  }

  items.forEach((item, i) => {
    if (!item) return;
    gsap.fromTo(
      item,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, delay: 0.16 + i * 0.06, ease: "power2.out" }
    );
  });
}

export function initMobileMenuClose(menuEl: HTMLElement, onComplete: () => void) {
  const panel = menuEl.querySelector("[data-menu-panel]");
  gsap.to(menuEl, { opacity: 0, duration: 0.28, ease: "power2.in" });
  if (panel) {
    gsap.to(panel, { y: "100%", duration: 0.3, ease: "power2.in", onComplete });
  } else {
    onComplete();
  }
}
