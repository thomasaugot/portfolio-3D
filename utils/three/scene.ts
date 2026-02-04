/**
 * Three.js scene builder utilities
 * Centralizes scene, camera, and renderer creation logic
 */

import { THREE } from "@/lib/three";
import { isLowPerformanceDevice, getMaxPixelRatio } from "./helpers";
import { perfMonitor } from "@/utils/performance-monitor";
import { THEME_COLORS } from "@/utils/colors";

export interface SceneConfig {
  isMobile: boolean;
  isTabletPortrait?: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLight?: boolean;
}

/**
 * Options for scene creation
 */
export interface SceneOptions {
  fov?: number;
  near?: number;
  far?: number;
  cameraPosition?: { x: number; y: number; z: number };
  cameraLookAt?: { x: number; y: number; z: number };
  enableAntialiasing?: boolean;
  clearColor?: number;
  clearAlpha?: number;
}

/**
 * Return type for createThreeScene
 */
export interface SceneResult {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

/**
 * Create a standardized Three.js scene with camera and renderer
 *
 * @param container - DOM element to attach renderer to
 * @param config - Scene configuration (viewport, theme)
 * @param options - Optional scene customization
 * @returns Scene, camera, and renderer
 *
 * @example
 * const { scene, camera, renderer } = createThreeScene(container, config, {
 *   fov: 60,
 *   cameraPosition: { x: 0, y: 30, z: 800 }
 * });
 */
export function createThreeScene(
  container: HTMLElement,
  config: SceneConfig,
  options: SceneOptions = {}
): SceneResult {
  const measure = perfMonitor.startMeasure('createScene');

  // Create scene
  const scene = new THREE.Scene();

  // Create camera with responsive FOV
  const fov = options.fov ?? (config.isMobile ? 75 : 60);
  const camera = new THREE.PerspectiveCamera(
    fov,
    container.clientWidth / container.clientHeight,
    options.near ?? 0.1,
    options.far ?? 5000
  );

  // Set camera position
  const camPos = options.cameraPosition ?? { x: 0, y: 0, z: 800 };
  camera.position.set(camPos.x, camPos.y, camPos.z);

  // Set camera look-at
  const lookAt = options.cameraLookAt ?? { x: 0, y: 0, z: 0 };
  camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

  // Create renderer with performance optimizations
  const lowPerf = isLowPerformanceDevice();
  const useAntialiasing = options.enableAntialiasing ?? (!config.isMobile && !lowPerf);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: useAntialiasing,
    powerPreference: "high-performance",
  });

  renderer.setSize(container.clientWidth, container.clientHeight);

  // Set pixel ratio with device-appropriate cap
  const maxPixelRatio = getMaxPixelRatio(config.isMobile);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

  // Set clear color
  renderer.setClearColor(
    options.clearColor ?? 0x000000,
    options.clearAlpha ?? 0
  );

  // Append to container
  container.appendChild(renderer.domElement);

  measure();

  return { scene, camera, renderer };
}

/**
 * Create a resize handler for responsive scenes
 * Returns a cleanup function to remove the event listener
 *
 * @param container - Container element
 * @param camera - Three.js camera
 * @param renderer - Three.js renderer
 * @param config - Scene configuration (for mobile detection)
 * @returns Cleanup function
 *
 * @example
 * const cleanup = createResizeHandler(container, camera, renderer, config);
 * // Later: cleanup();
 */
