import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import type { SceneConfig } from "@/types/three";
import { perfMonitor } from "@/utils/performance-monitor";

const getViewportConfig = (): SceneConfig => {
  const width = window.innerWidth;
  const { isLight } = getThemeState();

  return {
    isLight,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

const createScene = (container: HTMLElement, config: SceneConfig) => {
  const measure = perfMonitor.startMeasure('hero:createScene');
  
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    config.isMobile ? 75 : 60,
    container.clientWidth / container.clientHeight,
    0.1,
    5000
  );

  camera.position.set(
    0,
    config.isMobile ? 50 : 30,
    config.isMobile ? 600 : 800
  );
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  measure();
  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene, isLight: boolean) => {
  const measure = perfMonitor.startMeasure('hero:setupLighting');
  
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.2 : 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, isLight ? 0.8 : 0.6);
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  if (isLight) {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-200, 300, -300);
    scene.add(fillLight);
  }
  
  measure();
};

const createHexFloor = (config: SceneConfig) => {
  const measure = perfMonitor.startMeasure('hero:createHexFloor');
  
  const group = new THREE.Group();
  const hexSize = config.isMobile ? 60 : 80;
  const radius = config.isMobile ? 8 : 12;

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
      const opacity = Math.max(0.1, 1 - distance / (radius * 1.5));
      const gradientFactor =
        (Math.sin(q * 0.5) + Math.cos(r * 0.5)) * 0.5 + 0.5;

      const color = new THREE.Color().lerpColors(
        new THREE.Color(0x02bccc),
        new THREE.Color(0xccff02),
        gradientFactor
      );

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: opacity * (config.isLight ? 0.6 : 0.4),
        linewidth: 2,
      });

      const hex = new THREE.Line(geometry, material);
      const x = hexSize * 1.5 * q;
      const z = hexSize * Math.sqrt(3) * (r + q / 2);

      hex.position.set(x, config.isMobile ? -150 : -200, z);

      (hex as any).baseOpacity = opacity * (config.isLight ? 0.6 : 0.4);
      (hex as any).pulseOffset = distance * 0.2;
      (hex as any).gradientFactor = gradientFactor;

      group.add(hex);
    }
  }

  measure();
  return group;
};

const loadTexture = async (
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture | null> => {
  const measure = perfMonitor.startMeasure('hero:loadTexture');
  const textureLoader = new THREE.TextureLoader();

  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        "/assets/images/vscode-texture.png",
        (texture) => {
          texture.flipY = false;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          resolve(texture);
        },
        undefined,
        reject
      );
    });
    measure();
    return texture;
  } catch (error) {
    console.warn("⚠️ Could not load VS Code texture");
    measure();
    return null;
  }
};

const loadCodeModel = async (
  scene: THREE.Scene,
  config: SceneConfig
): Promise<THREE.Group | null> => {
  const measure = perfMonitor.startMeasure('hero:loadCodeModel');
  
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const loader = new GLTFLoader();

  return new Promise((resolve) => {
    loader.load("/assets/models/code-3D.glb", (gltf) => {
      const model = gltf.scene;

      model.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: config.isLight ? 0xf0f0f0 : 0xffffff,
            roughness: config.isLight ? 0.3 : 0.95,
            metalness: config.isLight ? 0.1 : 0.95,
            transmission: config.isLight ? 0.2 : 0.7,
            opacity: config.isLight ? 0.7 : 1,
            ior: config.isLight ? 1.5 : 2.5,
            thickness: config.isLight ? 2.0 : 5.0,
            clearcoat: config.isLight ? 1.0 : 5.0,
            clearcoatRoughness: config.isLight ? 0.1 : 0.55,
          });
        }
      });

      const scale = config.isMobile ? 35 : 50;
      model.scale.set(scale, scale, scale);

      const wrapper = new THREE.Group();
      wrapper.add(model);

      if (config.isMobile) {
        wrapper.position.set(-50, 50, 250);
      } else if (config.isTablet) {
        wrapper.position.set(150, 70, 220);
      } else {
        wrapper.position.set(300, 80, 200);
      }

      scene.add(wrapper);
      measure();
      resolve(wrapper);
    });
  });
};

const loadLaptopModel = async (
  scene: THREE.Scene,
  config: SceneConfig,
  vscodeTexture: THREE.Texture | null
): Promise<THREE.Group | null> => {
  const measure = perfMonitor.startMeasure('hero:loadLaptopModel');
  
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const loader = new GLTFLoader();

  return new Promise((resolve) => {
    loader.load("/assets/models/laptop-logo.glb", (gltf) => {
      const model = gltf.scene;

      model.traverse((child: any) => {
        if (child.isMesh) {
          if (child.name === "Screen_Screen_0" && vscodeTexture) {
            child.material = new THREE.MeshBasicMaterial({
              map: vscodeTexture,
              transparent: false,
              opacity: 1.0,
              toneMapped: false,
            });
            child.material.needsUpdate = true;
            child.receiveShadow = false;
            child.castShadow = false;
          } else if (child.name === "Keyboard_Keyboard_0") {
            child.material.color = new THREE.Color(
              config.isLight ? 0x282828 : 0x181818
            );
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          } else if (child.material) {
            child.material.emissive = new THREE.Color(
              config.isLight ? 0x4e4e4e : 0x2a2a2a
            );
            child.material.emissiveIntensity = config.isLight ? 0.3 : 0.6;
            child.material.transparent = false;
            child.material.opacity = 1.0;
            child.material.needsUpdate = true;
          }
        }
      });

      const scale = config.isMobile ? 45 : 60;
      model.scale.set(scale, scale, scale);

      const wrapper = new THREE.Group();
      wrapper.add(model);

      if (config.isMobile) {
        wrapper.position.set(50, -30, 200);
      } else if (config.isTablet) {
        wrapper.position.set(100, -40, 180);
      } else {
        wrapper.position.set(200, -50, 150);
      }

      scene.add(wrapper);
      measure();
      resolve(wrapper);
    });
  });
};

