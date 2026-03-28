import { THREE } from "@/lib/three";
import { gsap } from "@/lib/gsap";
import { perfMonitor } from "@/utils/performance-monitor";
import { loadCachedGLTF } from "@/utils/model-cache";
import { motionDuration, prefersReducedMotion } from "@/utils/motion";

// Global reference to laptop for external animations
let laptopRef: THREE.Group | null = null;
let sceneRef: THREE.Scene | null = null;
let hexFloorRef: THREE.Group | null = null;
let hexFloorBaseRotation = 0; // Base rotation that GSAP animates
let isAnimatingOut = false;
let floatBlend = 0; // Ramps 0→1 after tornado ends, prevents Y jump
let hexFloorEntranceDone = false;
let laptopAnimationsInitialized = false;
let laptopThemeObserver: MutationObserver | null = null;

const isLightThemeActive = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.theme === "light";

const applyLaptopMaterialTheme = (model: THREE.Object3D) => {
  const isLightTheme = isLightThemeActive();
  const bodyColor = new THREE.Color(isLightTheme ? 0x686764 : 0x5a5a5a);
  const bodyEmissive = new THREE.Color(isLightTheme ? 0x232321 : 0x2a2a2a);
  const keyboardColor = new THREE.Color(0x3a3a3a);
  const keyboardEmissive = new THREE.Color(0x141414);

  model.traverse((child: any) => {
    if (!child.isMesh || !child.material) return;

    if (child.name === "Keyboard_Keyboard_0") {
      child.material.color = keyboardColor.clone();
      child.material.emissive = keyboardEmissive.clone();
      child.material.emissiveIntensity = 0.12;
      child.material.metalness = 0.25;
      child.material.roughness = 0.82;
      child.material.needsUpdate = true;
      return;
    }

    if (child.name === "Screen_Screen_0" || child.name === "Empty001") {
      return;
    }

    child.material.color = bodyColor.clone();
    child.material.emissive = bodyEmissive.clone();
    child.material.emissiveIntensity = isLightTheme ? 0.08 : 0.3;
    child.material.metalness = isLightTheme ? 0.56 : 0.7;
    child.material.roughness = isLightTheme ? 0.5 : 0.4;
    child.material.needsUpdate = true;
  });
};

const syncLaptopTheme = () => {
  if (!laptopRef) return;
  applyLaptopMaterialTheme(laptopRef);
};

const watchLaptopTheme = () => {
  if (typeof document === "undefined") return;

  laptopThemeObserver?.disconnect();
  laptopThemeObserver = new MutationObserver(() => {
    syncLaptopTheme();
  });

  laptopThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
};

/**
 * Initialize laptop animations - called at page level
 */
export function initLaptopAnimations(): void {
  if (laptopAnimationsInitialized) return;
  laptopAnimationsInitialized = true;
}

/**
 * Initialize hex floor animations - called at page level
 * Sets up event listeners for section transitions
 */
export function initHexFloorAnimations(): void {
  // Listen for section transition events
  window.addEventListener("sectionTransition", ((event: CustomEvent) => {
    const { direction } = event.detail || { direction: 1 };
    animateHexFloorRotation(direction);
  }) as EventListener);
}

/**
 * Animate the laptop out with a beautiful exit animation
 * - Laptop floats up while rotating elegantly
 * - Scales down and fades out
 * Returns a promise that resolves when animation completes
 */
export function animateLaptopOut(): Promise<void> {
  return new Promise((resolve) => {
    if (!laptopRef || !sceneRef) {
      resolve();
      return;
    }

    // Already invisible — skip the animation entirely to avoid blocking the morph
    if (laptopRef.scale.x <= 0.01 && laptopRef.scale.y <= 0.01) {
      resolve();
      return;
    }

    if (prefersReducedMotion()) {
      laptopRef.scale.set(0, 0, 0);
      resolve();
      return;
    }

    // Stop the floating animation so GSAP can take over
    isAnimatingOut = true;
    floatBlend = 0;

    const laptop = laptopRef;
    const startRotationY = laptop.rotation.y;

    // Tornado effect: spin rapidly while shrinking to nothing
    const tl = gsap.timeline({
      onComplete: () => {
        resolve();
      },
    });

    // Rapid spin - multiple full rotations (tornado vortex)
    tl.to(laptop.rotation, {
      y: startRotationY + Math.PI * 4,
      duration: motionDuration(0.9),
      ease: "power2.in",
    }, 0);

    // Shrink to nothing
    tl.to(laptop.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: motionDuration(0.8),
      ease: "power2.in",
    }, 0.1);

    // Fade out materials as it shrinks
    laptop.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat: any) => {
          mat.transparent = true;
          mat.needsUpdate = true;
          tl.to(mat, {
            opacity: 0,
            duration: motionDuration(0.6),
            ease: "power2.in",
            onUpdate: () => {
              mat.needsUpdate = true;
            },
          }, 0.3);
        });
      }
    });
  });
}

