import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import { getFeaturedProjects } from "@/data/projects";
import type { SceneConfig } from "@/types/three";
import { perfMonitor } from "@/utils/performance-monitor";
import { loadCachedGLTF } from "@/utils/model-cache";

const MODEL_PATHS = [
  "/assets/models/iphone-laptop-scene-1.glb",
  "/assets/models/iphone-laptop-scene-2.glb",
  "/assets/models/iphone-laptop-scene-3.glb",
];

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
  const width = window.innerWidth;
  const { isLight } = getThemeState();

  return {
    isLight,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

const createScene = (container: HTMLElement) => {
  const config = getViewportConfig();
  const lowPerf = isLowPerformanceDevice();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );

  camera.position.set(-50, 30, 700);
  camera.lookAt(-30, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile && !lowPerf,
    powerPreference: "high-performance",
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  const maxPixelRatio = config.isMobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene, isLight: boolean) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 2.2 : 2.0);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, isLight ? 2.2 : 2.0);
  dirLight1.position.set(450, 550, 450);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, isLight ? 1.6 : 1.4);
  dirLight2.position.set(-450, 450, -450);
  scene.add(dirLight2);

  const frontLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.2 : 1.0);
  frontLight.position.set(0, 100, 550);
  scene.add(frontLight);

  const rimLight = new THREE.DirectionalLight(0x88ccff, isLight ? 0.4 : 0.6);
  rimLight.position.set(-300, 200, -200);
  scene.add(rimLight);
};

const loadTexture = async (
  renderer: THREE.WebGLRenderer,
  texturePath: string
): Promise<THREE.Texture | null> => {
  const textureLoader = new THREE.TextureLoader();

  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        texturePath,
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
    return texture;
  } catch (error) {
    console.warn(`⚠️ Could not load texture: ${texturePath}`);
    return null;
  }
};

const loadModel = async (
  scene: THREE.Scene,
  config: SceneConfig,
  laptopTexture: THREE.Texture | null,
  iphoneTexture: THREE.Texture | null,
  modelPath: string,
  projectIndex: number
): Promise<{
  wrapper: THREE.Group;
  laptopGroup: THREE.Object3D | null;
  iphoneGroup: THREE.Object3D | null;
} | null> => {
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const loader = new GLTFLoader();

  try {
    const gltf = await loadCachedGLTF(loader, modelPath);
    const model = gltf.scene;
    let laptopGroup: THREE.Object3D | null = null;
    let iphoneGroup: THREE.Object3D | null = null;

    model.traverse((child: any) => {
      if (child.isMesh) {
        const meshName = child.name.toLowerCase();

        if (meshName === "screen_screen_0" && laptopTexture) {
          const geometry = child.geometry;
          const uvAttribute = geometry.attributes.uv;

          if (uvAttribute) {
            const uvArray = uvAttribute.array;
            for (let i = 0; i < uvArray.length; i += 2) {
              const u = uvArray[i];
              const v = uvArray[i + 1];
              uvArray[i] = (u - 0.5) * 1.5 + 0.6;
              uvArray[i + 1] = v;
            }
            uvAttribute.needsUpdate = true;
          }

          laptopTexture.repeat.set(1, 1);
          laptopTexture.offset.set(0, 0);
          laptopTexture.wrapS = THREE.ClampToEdgeWrapping;
          laptopTexture.wrapT = THREE.ClampToEdgeWrapping;

          child.material = new THREE.MeshBasicMaterial({
            map: laptopTexture,
            side: THREE.DoubleSide,
          });
          child.material.needsUpdate = true;

          let current = child.parent;
          while (current && !laptopGroup) {
            if (current.name === "Modern_Slim_Laptop") {
              laptopGroup = current;
              break;
            }
            current = current.parent;
          }
        } else if (meshName === "tppzcqmnlkchipp" && iphoneTexture) {
          child.material = new THREE.MeshBasicMaterial({
            map: iphoneTexture,
            side: THREE.DoubleSide,
          });
          child.material.needsUpdate = true;

          let current = child.parent;
          while (current && !iphoneGroup) {
            if (current.name === "CfdQrXYnljwmMLk") {
              iphoneGroup = current;
              break;
            }
            current = current.parent;
          }
        } else if (child.material) {
          child.material.emissive = new THREE.Color(
            config.isLight ? 0x404040 : 0x2a2a2a
          );
          child.material.emissiveIntensity = config.isLight ? 0.2 : 0.3;
          child.material.needsUpdate = true;
        }
      }
    });

    const scale = config.isMobile ? 120 : config.isTablet ? 110 : 75;
    model.scale.set(scale, scale, scale);
    model.rotation.y = -0.3;

    const modelY = config.isMobile ? 20 : config.isTablet ? 10 : -35;
    model.position.set(-20, modelY, 0);

    const wrapper = new THREE.Group();
    wrapper.add(model);
    scene.add(wrapper);

    return { wrapper, laptopGroup, iphoneGroup };
  } catch (error) {
    console.error(`❌ Error loading model:`, error);
    return null;
  }
};

