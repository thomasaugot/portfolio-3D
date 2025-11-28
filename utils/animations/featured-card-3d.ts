export function initFeaturedCard3D() {
  const featuredCard = document.querySelector("[data-featured-card]") as HTMLElement;
  const cardInner = document.querySelector("[data-featured-card-inner]") as HTMLElement;
  const featuredGlow = document.querySelector("[data-featured-glow]") as HTMLElement;

  if (!featuredCard || !cardInner) return { kill: () => {} };

  let rafId: number | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = featuredCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8;

    // Smooth animation with RAF
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      cardInner.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    // Update glow position
    if (featuredGlow) {
      const mouseXPercent = (x / rect.width) * 100;
      const mouseYPercent = (y / rect.height) * 100;
      featuredGlow.style.setProperty('--mouse-x', `${mouseXPercent}%`);
      featuredGlow.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    }
  };

  const handleMouseLeave = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      cardInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  };

  featuredCard.addEventListener("mousemove", handleMouseMove);
  featuredCard.addEventListener("mouseleave", handleMouseLeave);

  return {
    kill: () => {
      if (rafId) cancelAnimationFrame(rafId);
      featuredCard.removeEventListener("mousemove", handleMouseMove);
      featuredCard.removeEventListener("mouseleave", handleMouseLeave);
    },
  };
}