/**
 * Animate laptop back in with tornado effect (reverse of exit)
 * Spins rapidly while expanding from nothing
 */
export function animateLaptopIn(): void {
  if (!laptopRef) return;

  const laptop = laptopRef;
  const config = getViewportConfig();
  const baseY = config.isTabletPortrait ? 130 : config.isMobile ? 40 : config.isTablet ? 50 : 30;
  const targetRotationY = config.isTabletPortrait ? -0.3 : config.isMobile ? 0 : config.isTablet ? -0.1 : -0.15;
  const targetRotationX = config.isTabletPortrait ? 0.1 : 0;
  const posX = config.isTabletPortrait ? 200 : config.isMobile ? 0 : config.isTablet ? 300 : 420;
  const posZ = config.isTabletPortrait ? 50 : config.isMobile ? 50 : 80;

  if (prefersReducedMotion()) {
    laptop.position.set(posX, baseY, posZ);
    laptop.scale.set(1, 1, 1);
    laptop.rotation.set(targetRotationX, targetRotationY, 0);
    isAnimatingOut = false;
    return;
  }

  // Block floating animation during entrance
  isAnimatingOut = true;
  floatBlend = 0;

  // Reset materials first
  laptop.traverse((child: any) => {
    if (child.isMesh && child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat: any) => {
        mat.opacity = 1;
        mat.transparent = false;
        mat.needsUpdate = true;
      });
    }
  });

  // Set starting state: invisible, rotated back (4 full rotations)
  laptop.position.set(posX, baseY, posZ);
  laptop.scale.set(0.001, 0.001, 0.001);
  laptop.rotation.set(targetRotationX, targetRotationY - Math.PI * 4, 0);

  // Create timeline for coordinated animation
  const tl = gsap.timeline({
    onComplete: () => {
      isAnimatingOut = false;
    }
  });

  // Spin forward (4 rotations)
  tl.to(laptop.rotation, {
    x: targetRotationX,
    y: targetRotationY,
    duration: motionDuration(0.9),
    ease: "power2.out",
  }, 0);

  // Expand to full size (wrapper scale 1, model already has base scale)
  tl.to(laptop.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: motionDuration(0.9),
    ease: "back.out(1.7)",
  }, 0);
}

/**
 * Animate the hex floor with a platform rotation effect
 * Called when transitioning between sections
 * @param direction - 1 for forward (scrolling down), -1 for backward (scrolling up)
 */
export function animateHexFloorRotation(direction: number = 1): void {
  console.log("animateHexFloorRotation called, hexFloorRef:", !!hexFloorRef, "direction:", direction);

  if (!hexFloorRef) {
    console.warn("hexFloorRef is null, cannot animate");
    return;
  }

  if (prefersReducedMotion()) {
    return;
  }

  const rotationAmount = direction * Math.PI * 0.5; // 90 degree rotation
  const targetRotation = hexFloorBaseRotation + rotationAmount;

  console.log("Animating hex floor from", hexFloorBaseRotation, "to", targetRotation);

  gsap.to({ value: hexFloorBaseRotation }, {
    value: targetRotation,
    duration: motionDuration(0.8),
    ease: "power2.inOut",
    onUpdate: function() {
      hexFloorBaseRotation = this.targets()[0].value;
    },
    onComplete: () => {
      hexFloorBaseRotation = targetRotation;
      console.log("Hex floor rotation complete, new base:", hexFloorBaseRotation);
    }
  });
}

/**
 * Animate the hex floor entrance with a progressive ripple from center outward.
 * Hexagons are grouped into concentric rings and each ring fades + rises in
 * with a smooth stagger, creating a visible wave spreading across the floor.
 */
