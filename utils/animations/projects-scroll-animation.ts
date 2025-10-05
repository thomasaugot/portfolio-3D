import { gsap, ScrollTrigger } from "@/lib/animations";

let projectsScrollTrigger: ScrollTrigger | null = null;

export function initProjectsScrollAnimation() {
  const projectsSection = document.querySelector("[data-projects-section]");
  if (!projectsSection) return;

  const panels = gsap.utils.toArray('[data-project-panel]');
  if (panels.length === 0) return;

  projectsScrollTrigger = ScrollTrigger.create({
    trigger: projectsSection,
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalPanels = panels.length;
      
      panels.forEach((panel: any, index) => {
        const panelStart = index / totalPanels;
        const panelEnd = (index + 1) / totalPanels;
        const panelProgress = Math.max(0, Math.min(1, (progress - panelStart) / (panelEnd - panelStart)));
        
        const image = (panel as Element).querySelector('[data-project-image]');
        const content = (panel as Element).querySelector('[data-project-content]');
        
        gsap.set(panel, {
          yPercent: (1 - panelProgress) * 100,
          opacity: panelProgress,
          zIndex: index + 1
        });

        if (image) {
          gsap.set(image, {
            rotationY: (1 - panelProgress) * -25,
            x: (1 - panelProgress) * -100,
            scale: 0.8 + (panelProgress * 0.2)
          });
        }

        if (content) {
          gsap.set(content, {
            rotationY: (1 - panelProgress) * 15,
            x: (1 - panelProgress) * 100,
            opacity: panelProgress
          });
        }
      });
    }
  });

  return () => {
    if (projectsScrollTrigger) {
      projectsScrollTrigger.kill();
      projectsScrollTrigger = null;
    }
  };
}