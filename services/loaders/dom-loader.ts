export async function waitForDOMPaint(): Promise<void> {
  if (typeof window === 'undefined') return;

  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    } else {
      window.addEventListener('load', () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });
    }
  });
}