export function animateHexFloorEntrance(): void {
  if (!hexFloorRef) return;

  if (prefersReducedMotion()) {
    hexFloorRef.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const baseOpacity = (hex as any).baseOpacity || 0.1;
      material.opacity = baseOpacity;
      hex.position.y = (hex as any).baseY ?? hex.position.y;
    });
    hexFloorEntranceDone = true;
    return;
  }

  const children = hexFloorRef.children;

  // Sort by distance so we can stagger in order
  const sorted = Array.from(children).sort(
    (a, b) => ((a as any).hexDistance || 0) - ((b as any).hexDistance || 0)
  );

  const floorY = sorted[0]?.position.y ?? -180;

  // Single timeline drives the whole wave
  const tl = gsap.timeline({
    onComplete: () => {
      hexFloorEntranceDone = true;
    },
  });

  sorted.forEach((hex, i) => {
    const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
    const baseOpacity = (hex as any).baseOpacity || 0.1;

    // Each hex starts 8ms after the previous — smooth, progressive wave
    const offset = i * 0.008;

    // Fade in
    tl.fromTo(
      material,
      { opacity: 0 },
      { opacity: baseOpacity, duration: 0.5, ease: "power2.out" },
      offset
    );

    // Rise up slightly from below
    tl.fromTo(
      hex.position,
      { y: floorY - 40 },
      { y: floorY, duration: 0.6, ease: "power3.out" },
      offset
    );
  });
}

/**
 * Reset laptop to visible state instantly (fallback)
 */
export function resetLaptop(): void {
  console.log("resetLaptop called, laptopRef:", !!laptopRef);
  if (!laptopRef) {
    console.warn("resetLaptop: laptopRef is null!");
    return;
  }

  // Re-enable floating animation
  isAnimatingOut = false;

  const laptop = laptopRef;
  const config = getViewportConfig();
  const scale = config.isTabletPortrait ? 38 : config.isMobile ? 45 : 60;
  const baseY = config.isTabletPortrait ? 130 : config.isMobile ? 40 : config.isTablet ? 50 : 30;

  // Reset position
  if (config.isTabletPortrait) {
    laptop.position.set(200, baseY, 50);
    laptop.rotation.set(0.1, -0.3, 0);
  } else if (config.isMobile) {
    laptop.position.set(0, baseY, 50);
    laptop.rotation.set(0, 0, 0);
  } else if (config.isTablet) {
    laptop.position.set(300, baseY, 80);
    laptop.rotation.set(0, -0.1, 0);
  } else {
    laptop.position.set(420, baseY, 80);
    laptop.rotation.set(0, -0.15, 0);
  }

  // Reset scale
  laptop.scale.set(scale, scale, scale);

  // Reset material opacity
  laptop.traverse((child: any) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat: any) => {
        mat.opacity = 1;
        mat.transparent = false;
        mat.needsUpdate = true;
      });
    }
  });
}

interface SceneConfig {
  isMobile: boolean;
  isTabletPortrait: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const isLowPerformanceDevice = () => {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as any).connection;
  const memory = (performance as any).memory;

  return (
    (connection && connection.saveData) ||
    (memory && memory.jsHeapSizeLimit < 1073741824) ||
    navigator.hardwareConcurrency < 4
  );
};

const getViewportConfig = (): SceneConfig => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1920;
  const height = typeof window !== "undefined" ? window.innerHeight : 1080;
  const isPortrait = height > width;
  const isTabletSize = width >= 768 && width < 1024;

  return {
    // Portrait tablets use mobile layout (kept for backward compat)
    isMobile: width < 768 || (isTabletSize && isPortrait),
    // Portrait tablets specifically — overrides mobile for hero scene
    isTabletPortrait: isTabletSize && isPortrait,
    // Landscape tablets only
    isTablet: isTabletSize && !isPortrait,
    // Desktop or landscape tablets
    isDesktop: width >= 1024 || (isTabletSize && !isPortrait),
  };
};

