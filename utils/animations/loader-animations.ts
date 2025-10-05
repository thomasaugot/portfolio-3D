import { gsap } from "@/lib/animations";

let previousProgress = 0;

export function initLoaderAnimations(
  containerRef: React.RefObject<HTMLElement>,
  progress?: number
) {
  if (!containerRef.current) return;

  const ctx = gsap.context(() => {
    const textElement = containerRef.current?.querySelector(
      "[data-animate='loading-text']"
    );
    const percentageElement = containerRef.current?.querySelector(
      "[data-animate='percentage']"
    );
    const progressBarElement = containerRef.current?.querySelector(
      "[data-animate='progress-bar']"
    ) as HTMLElement;

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

    if (progressBarElement && typeof progress === 'number' && progress > previousProgress) {
      gsap.fromTo(progressBarElement, 
        { width: `${previousProgress}%` },
        {
          width: `${progress}%`,
          duration: 0.5,
          ease: "power2.out",
        }
      );

      if (percentageElement) {
        const currentProgress = { value: previousProgress };
        gsap.to(currentProgress, {
          value: progress,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => {
            percentageElement.textContent = `${Math.round(currentProgress.value)}%`;
          }
        });
      }
      
      previousProgress = progress;
    }
  }, containerRef.current);

  return () => ctx.revert();
}