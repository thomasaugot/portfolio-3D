import { useEffect, useRef } from "react";
import { debug } from "@/utils/debug";

type SceneInitFunction = () =>
  | Promise<(() => void) | void | null>
  | (() => void)
  | void
  | null;

const sceneStates = new Map<string, boolean>();
const readyCallbacks = new Set<() => void>();
const progressCallbacks = new Set<(loaded: number, total: number) => void>();

let loadQueue: Array<{
  sceneId: string;
  initFunction: SceneInitFunction;
  registrationOrder: number;
}> = [];
let isProcessing = false;
let registrationCounter = 0;

// Load all queued scenes in parallel
async function processQueue() {
  if (isProcessing || loadQueue.length === 0) return;

  isProcessing = true;

  const itemsToLoad = [...loadQueue];
  loadQueue = [];

  const total = itemsToLoad.length;
  let loaded = 0;

  debug.log(`🎬 Loading ${total} scenes in parallel`);

  await Promise.all(
    itemsToLoad.map(async (item) => {
      try {
        debug.log(`🎬 Starting ${item.sceneId}`);
        await item.initFunction();

        sceneStates.set(item.sceneId, true);
        loaded++;
        debug.log(`✅ ${item.sceneId} ready (${loaded}/${total})`);

        progressCallbacks.forEach(cb => cb(loaded, total));
        readyCallbacks.forEach(cb => cb());
      } catch (error) {
        debug.error(`❌ Failed to load ${item.sceneId}:`, error);
        sceneStates.set(item.sceneId, true);
        loaded++;
        progressCallbacks.forEach(cb => cb(loaded, total));
        readyCallbacks.forEach(cb => cb());
      }
    })
  );

  isProcessing = false;
  if (loadQueue.length > 0) processQueue();
}

export function onSceneProgress(callback: (loaded: number, total: number) => void) {
  progressCallbacks.add(callback);
  return () => progressCallbacks.delete(callback);
}

export function useThreeScene(
  initFunction: SceneInitFunction,
  sceneId: string,
  skipRefCheck = false
) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const registrationOrderRef = useRef<number>(registrationCounter++);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!skipRefCheck && !containerRef.current) return;

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
  }, [initFunction, sceneId, skipRefCheck]);

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

// Export function to manually mark a scene as ready
// Useful for scenes that don't use the useThreeScene hook
export function markSceneReady(sceneId: string) {
  sceneStates.set(sceneId, true);
  debug.log(`✅ ${sceneId} scene marked as ready`);
  readyCallbacks.forEach(callback => callback());
}