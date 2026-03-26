import { gsap } from "@/lib/gsap";

export function initNotFound() {
  gsap.fromTo(
    "[data-animate]",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.2, ease: "power2.out" }
  );
}
