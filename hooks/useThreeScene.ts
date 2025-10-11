import { useEffect, useRef } from "react";

type SceneInitFunction = () =>
  | Promise<(() => void) | void>
  | (() => void)
  | void;

export function useThreeScene(initFunction: SceneInitFunction) {
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
    };

    init();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        initializedRef.current = false;
      }
    };
  }, [initFunction]);

  return containerRef;
}