export function createResizeHandler(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  config: SceneConfig
): () => void {
  const handleResize = () => {
    // Update camera aspect
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Update pixel ratio (may change on window drag between screens)
    const maxPixelRatio = getMaxPixelRatio(config.isMobile);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}
/**
 * Hexagonal floor generator for Three.js scenes
 * Creates animated hexagon grid floor - reduces ~840 lines of duplicate code
 */

/**
 * Options for hexagon floor customization
 */
export interface HexFloorOptions {
  hexSize?: number;
  radius?: number;
  position?: { x: number; y: number; z: number };
  colors?: {
    primary: number;
    secondary: number;
  };
  opacityMultiplier?: number;
}

/**
 * Create a hexagonal floor grid
 * Generates a hex grid with gradient colors and distance-based opacity
 *
 * @param config - Scene configuration
 * @param options - Customization options
 * @returns THREE.Group containing the hex floor
 *
 * @example
 * const hexFloor = createHexFloor(config, {
 *   position: { x: 0, y: -200, z: 0 },
 *   radius: 9
 * });
 * scene.add(hexFloor);
 */
export function createHexFloor(
  config: SceneConfig,
  options: HexFloorOptions = {}
): THREE.Group {
  const measure = perfMonitor.startMeasure('createHexFloor');

  const group = new THREE.Group();

  // Responsive sizing
  const hexSize = options.hexSize ?? (config.isMobile ? 60 : 80);
  const radius = options.radius ?? (config.isMobile ? 6 : 9);

  // Colors
  const primaryColor = options.colors?.primary ?? THEME_COLORS.primary.hex;
  const secondaryColor = options.colors?.secondary ?? THEME_COLORS.secondary.hex;

  // Create hexagons in a hexagonal grid pattern
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;

      // Skip hexagons outside the radius
      if (
        Math.abs(q) > radius ||
        Math.abs(r) > radius ||
        Math.abs(s) > radius
      ) {
        continue;
      }

      // Create hexagon vertices
      const points = [];
      for (let i = 0; i <= 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * hexSize,
            0,
            Math.sin(angle) * hexSize
          )
        );
      }

      // Create geometry and calculate visual properties
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const distance = Math.sqrt(q * q + r * r + s * s);
      const opacity = Math.max(0.1, 1 - distance / (radius * 1.5));
      const gradientFactor =
        (Math.sin(q * 0.5) + Math.cos(r * 0.5)) * 0.5 + 0.5;

      // Interpolate between primary and secondary colors
      const color = new THREE.Color().lerpColors(
        new THREE.Color(primaryColor),
        new THREE.Color(secondaryColor),
        gradientFactor
      );

      // Create material with theme-aware opacity
      const baseOpacity = opacity * 0.4;
      const finalOpacity = baseOpacity * (options.opacityMultiplier ?? 1);

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: finalOpacity,
        linewidth: 2,
      });

      // Create hex line
      const hex = new THREE.Line(geometry, material);

      // Calculate position using hexagonal coordinate system
      const x = hexSize * 1.5 * q;
      const z = hexSize * Math.sqrt(3) * (r + q / 2);

      // Set position (default to y: -200 for desktop, -150 for mobile)
      const defaultY = config.isMobile ? -150 : -200;
      const position = options.position ?? { x: 0, y: defaultY, z: 0 };
      hex.position.set(
        x + position.x,
        position.y,
        z + position.z
      );

      // Store animation properties for later use
      (hex as any).baseOpacity = finalOpacity;
      (hex as any).pulseOffset = distance * 0.2;
      (hex as any).gradientFactor = gradientFactor;
      (hex as any).hexDistance = distance;

      group.add(hex);
    }
  }

  measure();
  return group;
}

/**
 * Animate hex floor with pulsing effect
 * Call this in your animation loop
 *
 * @param hexFloor - Hex floor group from createHexFloor
 * @param time - Current animation time
 * @param intensity - Pulse intensity (0-1)
 *
 * @example
 * const animate = () => {
 *   time += 0.01;
 *   animateHexFloor(hexFloor, time, 0.3);
 *   renderer.render(scene, camera);
 *   requestAnimationFrame(animate);
 * };
 */
export function animateHexFloor(
  hexFloor: THREE.Group,
  time: number,
  intensity: number = 0.3
): void {
  hexFloor.children.forEach((hex: any) => {
    if (hex.material && hex.baseOpacity !== undefined) {
      const pulse = Math.sin(time + hex.pulseOffset) * intensity;
      hex.material.opacity = hex.baseOpacity * (1 + pulse);
    }
  });
}

/**
 * Add rotation animation to hex floor
 * Call this in your animation loop
 *
 * @param hexFloor - Hex floor group
 * @param time - Current animation time
 * @param speed - Rotation speed
 *
 * @example
 * const animate = () => {
 *   time += 0.01;
 *   rotateHexFloor(hexFloor, time, 0.3);
 * };
 */
export function rotateHexFloor(
  hexFloor: THREE.Group,
  time: number,
  speed: number = 0.3
): void {
  hexFloor.rotation.y = Math.sin(time * speed) * 0.05;
}
/**
 * Lighting presets for Three.js scenes
 * Standardized lighting setups for consistent visual quality
 */

/**
 * Lighting setup options
 */
export interface LightingOptions {
  ambientIntensity?: number;
  directionalIntensity?: number;
  fillLightIntensity?: number;
  enableFillLight?: boolean;
  directionalPosition?: { x: number; y: number; z: number };
  fillLightPosition?: { x: number; y: number; z: number };
}

/**
 * Setup standard scene lighting
 * Creates ambient + directional light(s) based on theme
 *
 * @param scene - Three.js scene
 * @param isLight - Whether light theme is active
 * @param sceneType - Type of scene (for performance measurement)
 * @param options - Optional lighting customization
 *
 * @example
 * setupStandardLighting(scene, config.isLight, 'hero');
 */
