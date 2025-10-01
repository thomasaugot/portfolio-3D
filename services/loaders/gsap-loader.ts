import { initializeGSAP } from '@/utils/animations/gsap-init';

export async function loadGSAP(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  initializeGSAP();
  
  await new Promise(resolve => requestAnimationFrame(resolve));
}