export async function initProjects3DScene() {
  const config = getViewportConfig();
  const desktopContainers = document.querySelectorAll(
    '[data-3d-container^="project-"]:not([data-3d-container^="project-mobile"])'
  );
  const mobileContainers = document.querySelectorAll(
    '[data-3d-container^="project-mobile-"]'
  );

  const allContainers =
    config.isMobile || config.isTablet
      ? Array.from(mobileContainers)
      : Array.from(desktopContainers);

  if (allContainers.length === 0) return;

  const projects = getFeaturedProjects();
  const cleanupFunctions: Array<() => void> = [];

  for (let index = 0; index < allContainers.length; index++) {
    const container = allContainers[index] as HTMLElement;
    if (!container) continue;

    const isMobile = container
      .getAttribute("data-3d-container")
      ?.includes("mobile");
    const projectIndex = isMobile
      ? parseInt(
          container.getAttribute("data-3d-container")?.split("-")[2] || "0"
        )
      : parseInt(
          container.getAttribute("data-3d-container")?.split("-")[1] || "0"
        );

    const project = projects[projectIndex];
    const modelPath = MODEL_PATHS[projectIndex % MODEL_PATHS.length];
    const laptopImage = project?.media.laptopTexture;
    const iphoneImage = project?.media.mobileTexture;

    const computedStyle = window.getComputedStyle(container);
    if (
      computedStyle.display === "none" ||
      computedStyle.visibility === "hidden"
    ) {
      console.warn(`⚠️  Container #${projectIndex} is HIDDEN - skipping`);
      continue;
    }

    if (!container.clientWidth || !container.clientHeight) {
      console.warn(
        `⚠️  Container #${projectIndex} has no dimensions - skipping`
      );
      continue;
    }

    const config = getViewportConfig();
    const { scene, camera, renderer } = createScene(container);

    setupLighting(scene, config.isLight);

    const laptopTexture = await loadTexture(renderer, laptopImage || "");
    const iphoneTexture = await loadTexture(renderer, iphoneImage || "");

    const modelData = await loadModel(
      scene,
      config,
      laptopTexture,
      iphoneTexture,
      modelPath,
      projectIndex
    );

    if (!modelData) {
      console.error(`❌ Failed to load model for project #${projectIndex}`);
      continue;
    }

    const { wrapper: modelWrapper, laptopGroup, iphoneGroup } = modelData;

    if (modelWrapper) {
      modelWrapper.position.set(0, 0, 0);
    }

    const laptopOriginal = laptopGroup
      ? {
          pos: {
            x: laptopGroup.position.x,
            y: laptopGroup.position.y,
            z: laptopGroup.position.z,
          },
          rot: {
            x: laptopGroup.rotation.x,
            y: laptopGroup.rotation.y,
            z: laptopGroup.rotation.z,
          },
        }
      : null;

    const iphoneOriginal = iphoneGroup
      ? {
          pos: {
            x: iphoneGroup.position.x,
            y: iphoneGroup.position.y,
            z: iphoneGroup.position.z,
          },
          rot: {
            x: iphoneGroup.rotation.x,
            y: iphoneGroup.rotation.y,
            z: iphoneGroup.rotation.z,
          },
        }
      : null;

    const handleResize = () => {
      const newConfig = getViewportConfig();
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      const maxPixelRatio = newConfig.isMobile ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    };
    window.addEventListener("resize", handleResize);

    let animationId: number;
    let time = 0;
    let frameCounter = 0;

    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const shouldMeasure = frameCounter % 60 === 0 && frameCounter > 0;
      const animateMeasure = shouldMeasure
        ? perfMonitor.startMeasure(`animate:${index}`)
        : null;

      perfMonitor.updateFPS();
      time += 0.005;

      if (modelWrapper && modelWrapper.children[0]) {
        modelWrapper.position.y = Math.sin(time * 0.6) * 3;
        const modelChild = modelWrapper.children[0];
        modelChild.rotation.x = Math.sin(time * 0.3) * 0.01;
        modelChild.rotation.z = Math.sin(time * 0.25) * 0.008;
      }

      if (laptopGroup && laptopOriginal) {
        laptopGroup.position.y =
          laptopOriginal.pos.y + Math.sin(time * 0.35) * 2.5;

        laptopGroup.rotation.x =
          laptopOriginal.rot.x + Math.sin(time * 0.18) * 0.02;
        laptopGroup.rotation.y =
          laptopOriginal.rot.y + Math.cos(time * 0.22) * 0.015;
        laptopGroup.rotation.z =
          laptopOriginal.rot.z + Math.sin(time * 0.26) * 0.01;
      }

      if (iphoneGroup && iphoneOriginal) {
        iphoneGroup.position.y =
          iphoneOriginal.pos.y + Math.cos(time * 0.42 + 2) * 2.5;

        iphoneGroup.rotation.x =
          iphoneOriginal.rot.x + Math.cos(time * 0.22) * 0.025;
        iphoneGroup.rotation.y =
          iphoneOriginal.rot.y + Math.sin(time * 0.27) * 0.02;
        iphoneGroup.rotation.z =
          iphoneOriginal.rot.z + Math.cos(time * 0.32) * 0.015;
      }

      renderer.render(scene, camera);

      if (animateMeasure) animateMeasure();
      frameCounter++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const sceneKey = isMobile
      ? `__projectScene_mobile_${projectIndex}`
      : `__projectScene_${projectIndex}`;
    (window as any)[sceneKey] = {
      scene,
      camera,
      renderer,
      modelWrapper,
      model: modelWrapper?.children[0],
      laptop: laptopGroup,
      iphone: iphoneGroup,
      laptopOriginal,
      iphoneOriginal,
      scrollProgress: 0,
    };

    cleanupFunctions.push(() => {
      window.removeEventListener("resize", handleResize);
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

      if (laptopTexture) laptopTexture.dispose();
      if (iphoneTexture) iphoneTexture.dispose();

      if (renderer.domElement.parentNode)
        container.removeChild(renderer.domElement);
      renderer.dispose();
      delete (window as any)[sceneKey];
    });
  }

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}
