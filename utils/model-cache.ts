import { debug } from "./debug";

const DB_NAME = "portfolio-3d-cache";
const DB_VERSION = 1;
const STORE_NAME = "models";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedModel {
  url: string;
  data: ArrayBuffer;
  timestamp: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      debug.error("Failed to open IndexedDB:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "url" });
      }
    };
  });

  return dbPromise;
}

export async function getCachedModel(url: string): Promise<ArrayBuffer | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result as CachedModel | undefined;
        if (result && Date.now() - result.timestamp < CACHE_TTL) {
          debug.log(`[ModelCache] Cache hit for: ${url}`);
          resolve(result.data);
        } else {
          if (result) {
            debug.log(`[ModelCache] Cache expired for: ${url}`);
          }
          resolve(null);
        }
      };

      request.onerror = () => {
        debug.error(`[ModelCache] Error reading cache for: ${url}`);
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function setCachedModel(url: string, data: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        url,
        data,
        timestamp: Date.now(),
      });

      request.onsuccess = () => {
        debug.log(`[ModelCache] Cached model: ${url}`);
        resolve();
      };

      request.onerror = () => {
        debug.error(`[ModelCache] Error caching: ${url}`);
        reject(request.error);
      };
    });
  } catch (error) {
    debug.error(`[ModelCache] Failed to cache model:`, error);
  }
}

// Preload models into IndexedDB cache
export async function preloadModels(urls: string[]): Promise<void> {
  debug.log(`[ModelCache] Preloading ${urls.length} models...`);

  await Promise.all(
    urls.map(async (url) => {
      const cached = await getCachedModel(url);
      if (cached) {
        debug.log(`[ModelCache] Already cached: ${url}`);
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const data = await response.arrayBuffer();
        await setCachedModel(url, data);
      } catch (error) {
        debug.error(`[ModelCache] Failed to preload: ${url}`, error);
      }
    })
  );

  debug.log(`[ModelCache] Preloading complete`);
}

// Get all model URLs that should be preloaded
export function getModelURLs(): string[] {
  return [
    // Hero models
    "/assets/models/laptop-logo.glb",
    "/assets/models/code-3D.glb",
    // Project models
    "/assets/models/iphone-laptop-scene-1.glb",
    "/assets/models/iphone-laptop-scene-2.glb",
    "/assets/models/iphone-laptop-scene-3.glb",
  ];
}

// Load a GLB model with caching support
export async function loadCachedGLTF(
  loader: any,
  url: string
): Promise<any> {
  const cached = await getCachedModel(url);

  if (cached) {
    return new Promise((resolve, reject) => {
      loader.parse(
        cached,
        "",
        (gltf: any) => resolve(gltf),
        (error: any) => reject(error)
      );
    });
  }

  // Fetch and cache
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const data = xhr.response as ArrayBuffer;
        // Cache the model in the background
        setCachedModel(url, data.slice(0));

        loader.parse(
          data,
          "",
          (gltf: any) => resolve(gltf),
          (error: any) => reject(error)
        );
      } else {
        reject(new Error(`Failed to load ${url}: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error(`Network error loading ${url}`));
    xhr.send();
  });
}

// Clear expired cache entries
export async function cleanupCache(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const entry = cursor.value as CachedModel;
        if (Date.now() - entry.timestamp >= CACHE_TTL) {
          cursor.delete();
          debug.log(`[ModelCache] Removed expired: ${entry.url}`);
        }
        cursor.continue();
      }
    };
  } catch (error) {
    debug.error(`[ModelCache] Cleanup failed:`, error);
  }
}
