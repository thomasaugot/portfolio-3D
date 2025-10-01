export async function loadThreeJS(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  await import('three');
  
  await new Promise(resolve => setTimeout(resolve, 100));
}