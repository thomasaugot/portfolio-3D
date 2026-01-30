/**
 * Animation loop utilities for Three.js
 * Standardizes animation loop creation and management
 */

import { THREE } from "@/lib/three";
import { perfMonitor } from "@/utils/performance-monitor";

/**
 * Animation callback function type
 * @param time - Current animation time
 * @param frameCounter - Total frames rendered
 * @param deltaTime - Time since last frame
 */
export type AnimationCallback = (
  time: number,
  frameCounter: number,
  deltaTime: number
) => void;

/**
 * Animation loop options
 */
export interface AnimationLoopOptions {
  skipHiddenTab?: boolean;
  measurePerformance?: boolean;
  measureInterval?: number; // Measure every N frames
  timeStep?: number; // Time increment per frame
  maxDeltaTime?: number; // Cap delta time to prevent large jumps
}

/**
 * Create a standardized animation loop
 * Handles requestAnimationFrame, timing, and performance monitoring
 *
 * @param renderer - Three.js renderer
 * @param scene - Three.js scene
 * @param camera - Three.js camera
 * @param callback - Function to call each frame with animations
 * @param options - Animation loop options
 * @returns Cleanup function to stop the animation loop
 *
 * @example
 * const cleanup = createAnimationLoop(renderer, scene, camera, (time, frame) => {
 *   hexFloor.rotation.y = Math.sin(time * 0.3) * 0.05;
 *   model.position.y = Math.sin(time) * 10;
 * });
 *
 * // Later: cleanup();
 */
export function createAnimationLoop(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  callback: AnimationCallback,
  options: AnimationLoopOptions = {}
): () => void {
  const {
    skipHiddenTab = true,
    measurePerformance = false,
    measureInterval = 60,
    timeStep = 0.01,
    maxDeltaTime = 0.1,
  } = options;

  let animationId: number;
  let time = 0;
  let frameCounter = 0;
  let lastFrameTime = performance.now();

  const animate = () => {
    // Skip rendering when tab is hidden (saves CPU/GPU)
    if (skipHiddenTab && document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    // Performance measurement (optional, reduced frequency)
    const shouldMeasure =
      measurePerformance && frameCounter % measureInterval === 0;
    const animateMeasure = shouldMeasure
      ? perfMonitor.startMeasure("animate")
      : null;

    // Update FPS counter
    perfMonitor.updateFPS();

    // Calculate delta time
    const currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
    deltaTime = Math.min(deltaTime, maxDeltaTime); // Cap to prevent huge jumps
    lastFrameTime = currentTime;

    // Increment time
    time += timeStep;

    // Call user animation callback
    callback(time, frameCounter, deltaTime);

    // Render scene
    renderer.render(scene, camera);

    // Increment frame counter
    frameCounter++;

    // Complete measurement
    if (animateMeasure) animateMeasure();

    // Continue loop
    animationId = requestAnimationFrame(animate);
  };

  // Start animation loop
  animate();

  // Return cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

/**
 * Create a simple animation loop without scene rendering
 * Useful for custom render pipelines or non-Three.js animations
 *
 * @param callback - Function to call each frame
 * @param options - Animation loop options
 * @returns Cleanup function
 */
export function createSimpleAnimationLoop(
  callback: AnimationCallback,
  options: AnimationLoopOptions = {}
): () => void {
  const { skipHiddenTab = true, timeStep = 0.01, maxDeltaTime = 0.1 } = options;

  let animationId: number;
  let time = 0;
  let frameCounter = 0;
  let lastFrameTime = performance.now();

  const animate = () => {
    if (skipHiddenTab && document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 1000;
    deltaTime = Math.min(deltaTime, maxDeltaTime);
    lastFrameTime = currentTime;

    time += timeStep;

    callback(time, frameCounter, deltaTime);

    frameCounter++;
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}
/**
 * Three.js cleanup utilities
 * Proper disposal of resources to prevent memory leaks
 */

/**
 * Dispose a Three.js scene and all its resources
 * Properly cleans up geometries, materials, and textures
 *
 * @param scene - Scene to dispose
 * @param renderer - Renderer to dispose
 * @param container - Container to remove renderer from
 *
 * @example
 * return () => {
 *   disposeScene(scene, renderer, container);
 * };
 */
export function disposeScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  container: HTMLElement
): void {
  // Traverse scene and dispose all geometries and materials
  scene.traverse((child: any) => {
    // Dispose geometry
    if (child.geometry) {
      child.geometry.dispose();
    }

    // Dispose material(s)
    if (child.material) {
      if (Array.isArray(child.material)) {
        // Handle multi-material meshes
        child.material.forEach((material: any) => {
          disposeMaterial(material);
        });
      } else {
        disposeMaterial(child.material);
      }
    }
  });

  // Remove renderer from DOM
  if (renderer.domElement.parentNode === container) {
    container.removeChild(renderer.domElement);
  }

  // Dispose renderer
  renderer.dispose();
}

/**
 * Dispose a single material and its textures
 * @param material - Material to dispose
 */
function disposeMaterial(material: any): void {
  // Dispose all texture maps
  const textureProps = [
    "map",
    "lightMap",
    "bumpMap",
    "normalMap",
    "specularMap",
    "envMap",
    "alphaMap",
    "aoMap",
    "displacementMap",
    "emissiveMap",
    "gradientMap",
    "metalnessMap",
    "roughnessMap",
  ];

  textureProps.forEach((prop) => {
    if (material[prop]) {
      material[prop].dispose();
    }
  });

  // Dispose material itself
  material.dispose();
}

/**
 * Dispose a texture
 * @param texture - Texture to dispose (can be null)
 */
export function disposeTexture(texture: THREE.Texture | null): void {
  if (texture) {
    texture.dispose();
  }
}

/**
 * Dispose multiple textures
 * @param textures - Array of textures to dispose
 */
export function disposeTextures(textures: (THREE.Texture | null)[]): void {
  textures.forEach((texture) => {
    if (texture) {
      texture.dispose();
    }
  });
}

/**
 * Dispose a model and all its resources
 * @param model - Model group to dispose
 */
export function disposeModel(model: THREE.Group | null): void {
  if (!model) return;

  model.traverse((child: any) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m: any) => disposeMaterial(m));
      } else {
        disposeMaterial(child.material);
      }
    }
  });
}

/**
 * Remove all children from a group
 * Useful for clearing a scene or group
 * @param group - Group to clear
 */
export function clearGroup(group: THREE.Group): void {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}

/**
 * Create a comprehensive cleanup function
 * Combines multiple cleanup operations into one
 *
 * @param cleanupFns - Array of cleanup functions to call
 * @returns Combined cleanup function
 *
 * @example
 * const cleanup = createCleanupFunction([
 *   stopAnimationLoop,
 *   () => disposeScene(scene, renderer, container),
 *   () => window.removeEventListener('resize', handleResize),
 * ]);
 *
 * // Later: cleanup();
 */
export function createCleanupFunction(
  cleanupFns: Array<() => void>
): () => void {
  return () => {
    cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    });
  };
}
