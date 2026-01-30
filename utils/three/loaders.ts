/**
 * Texture loading utilities for Three.js
 * Centralizes texture loading logic with caching and error handling
 */

import { THREE } from "@/lib/three";
import { perfMonitor } from "@/utils/performance-monitor";
import type { SceneConfig } from "./scene";

/**
 * Texture loading options
 */
export interface TextureLoadOptions {
  flipY?: boolean;
  wrapS?: typeof THREE.ClampToEdgeWrapping | typeof THREE.RepeatWrapping | typeof THREE.MirroredRepeatWrapping;
  wrapT?: typeof THREE.ClampToEdgeWrapping | typeof THREE.RepeatWrapping | typeof THREE.MirroredRepeatWrapping;
  minFilter?: typeof THREE.LinearFilter | typeof THREE.NearestFilter;
  magFilter?: typeof THREE.LinearFilter | typeof THREE.NearestFilter;
  generateMipmaps?: boolean;
  colorSpace?: typeof THREE.SRGBColorSpace | typeof THREE.LinearSRGBColorSpace;
  anisotropy?: number | 'auto';
}

/**
 * Load a texture with standardized settings
 *
 * @param renderer - Three.js renderer (needed for max anisotropy)
 * @param texturePath - Path to texture file
 * @param config - Scene configuration (for responsive anisotropy)
 * @param options - Texture loading options
 * @returns Loaded texture or null on error
 *
 * @example
 * const texture = await loadTexture(renderer, '/assets/images/screen.png', config);
 * if (texture) {
 *   material.map = texture;
 * }
 */
export async function loadTexture(
  renderer: THREE.WebGLRenderer,
  texturePath: string,
  config: SceneConfig,
  options: TextureLoadOptions = {}
): Promise<THREE.Texture | null> {
  const measure = perfMonitor.startMeasure('loadTexture');
  const textureLoader = new THREE.TextureLoader();

  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        texturePath,
        (tex) => {
          // Apply texture settings
          tex.flipY = options.flipY ?? false;
          tex.wrapS = options.wrapS ?? THREE.ClampToEdgeWrapping;
          tex.wrapT = options.wrapT ?? THREE.ClampToEdgeWrapping;
          tex.minFilter = options.minFilter ?? THREE.LinearFilter;
          tex.magFilter = options.magFilter ?? THREE.LinearFilter;
          tex.generateMipmaps = options.generateMipmaps ?? false;
          tex.colorSpace = options.colorSpace ?? THREE.SRGBColorSpace;

          // Set anisotropy based on device
          if (options.anisotropy === 'auto') {
            tex.anisotropy = config.isDesktop
              ? renderer.capabilities.getMaxAnisotropy()
              : 1;
          } else if (options.anisotropy !== undefined) {
            tex.anisotropy = options.anisotropy;
          } else {
            // Default: desktop gets max, mobile gets 1
            tex.anisotropy = config.isDesktop
              ? renderer.capabilities.getMaxAnisotropy()
              : 1;
          }

          resolve(tex);
        },
        undefined,
        reject
      );
    });

    measure();
    return texture;
  } catch (error) {
    console.warn(`Could not load texture: ${texturePath}`, error);
    measure();
    return null;
  }
}

/**
 * Load multiple textures in parallel
 *
 * @param renderer - Three.js renderer
 * @param texturePaths - Array of texture paths
 * @param config - Scene configuration
 * @param options - Texture loading options
 * @returns Array of loaded textures (null for failed loads)
 */
export async function loadTextures(
  renderer: THREE.WebGLRenderer,
  texturePaths: string[],
  config: SceneConfig,
  options: TextureLoadOptions = {}
): Promise<(THREE.Texture | null)[]> {
  const measure = perfMonitor.startMeasure('loadTextures');

  const promises = texturePaths.map((path) =>
    loadTexture(renderer, path, config, options)
  );

  const textures = await Promise.all(promises);

  measure();
  return textures;
}