const createScene = (container: HTMLElement, config: SceneConfig) => {
  const measure = perfMonitor.startMeasure("hero:createScene");

  const scene = new THREE.Scene();

  const fov = config.isTabletPortrait ? 55 : config.isMobile ? 65 : 50;
  const camera = new THREE.PerspectiveCamera(
    fov,
    container.clientWidth / container.clientHeight,
    0.1,
    5000
  );

  // Camera positioning per device type
  if (config.isTabletPortrait) {
    // Portrait tablet: camera shifted right to frame laptop in top-right quadrant
    camera.position.set(150, 140, 520);
    camera.lookAt(200, 30, 0);
  } else if (config.isMobile) {
    camera.position.set(0, 60, 450);
    camera.lookAt(0, 20, 0);
  } else {
    // Desktop / landscape tablet: laptop on the RIGHT side
    camera.position.set(120, 160, 600);
    camera.lookAt(220, 20, 0);
  }

  const lowPerf = isLowPerformanceDevice();
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: (!config.isMobile || config.isTabletPortrait) && !lowPerf,
    powerPreference: "high-performance",
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  const maxPixelRatio = (config.isMobile && !config.isTabletPortrait) ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  measure();
  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene) => {
  const measure = perfMonitor.startMeasure("hero:setupLighting");

  // Ambient for base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Soft overhead fill to lift the whole scene a bit without flattening it
  const overheadLight = new THREE.DirectionalLight(0xf5f1e8, 0.55);
  overheadLight.position.set(0, 520, 120);
  scene.add(overheadLight);

  // Key light from top-right (pure white)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(400, 400, 200);
  scene.add(keyLight);

  // Fill light from left
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-300, 200, 100);
  scene.add(fillLight);

  // Rim light for edge definition
  const rimLight = new THREE.DirectionalLight(0xfff5e6, 0.3);
  rimLight.position.set(100, 100, -400);
  scene.add(rimLight);

  // Spotlight on laptop
  const spotLight = new THREE.SpotLight(0xffffff, 2.0, 1000, Math.PI / 5, 0.3);
  spotLight.position.set(350, 350, 400);
  spotLight.target.position.set(280, 30, 100);
  scene.add(spotLight);
  scene.add(spotLight.target);

  measure();
};

const createHexFloor = (config: SceneConfig) => {
  const measure = perfMonitor.startMeasure("hero:createHexFloor");

  const group = new THREE.Group();
  const hexSize = (config.isMobile && !config.isTabletPortrait) ? 55 : 75;
  const radius = (config.isMobile && !config.isTabletPortrait) ? 8 : 14;

  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;

      if (
        Math.abs(q) > radius ||
        Math.abs(r) > radius ||
        Math.abs(s) > radius
      ) {
        continue;
      }

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

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const distance = Math.sqrt(q * q + r * r + s * s);
      const opacity = Math.max(0.08, 1 - distance / (radius * 1.1));
      const gradientFactor =
        (Math.sin(q * 0.5) + Math.cos(r * 0.5)) * 0.5 + 0.5;

      const color = new THREE.Color().lerpColors(
        new THREE.Color(0x0a8a70),
        new THREE.Color(0x8a7a00),
        gradientFactor
      );

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0, // Start invisible for entrance animation
        linewidth: 2,
      });

      const hex = new THREE.Line(geometry, material);
      const x = hexSize * 1.5 * q;
      const z = hexSize * Math.sqrt(3) * (r + q / 2);

      hex.position.set(x, (config.isMobile && !config.isTabletPortrait) ? -130 : -180, z);

      (hex as any).baseOpacity = opacity * 0.6;
      (hex as any).pulseOffset = distance * 0.12;
      (hex as any).gradientFactor = gradientFactor;
      (hex as any).hexDistance = distance;

      group.add(hex);
    }
  }

  measure();
  return group;
};

const loadTexture = async (
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture | null> => {
  const measure = perfMonitor.startMeasure("hero:loadTexture");
  const textureLoader = new THREE.TextureLoader();

  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        "/assets/images/vscode-texture.png",
        (texture) => {
          texture.flipY = true;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          const config = getViewportConfig();
          texture.anisotropy = config.isDesktop
            ? renderer.capabilities.getMaxAnisotropy()
            : 1;
          resolve(texture);
        },
        undefined,
        reject
      );
    });
    measure();
    return texture;
  } catch (error) {
    console.warn("Could not load VS Code texture");
    measure();
    return null;
  }
};

const loadLogoTexture = async (
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture | null> => {
  const textureLoader = new THREE.TextureLoader();

  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        "/assets/images/logo/logo-mobile.png",
        (texture) => {
          texture.flipY = false; // GLB models typically don't need flip
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve(texture);
        },
        undefined,
        reject
      );
    });
    return texture;
  } catch (error) {
    console.warn("Could not load logo texture:", error);
    return null;
  }
};