export function setupStandardLighting(
  scene: THREE.Scene,
  isLight: boolean,
  sceneType: string = 'scene',
  options: LightingOptions = {}
): void {
  const measure = perfMonitor.startMeasure(`${sceneType}:setupLighting`);

  // Ambient light (fills the entire scene)
  const ambientIntensity = options.ambientIntensity ?? (isLight ? 1.2 : 0.9);
  const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
  scene.add(ambientLight);

  // Main directional light
  const directionalIntensity = options.directionalIntensity ?? (isLight ? 0.8 : 0.6);
  const dirLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);

  const dirPos = options.directionalPosition ?? { x: 200, y: 500, z: 300 };
  dirLight.position.set(dirPos.x, dirPos.y, dirPos.z);
  scene.add(dirLight);

  // Optional fill light for light theme (reduces harsh shadows)
  const enableFillLight = options.enableFillLight ?? isLight;
  if (enableFillLight) {
    const fillIntensity = options.fillLightIntensity ?? 0.3;
    const fillLight = new THREE.DirectionalLight(0xffffff, fillIntensity);

    const fillPos = options.fillLightPosition ?? { x: -200, y: 300, z: -300 };
    fillLight.position.set(fillPos.x, fillPos.y, fillPos.z);
    scene.add(fillLight);
  }

  measure();
}

/**
 * Setup dramatic lighting for hero/showcase scenes
 * More intense lighting with stronger directional component
 *
 * @param scene - Three.js scene
 * @param isLight - Whether light theme is active
 */
export function setupDramaticLighting(
  scene: THREE.Scene,
  isLight: boolean
): void {
  const measure = perfMonitor.startMeasure('setupDramaticLighting');

  // Lower ambient for more contrast
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.8 : 0.5);
  scene.add(ambientLight);

  // Strong key light
  const keyLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.2 : 1.0);
  keyLight.position.set(300, 600, 400);
  scene.add(keyLight);

  // Colored rim light for visual interest
  const rimLight = new THREE.DirectionalLight(0x02bccc, 0.4);
  rimLight.position.set(-300, 200, -400);
  scene.add(rimLight);

  if (isLight) {
    // Fill light for light theme
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-100, 400, 200);
    scene.add(fillLight);
  }

  measure();
}

/**
 * Setup subtle lighting for background/ambient scenes
 * Minimal lighting for performance-conscious scenes
 *
 * @param scene - Three.js scene
 * @param isLight - Whether light theme is active
 */
export function setupSubtleLighting(
  scene: THREE.Scene,
  isLight: boolean
): void {
  const measure = perfMonitor.startMeasure('setupSubtleLighting');

  // Primarily ambient lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.4 : 1.0);
  scene.add(ambientLight);

  // Single subtle directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, isLight ? 0.4 : 0.3);
  dirLight.position.set(100, 300, 200);
  scene.add(dirLight);

  measure();
}

/**
 * Setup product/model showcase lighting
 * Three-point lighting for optimal model presentation
 *
 * @param scene - Three.js scene
 * @param isLight - Whether light theme is active
 */
export function setupShowcaseLighting(
  scene: THREE.Scene,
  isLight: boolean
): void {
  const measure = perfMonitor.startMeasure('setupShowcaseLighting');

  // Ambient base
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.6 : 0.4);
  scene.add(ambientLight);

  // Key light (main light source)
  const keyLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.0 : 0.8);
  keyLight.position.set(400, 500, 300);
  scene.add(keyLight);

  // Fill light (softens shadows)
  const fillLight = new THREE.DirectionalLight(0xffffff, isLight ? 0.5 : 0.4);
  fillLight.position.set(-400, 300, 200);
  scene.add(fillLight);

  // Back/rim light (creates edge definition)
  const rimLight = new THREE.DirectionalLight(0xccff02, 0.3);
  rimLight.position.set(0, 400, -500);
  scene.add(rimLight);

  measure();
}

/**
 * Get recommended lighting setup based on scene type
 * Helper function to quickly get appropriate lighting
 *
 * @param sceneType - Type of scene
 * @returns Lighting setup function
 */
export function getLightingPreset(
  sceneType: 'standard' | 'dramatic' | 'subtle' | 'showcase' = 'standard'
): (scene: THREE.Scene, isLight: boolean) => void {
  switch (sceneType) {
    case 'dramatic':
      return setupDramaticLighting;
    case 'subtle':
      return setupSubtleLighting;
    case 'showcase':
      return setupShowcaseLighting;
    case 'standard':
    default:
      return (scene, isLight) => setupStandardLighting(scene, isLight);
  }
}
