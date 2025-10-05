import { gsap } from "@/lib/animations";

export const initThemeToggleIdle = (
  cubeRef: HTMLDivElement,
  containerRef: HTMLDivElement,
  theme: 'light' | 'dark'
) => {
  const TILT_X = -22;
  const Y_ANGLE = 15;
  const baseX = (theme === 'dark' ? 0 : -90) + TILT_X;

  const ctx = gsap.context(() => {
    gsap.set(cubeRef, {
      rotationY: Y_ANGLE,
      rotationX: baseX,
      transformStyle: 'preserve-3d',
    });

    gsap.to(containerRef, {
      y: -5,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    gsap.to(cubeRef, {
      rotationZ: 2,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, containerRef);

  return ctx;
};

export const snapThemeTogglePosition = (
  cubeRef: HTMLDivElement,
  theme: 'light' | 'dark'
) => {
  const TILT_X = -22;
  const Y_ANGLE = 15;
  const targetX = (theme === 'dark' ? 0 : -90) + TILT_X;
  
  gsap.set(cubeRef, { 
    rotationX: targetX, 
    rotationY: Y_ANGLE 
  });
};

export const animateThemeToggleFlip = (
  cubeRef: HTMLDivElement,
  currentTheme: 'light' | 'dark',
  onComplete: () => void
) => {
  const TILT_X = -22;
  const Y_ANGLE = 15;
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  const baseTargetX = nextTheme === 'dark' ? 0 : -90;

  const goLongWay = Math.random() > 0.6;
  let finalTarget = baseTargetX;
  if (goLongWay) finalTarget = nextTheme === 'dark' ? 360 : -450;

  gsap.to(cubeRef, {
    rotationX: finalTarget + TILT_X,
    rotationY: Y_ANGLE,
    duration: goLongWay ? 0.9 : 0.6,
    ease: 'back.inOut(1.2)',
    onComplete: () => {
      gsap.set(cubeRef, {
        rotationX: baseTargetX + TILT_X,
        rotationY: Y_ANGLE,
      });
      onComplete();
    },
  });
};