const loadLaptopModel = async (
  scene: THREE.Scene,
  config: SceneConfig,
  vscodeTexture: THREE.Texture | null,
  renderer: THREE.WebGLRenderer
): Promise<THREE.Group | null> => {
  const measure = perfMonitor.startMeasure("hero:loadLaptopModel");

  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const loader = new GLTFLoader();

  // Load the new logo texture
  const logoTexture = await loadLogoTexture(renderer);

  try {
    const gltf = await loadCachedGLTF(loader, "/assets/models/laptop-logo.glb");
    const model = gltf.scene;

    model.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name === "Screen_Screen_0" && vscodeTexture) {
          vscodeTexture.offset.x = -0.1;  // horizontal shift (-left, +right)
          vscodeTexture.offset.y = 0;      // vertical shift (-down, +up)
          vscodeTexture.repeat.x = 1.0;    // horizontal scale (<1 zoom in, >1 zoom out)
          vscodeTexture.repeat.y = 1.0;    // vertical scale

          child.material = new THREE.MeshBasicMaterial({
            map: vscodeTexture,
            transparent: false,
            opacity: 1.0,
            toneMapped: false,
          });
          child.material.needsUpdate = true;
        } else if (child.name === "Empty001" && logoTexture) {
          // Logo on the back of the laptop screen - replace with new logo
          child.material = new THREE.MeshBasicMaterial({
            map: logoTexture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
          });
          child.material.needsUpdate = true;
        }
      }
    });

    applyLaptopMaterialTheme(model);

    // Set model scale (this is the base scale)
    const scale = config.isTabletPortrait ? 38 : config.isMobile ? 45 : 60;
    model.scale.set(scale, scale, scale);

    const wrapper = new THREE.Group();
    wrapper.add(model);

    // Start wrapper invisible - will animate in when terminal morphs to hero
    wrapper.scale.set(0, 0, 0);

    // Position laptop based on device type
    if (config.isTabletPortrait) {
      // Portrait tablet: top-right quadrant, angled down-left toward terminal
      wrapper.position.set(200, 130, 50);
      wrapper.rotation.set(0.1, -0.3, 0);
    } else if (config.isMobile) {
      wrapper.position.set(0, 40, 50);
      wrapper.rotation.y = 0;
    } else if (config.isTablet) {
      wrapper.position.set(300, 50, 80);
      wrapper.rotation.y = -0.1;
    } else {
      // Desktop: far right, clear of terminal
      wrapper.position.set(420, 30, 80);
      wrapper.rotation.y = -0.15;
    }

    scene.add(wrapper);

    // Store global reference for external animations
    laptopRef = wrapper;
    watchLaptopTheme();

    measure();
    return wrapper;
  } catch (error) {
    console.error("Failed to load laptop model:", error);
    measure();
    return null;
  }
};

