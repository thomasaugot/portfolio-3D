// utils/animations/blob-cursor-animation.ts - SUPPORT CLICK
export function initBlobCursor(onBlobClick?: () => void) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isVisible = false;
  let rafId: number;

  const blobElement = document.querySelector('[data-blob-cursor]') as HTMLElement;
  
  if (!blobElement) {
    console.error('Blob cursor element not found');
    return;
  }

  if (onBlobClick) {
    blobElement.addEventListener('click', onBlobClick);
  }

  const handleMouseMove = (e: MouseEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 0.05;

    const inBoundsX = e.clientX > windowWidth * margin && e.clientX < windowWidth * (1 - margin);
    const inBoundsY = e.clientY > windowHeight * margin && e.clientY < windowHeight * (1 - margin);

    const shouldShow = inBoundsX && inBoundsY;
    
    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      blobElement.style.opacity = isVisible ? '1' : '0';
    }
  };

  const animate = () => {
    const ease = 0.15;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    blobElement.style.left = `${currentX}px`;
    blobElement.style.top = `${currentY}px`;

    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', handleMouseMove);
  rafId = requestAnimationFrame(animate);
}