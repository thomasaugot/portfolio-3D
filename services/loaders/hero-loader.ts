// services/loaders/hero-loader.ts
export async function waitForHeroReady(): Promise<void> {
  if (typeof window === "undefined") return;

  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 200;
    const timeout = 15000; // Increased to 15 seconds
    const startTime = Date.now();

    const checkHero = () => {
      attempts++;

      const container = document.querySelector("[data-3d-container='hero']");

      if (container) {
        const canvas = container.querySelector("canvas");
        const heroScene = (window as any).__heroScene;
        
        if (canvas && heroScene) {
          const rect = canvas.getBoundingClientRect();
          
          if (rect.width > 0 && rect.height > 0) {
            console.log("✅ Hero 3D scene fully ready with canvas and scene object");
            
            setTimeout(() => {
              resolve();
            }, 500);
            return;
          }
        }
      }

      const elapsed = Date.now() - startTime;

      if (elapsed > timeout || attempts >= maxAttempts) {
        console.warn("⚠️ Hero scene timeout, proceeding anyway");
        resolve();
        return;
      }

      requestAnimationFrame(checkHero);
    };

    checkHero();
  });
}