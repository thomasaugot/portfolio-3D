import { gsap } from "@/utils/animations/gsap-init";

export function initLoaderAnimations(
  containerRef: React.RefObject<HTMLElement>,
  progress?: number
) {
  if (!containerRef.current) return;

  const ctx = gsap.context(() => {
    // Only animate text on first load
    const textElement = containerRef.current?.querySelector(
      "[data-animate='loading-text']"
    );
    const percentageElement = containerRef.current?.querySelector(
      "[data-animate='percentage']"
    );

    if (textElement && gsap.getProperty(textElement, "opacity") === 0) {
      gsap.fromTo(
        textElement,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }

    if (percentageElement && gsap.getProperty(percentageElement, "opacity") === 0) {
      gsap.fromTo(
        percentageElement,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, containerRef.current);

  return () => ctx.revert();
}
