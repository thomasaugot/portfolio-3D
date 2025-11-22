export function initBlobCursor() {
  // Don't initialize blob cursor on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    // Hide blob cursor element on touch devices
    const blobElement = document.querySelector('[data-blob-cursor]') as HTMLElement;
    if (blobElement) {
      blobElement.style.display = 'none';
    }
    return () => {}; // Return empty cleanup function
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let targetOpacity = 0;
  let currentOpacity = 0;
  let rafId: number;
  let currentVisibleProject: number | null = null;

  const blobElement = document.querySelector('[data-blob-cursor]') as HTMLElement;

  if (!blobElement) {
    console.error('Blob cursor element not found');
    return;
  }

  // Get all project panels once
  const projectPanels = Array.from(document.querySelectorAll('[data-project-panel]'));
  const totalPanels = projectPanels.length;

  // Remove transitions - we'll handle opacity in the animation loop
  blobElement.style.transition = 'none';
  blobElement.style.opacity = '0';
  blobElement.style.pointerEvents = 'none'; // Start with none, only enable when visible

  // Handle blob click - dispatch custom event with current project
  const handleBlobClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (currentOpacity > 0.5 && currentVisibleProject !== null) {
      // Store click position globally for modal animation
      (window as any).__modalClickPosition = {
        x: e.clientX,
        y: e.clientY
      };

      // Dispatch custom event that portfolio page can listen to
      window.dispatchEvent(new CustomEvent('blobProjectClick', {
        detail: { projectIndex: currentVisibleProject }
      }));
    }
  };

  blobElement.addEventListener('click', handleBlobClick);

  const handleMouseMove = (e: MouseEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;

    // Check if we're over a project - including 3D model area
    let isOverProject = false;
    currentVisibleProject = null;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Only show in central 50% of viewport (25% from top/bottom, full width for 3D area)
    const centralTop = viewportHeight * 0.25;
    const centralBottom = viewportHeight * 0.75;

    // Check if mouse is in central zone
    const inCentralZone = e.clientY >= centralTop && e.clientY <= centralBottom;

    if (!inCentralZone) {
      targetOpacity = 0;
      currentVisibleProject = null;
      return;
    }

    // Check if modal is open - hide blob if modal is visible
    const portfolioScene = (window as any).__portfolioScene;
    if (portfolioScene && portfolioScene.modalOpen) {
      targetOpacity = 0;
      currentVisibleProject = null;
      return;
    }

    // Check if menu is visible - hide blob if menu is open
    const menuOverlay = document.querySelector('[data-animate="menu-overlay"]');
    const menuContainer = document.querySelector('[data-animate="menu-container"]');
    if (menuOverlay && menuContainer) {
      const overlayStyle = window.getComputedStyle(menuOverlay);
      const containerStyle = window.getComputedStyle(menuContainer);
      // Menu is open if overlay has pointer-events: auto
      if (overlayStyle.pointerEvents === 'auto' || containerStyle.pointerEvents === 'auto') {
        targetOpacity = 0;
        currentVisibleProject = null;
        return;
      }
    }

    // Check if hovering over CTA buttons or "View full case study" button
    const target = e.target as HTMLElement;
    const isOverButton = target.closest('button') || target.closest('a[href]');
    const isOverCTA = target.closest('[data-cta-buttons]') || target.closest('[data-project-button]');

    if (isOverButton || isOverCTA) {
      targetOpacity = 0;
      currentVisibleProject = null;
      return;
    }

    // First check the 3D container - this covers the entire viewport
    const container3D = document.querySelector('[data-3d-container="portfolio-hex"]');
    if (container3D) {
      const rect3D = container3D.getBoundingClientRect();

      // If we're in the 3D area, check if a project is visible
      if (
        e.clientX >= rect3D.left &&
        e.clientX <= rect3D.right &&
        e.clientY >= rect3D.top &&
        e.clientY <= rect3D.bottom
      ) {
        // Check if any project panel is visible (opacity > 0.1)
        for (let i = 0; i < totalPanels - 1; i++) { // -1 to exclude CTA
          const panel = projectPanels[i] as HTMLElement;
          const computedStyle = window.getComputedStyle(panel);

          if (parseFloat(computedStyle.opacity) > 0.1) {
            // A project is visible, so show the blob
            isOverProject = true;
            currentVisibleProject = i;
            break;
          }
        }
      }
    }

    // Check we're not on the header (if header is visible, hide blob)
    if (isOverProject) {
      const header = document.querySelector('[data-projects-header]');
      if (header) {
        const headerStyle = window.getComputedStyle(header as HTMLElement);
        if (parseFloat(headerStyle.opacity) > 0.5) {
          isOverProject = false;
          currentVisibleProject = null;
        }
      }
    }

    // Set target opacity based on hover state
    targetOpacity = isOverProject ? 1 : 0;
  };

  const animate = () => {
    const posEase = 0.15;
    const opacityEase = 0.2;

    // Smooth position
    currentX += (targetX - currentX) * posEase;
    currentY += (targetY - currentY) * posEase;

    // Smooth opacity
    currentOpacity += (targetOpacity - currentOpacity) * opacityEase;

    blobElement.style.left = `${currentX}px`;
    blobElement.style.top = `${currentY}px`;
    blobElement.style.opacity = String(currentOpacity);

    // Toggle pointer events based on visibility
    blobElement.style.pointerEvents = currentOpacity > 0.1 ? 'auto' : 'none';

    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', handleMouseMove);
  rafId = requestAnimationFrame(animate);

  // Cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    blobElement.removeEventListener('click', handleBlobClick);
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };
}