const setupInteractions = (
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  codeWrapper: THREE.Group | null,
  laptopWrapper: THREE.Group | null
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isDragging = false;
  let selectedObject: THREE.Group | null = null;
  let dragOffset = new THREE.Vector3();

  const onMouseDown = (event: MouseEvent) => {
    const measure = perfMonitor.startMeasure('hero:mouseDown');
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (!codeWrapper || !laptopWrapper) {
      measure();
      return;
    }

    const intersects = raycaster.intersectObjects(
      [codeWrapper, laptopWrapper],
      true
    );

    if (intersects.length > 0) {
      isDragging = true;

      let clickedObject = intersects[0].object;
      while (clickedObject.parent && clickedObject.parent.type !== "Scene") {
        clickedObject = clickedObject.parent;
      }

      selectedObject = clickedObject as THREE.Group;
      const intersectPoint = intersects[0].point;
      dragOffset.copy(intersectPoint).sub(selectedObject.position);
      container.style.cursor = "grabbing";
    }
    measure();
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging || !selectedObject) return;

    const measure = perfMonitor.startMeasure('hero:mouseMove');
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const targetZ = selectedObject.position.z;
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -targetZ);

    const intersectPoint = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      selectedObject.position.x = intersectPoint.x - dragOffset.x;
      selectedObject.position.y = intersectPoint.y - dragOffset.y;
    }
    measure();
  };

  const onMouseUp = () => {
    isDragging = false;
    selectedObject = null;
    container.style.cursor = "default";
  };

  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mouseleave", onMouseUp);

  return () => {
    container.removeEventListener("mousedown", onMouseDown);
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mouseleave", onMouseUp);
  };
};

export async function initHero3DScene() {
  console.log("🚀 initHero3DScene called");
  const initMeasure = perfMonitor.startMeasure('hero:init:total');
  
  const container = document.querySelector(
    '[data-3d-container="hero"]'
  ) as HTMLElement;
  if (!container) {
    initMeasure();
    return;
  }

  const config = getViewportConfig();
  const { scene, camera, renderer } = createScene(container, config);

  setupLighting(scene, config.isLight);

  const hexFloor = createHexFloor(config);
  scene.add(hexFloor);

  const vscodeTexture = await loadTexture(renderer);
  const codeWrapper = config.isMobile
    ? null
    : await loadCodeModel(scene, config);
  const laptopWrapper = config.isMobile
    ? null
    : await loadLaptopModel(scene, config, vscodeTexture);

  const codeModel = codeWrapper?.children[0] as THREE.Group | null;
  const laptopModel = laptopWrapper?.children[0] as THREE.Group | null;

  const cleanupInteractions = config.isDesktop
    ? setupInteractions(container, camera, codeWrapper, laptopWrapper)
    : () => {};

  const handleResize = () => {
    const measure = perfMonitor.startMeasure('hero:resize');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    measure();
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;
  let frameCounter = 0;

  const animate = () => {
    // Only measure every 60 frames to reduce overhead
    const shouldMeasure = frameCounter % 60 === 0;
    const animateMeasure = shouldMeasure ? perfMonitor.startMeasure('hero:animate') : null;
    
    perfMonitor.updateFPS();
    time += 0.01;

    hexFloor.rotation.y = Math.sin(time * 0.3) * 0.05;
    hexFloor.rotation.x = Math.sin(time * 0.2) * 0.02;

    hexFloor.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);

      material.opacity = (hex as any).baseOpacity + pulse * 0.2;

      const gradientShift =
        Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
      material.color.lerpColors(
        new THREE.Color(0x02bccc),
        new THREE.Color(0xccff02),
        gradientShift
      );
    });

    if (codeModel) {
      codeModel.rotation.y += config.isLight ? 0.003 : 0.005;
    }

    if (laptopModel) {
      laptopModel.rotation.y += config.isLight ? 0.001 : 0.002;
    }

    renderer.render(scene, camera);
    
    if (animateMeasure) animateMeasure();
    frameCounter++;
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__heroScene = {
    scene,
    camera,
    renderer,
    hexFloor,
    codeWrapper,
    laptopWrapper,
    codeModel,
    laptopModel,
  };

  initMeasure();
  console.log("✅ Hero scene initialized");

  return () => {
    window.removeEventListener("resize", handleResize);
    cleanupInteractions();
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer.domElement.parentNode)
      container.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__heroScene;
  };
}