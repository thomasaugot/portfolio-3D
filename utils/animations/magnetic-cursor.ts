import { gsap } from "@/lib/animations";

export function initMagneticCursor() {
  const magneticElements = document.querySelectorAll(
    "[data-magnetic]"
  ) as NodeListOf<HTMLElement>;

  if (magneticElements.length === 0) return { kill: () => {} };

  const handleMouseMove = (e: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 150;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      const moveX = deltaX * force * 0.4;
      const moveY = deltaY * force * 0.4;

      gsap.to(element, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (element: HTMLElement) => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const listeners: Array<{
    element: HTMLElement;
    moveHandler: (e: MouseEvent) => void;
    leaveHandler: () => void;
  }> = [];

  magneticElements.forEach((element) => {
    const moveHandler = (e: MouseEvent) => handleMouseMove(e, element);
    const leaveHandler = () => handleMouseLeave(element);

    window.addEventListener("mousemove", moveHandler);
    element.addEventListener("mouseleave", leaveHandler);

    listeners.push({ element, moveHandler, leaveHandler });
  });

  return {
    kill: () => {
      listeners.forEach(({ element, moveHandler, leaveHandler }) => {
        window.removeEventListener("mousemove", moveHandler);
        element.removeEventListener("mouseleave", leaveHandler);
      });
    },
  };
}
