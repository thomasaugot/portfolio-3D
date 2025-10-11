import { useEffect, useRef } from "react";

type SceneInitFunction = () =>
  | Promise<(() => void) | void>
  | (() => void)
  | void;

const sceneStates = new Map<string, boolean>();
const readyCallbacks = new Set<() => void>();

export function useThreeScene(
  initFunction: SceneInitFunction,
  sceneId: string
) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;

    const init = async () => {
      initializedRef.current = true;
      const result = await initFunction();
      if (typeof result === "function") {
        cleanupRef.current = result;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      sceneStates.set(sceneId, true);
      readyCallbacks.forEach(callback => callback());
    };

    init();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        initializedRef.current = false;
      }
      sceneStates.delete(sceneId);
    };
  }, [initFunction, sceneId]);

  return containerRef;
}

export function waitForScenes(sceneIds: string[]): Promise<void> {
  return new Promise((resolve) => {
    const checkReady = () => {
      const allReady = sceneIds.every(id => sceneStates.get(id) === true);
      if (allReady) {
        resolve();
      }
    };

    checkReady();

    if (sceneIds.every(id => sceneStates.get(id) === true)) {
      return;
    }

    const callback = () => checkReady();
    readyCallbacks.add(callback);

    setTimeout(() => {
      readyCallbacks.delete(callback);
      resolve();
    }, 10000);
  });
}