export async function initHero3DScene() {
  console.log("initHero3DScene called");
  const initMeasure = perfMonitor.startMeasure("hero:init:total");

  const container = document.querySelector("[data-hero-3d]") as HTMLElement;
  if (!container) {
    console.warn("Hero 3D container [data-hero-3d] not found");
    initMeasure();
    return null;
  }

  const config = getViewportConfig();
  const { scene, camera, renderer } = createScene(container, config);

  // Store scene reference for external animations
  sceneRef = scene;

  setupLighting(scene);

  const hexFloor = createHexFloor(config);
  scene.add(hexFloor);
  hexFloorRef = hexFloor;

  // Skip heavy laptop model + texture on phones — hex floor alone gives ambient 3D feel
  // Portrait tablets get the laptop since they have enough screen space
  let vscodeTexture: THREE.Texture | null = null;
  let laptopWrapper: THREE.Group | null = null;
  if (!config.isMobile || config.isTabletPortrait) {
    vscodeTexture = await loadTexture(renderer);
    laptopWrapper = await loadLaptopModel(scene, config, vscodeTexture, renderer);
  }

  // Mouse interaction for grabbing and rotating laptop (desktop/tablet only)
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  const initialRotationY = laptopWrapper ? laptopWrapper.rotation.y : -0.15;
  const initialRotationX = config.isTabletPortrait ? 0.1 : 0;

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
    container.style.cursor = "grabbing";
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging || !laptopWrapper) return;

    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    laptopWrapper.rotation.y += deltaX * 0.01;
    laptopWrapper.rotation.x += deltaY * 0.01;

    // Clamp X rotation
    laptopWrapper.rotation.x = Math.max(-0.5, Math.min(0.5, laptopWrapper.rotation.x));

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
  };

  const onMouseUp = () => {
    isDragging = false;
    container.style.cursor = "grab";
  };

  // Touch events for portrait tablets
  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    isDragging = true;
    previousMouseX = event.touches[0].clientX;
    previousMouseY = event.touches[0].clientY;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!isDragging || !laptopWrapper || event.touches.length !== 1) return;

    const deltaX = event.touches[0].clientX - previousMouseX;
    const deltaY = event.touches[0].clientY - previousMouseY;

    laptopWrapper.rotation.y += deltaX * 0.01;
    laptopWrapper.rotation.x += deltaY * 0.01;

    // Clamp X rotation
    laptopWrapper.rotation.x = Math.max(-0.5, Math.min(0.5, laptopWrapper.rotation.x));

    previousMouseX = event.touches[0].clientX;
    previousMouseY = event.touches[0].clientY;
  };

  const onTouchEnd = () => {
    isDragging = false;
  };

  if (!config.isMobile || config.isTabletPortrait) {
    container.style.cursor = config.isTabletPortrait ? "default" : "grab";
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseUp);
    if (config.isTabletPortrait) {
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      container.addEventListener("touchend", onTouchEnd);
    }
  }

  const handleResize = () => {
    const measure = perfMonitor.startMeasure("hero:resize");
    const newConfig = getViewportConfig();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    const maxPixelRatio = newConfig.isMobile ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    measure();
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;
  let frameCounter = 0;

  const hexColor1 = new THREE.Color(0x0a8a70);
  const hexColor2 = new THREE.Color(0x8a7a00);

  const baseY = config.isTabletPortrait ? 130 : config.isMobile ? 40 : config.isTablet ? 50 : 30;

  const animate = () => {
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const shouldMeasure = frameCounter % 60 === 0;
    const animateMeasure = shouldMeasure
      ? perfMonitor.startMeasure("hero:animate")
      : null;

    perfMonitor.updateFPS();
    time += 0.008;

    // Subtle hex floor sway combined with base rotation from section transitions
    hexFloor.rotation.y = hexFloorBaseRotation + Math.sin(time * 0.15) * 0.02;

    // Update hex colors — only after entrance animation is done
    if (hexFloorEntranceDone && frameCounter % 3 === 0) {
      const totalHexes = hexFloor.children.length;
      const batchSize = Math.ceil(totalHexes / 5);
      const startIndex =
        (Math.floor(frameCounter / 3) * batchSize) % totalHexes;
      const endIndex = Math.min(startIndex + batchSize, totalHexes);

      for (let i = startIndex; i < endIndex; i++) {
        const hex = hexFloor.children[i];
        const material = (hex as THREE.Line)
          .material as THREE.LineBasicMaterial;
        const pulse = Math.sin(time * 1.2 + (hex as any).pulseOffset);

        material.opacity = (hex as any).baseOpacity + pulse * 0.12;

        const gradientShift =
          Math.sin(time * 0.4 + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
        material.color.lerpColors(hexColor1, hexColor2, gradientShift);
      }
    }

    // Laptop floating and smooth return to initial position
    // Skip if exit animation is running (GSAP controls position)
    if (laptopWrapper && !isAnimatingOut) {
      // Ramp up float blend so floating eases in after tornado
      floatBlend = Math.min(1, floatBlend + 0.02);
      laptopWrapper.position.y = baseY + Math.sin(time * 0.6) * 12 * floatBlend;

      if (!isDragging) {
        // Smoothly return to initial rotation when not dragging
        laptopWrapper.rotation.y += (initialRotationY - laptopWrapper.rotation.y) * 0.05;
        laptopWrapper.rotation.x += (initialRotationX - laptopWrapper.rotation.x) * 0.05;
      }
    }

    renderer.render(scene, camera);

    if (animateMeasure) animateMeasure();
    frameCounter++;
    animationId = requestAnimationFrame(animate);
  };

  animate();

  initMeasure();
  console.log("Hero scene initialized");

  return () => {
    // Clear global references
    laptopRef = null;
    laptopThemeObserver?.disconnect();
    laptopThemeObserver = null;
    sceneRef = null;
    hexFloorRef = null;
    hexFloorBaseRotation = 0;
    isAnimatingOut = false;
    hexFloorEntranceDone = false;

    window.removeEventListener("resize", handleResize);
    container.removeEventListener("mousedown", onMouseDown);
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mouseleave", onMouseUp);
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchmove", onTouchMove);
    container.removeEventListener("touchend", onTouchEnd);
    if (animationId) cancelAnimationFrame(animationId);

    scene.traverse((child: any) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material: any) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    });

    if (vscodeTexture) vscodeTexture.dispose();

    if (renderer.domElement.parentNode)
      container.removeChild(renderer.domElement);
    renderer.dispose();
  };
}
