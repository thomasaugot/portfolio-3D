import { useEffect, useRef } from "react";

type SceneInitFunction = () =>
  | Promise<(() => void) | void>
  | (() => void)
  | void;

const sceneStates = new Map<string, boolean>();
const readyCallbacks = new Set<() => void>();

let loadQueue: Array<{
  sceneId: string;
  initFunction: SceneInitFunction;
  registrationOrder: number;
}> = [];
let isProcessing = false;
let registrationCounter = 0;

async function processQueue() {
  if (isProcessing || loadQueue.length === 0) return;
  
  isProcessing = true;
  
  loadQueue.sort((a, b) => a.registrationOrder - b.registrationOrder);
  
  const item = loadQueue.shift();
  if (!item) {
    isProcessing = false;
    return;
  }
  
  console.log(`🎬 Loading ${item.sceneId} (order ${item.registrationOrder})`);
  
  try {
    const result = await item.initFunction();
    sceneStates.set(item.sceneId, true);
    readyCallbacks.forEach(callback => callback());
    
    return result;
  } finally {
    const delay = item.registrationOrder === 0 ? 0 : 300;
    await new Promise(resolve => setTimeout(resolve, delay));
    isProcessing = false;
    processQueue();
  }
}

export function useThreeScene(
  initFunction: SceneInitFunction,
  sceneId: string
) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const registrationOrderRef = useRef<number>(registrationCounter++);

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;

    initializedRef.current = true;
    
    loadQueue.push({
      sceneId,
      initFunction: async () => {
        const result = await initFunction();
        if (typeof result === "function") {
          cleanupRef.current = result;
        }
        return result;
      },
      registrationOrder: registrationOrderRef.current
    });
    
    processQueue();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        initializedRef.current = false;
      }
      sceneStates.delete(sceneId);
      loadQueue = loadQueue.filter(item => item.sceneId !== sceneId);
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
    }, 15000);
  });
}