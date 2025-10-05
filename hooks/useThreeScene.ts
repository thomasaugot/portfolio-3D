import { useEffect, useRef } from "react";

type SceneInitFunction = () => Promise<(() => void) | void> | (() => void) | void;

let sceneInitialized = false;

export function useThreeScene(initFunction: SceneInitFunction) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneInitialized || !containerRef.current) return;

    const init = async () => {
      sceneInitialized = true;
      const result = await initFunction();
      if (typeof result === 'function') {
        cleanupRef.current = result;
      }
    };

    init();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        sceneInitialized = false;
      }
    };
  }, [initFunction]);

  return containerRef;
}