/**
 * Create a canvas texture programmatically
 * Useful for dynamically generated textures
 *
 * @param width - Canvas width
 * @param height - Canvas height
 * @param drawFn - Function to draw on canvas context
 * @returns THREE.CanvasTexture
 *
 * @example
 * const texture = createCanvasTexture(512, 512, (ctx) => {
 *   ctx.fillStyle = '#02bccc';
 *   ctx.fillRect(0, 0, 512, 512);
 * });
 */
export function createCanvasTexture(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D) => void
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    drawFn(ctx);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
}
/**
 * GLTF model loading utilities
 * Centralizes model loading with caching support
 */

import { loadCachedGLTF } from "@/utils/model-cache";

/**
 * Model loading options
 */
export interface ModelLoadOptions {
  scale?: number | { x: number; y: number; z: number };
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  castShadow?: boolean;
  receiveShadow?: boolean;
}

/**
 * Load a GLTF model with caching
 * Uses the existing model-cache utility for performance
 *
 * @param modelPath - Path to GLTF/GLB file
 * @param options - Model transformation options
 * @returns Promise resolving to model group or null on error
 *
 * @example
 * const model = await loadGLTFModel('/assets/models/laptop.glb', {
 *   scale: 50,
 *   position: { x: 0, y: 0, z: 0 }
 * });
 */
export async function loadGLTFModel(
  modelPath: string,
  options: ModelLoadOptions = {}
): Promise<THREE.Group | null> {
  const measure = perfMonitor.startMeasure('loadGLTFModel');

  try {
    // Dynamically import GLTFLoader
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    const loader = new GLTFLoader();

    // Load model with caching
    const gltf = await loadCachedGLTF(loader, modelPath);
    const model = gltf.scene;

    // Apply scale
    if (options.scale !== undefined) {
      if (typeof options.scale === 'number') {
        model.scale.set(options.scale, options.scale, options.scale);
      } else {
        model.scale.set(options.scale.x, options.scale.y, options.scale.z);
      }
    }

    // Apply position
    if (options.position) {
      model.position.set(options.position.x, options.position.y, options.position.z);
    }

    // Apply rotation
    if (options.rotation) {
      model.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
    }

    // Apply shadow settings
    if (options.castShadow || options.receiveShadow) {
      model.traverse((child: any) => {
        if (child.isMesh) {
          if (options.castShadow) child.castShadow = true;
          if (options.receiveShadow) child.receiveShadow = true;
        }
      });
    }

    measure();
    return model;
  } catch (error) {
    console.error(`Failed to load model: ${modelPath}`, error);
    measure();
    return null;
  }
}

/**
 * Apply texture to specific mesh in model by name
 * Useful for applying screen textures to laptop models, etc.
 *
 * @param model - Loaded model group
 * @param meshName - Name of mesh to apply texture to
 * @param texture - THREE.Texture to apply
 * @param materialOptions - Additional material options
 *
 * @example
 * const texture = await loadTexture(renderer, '/screen.png', config);
 * applyTextureToMesh(model, 'Screen_Screen_0', texture, {
 *   transparent: false,
 *   toneMapped: false
 * });
 */
export function applyTextureToMesh(
  model: THREE.Group,
  meshName: string,
  texture: THREE.Texture,
  materialOptions: any = {}
): void {
  model.traverse((child: any) => {
    if (child.isMesh && child.name === meshName) {
      child.material = new THREE.MeshBasicMaterial({
        map: texture,
        ...materialOptions,
      });
    }
  });
}

/**
 * Update material for all meshes in model
 * Useful for theme-based material changes
 *
 * @param model - Loaded model group
 * @param updateFn - Function to update each mesh's material
 *
 * @example
 * updateModelMaterials(model, (mesh, child) => {
 *   if (child.name === 'SpecialMesh') {
 *     mesh.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
 *   }
 * });
 */
export function updateModelMaterials(
  model: THREE.Group,
  updateFn: (mesh: THREE.Mesh, child: any) => void
): void {
  model.traverse((child: any) => {
    if (child.isMesh) {
      updateFn(child, child);
    }
  });
}
