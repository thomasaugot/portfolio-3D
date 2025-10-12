import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import { getFeaturedProjects } from "@/data/projects";
import type { SceneConfig } from "@/types/three.types";

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
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 20, 480);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene, isLight: boolean) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 2.0 : 1.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, isLight ? 2.0 : 1.8);
  dirLight1.position.set(400, 500, 400);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, isLight ? 1.5 : 1.2);
  dirLight2.position.set(-400, 400, -400);
  scene.add(dirLight2);
  
  const frontLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.0 : 0.8);
  frontLight.position.set(0, 0, 500);
  scene.add(frontLight);
};

const loadTexture = async (
  renderer: THREE.WebGLRenderer,
  texturePath: string
): Promise<THREE.Texture | null> => {
  const textureLoader = new THREE.TextureLoader();

  try {
    return await new Promise<THREE.Texture>((resolve, reject) => {
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
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  } catch (error) {
    console.warn(`⚠️ Could not load texture: ${texturePath}`);
    return null;
  }
};

const loadModel = async (
  scene: THREE.Scene,
  config: SceneConfig,
  iphoneTexture: THREE.Texture | null,
  laptopTexture: THREE.Texture | null,
  projectIndex: number
): Promise<{ 
  wrapper: THREE.Group; 
  laptopGroup: THREE.Object3D | null; 
  iphoneGroup: THREE.Object3D | null;
} | null> => {
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const loader = new GLTFLoader();

  return new Promise((resolve) => {
    loader.load(
      "/assets/models/iphone-laptop-scene.glb",
      (gltf) => {
        const model = gltf.scene;

        let laptopGroup: THREE.Object3D | null = null;
        let iphoneGroup: THREE.Object3D | null = null;

        model.traverse((child: any) => {
          if (child.isMesh) {
            const meshName = child.name.toLowerCase();
            
            // Find laptop screen and apply texture
            if (meshName === "screen_screen_0" && laptopTexture) {
              child.material = new THREE.MeshBasicMaterial({
                map: laptopTexture,
                side: THREE.DoubleSide,
              });
              child.material.needsUpdate = true;
              
              // Find laptop group
              let current = child.parent;
              while (current && !laptopGroup) {
                if (current.name === "Modern_Slim_Laptop") {
                  laptopGroup = current;
                  break;
                }
                current = current.parent;
              }
            }
            // Find iPhone screen and apply texture
            else if (meshName === "tppzcqmnlkchipp" && iphoneTexture) {
              child.material = new THREE.MeshBasicMaterial({
                map: iphoneTexture,
                side: THREE.DoubleSide,
              });
              child.material.needsUpdate = true;
              
              // Find iPhone group
              let current = child.parent;
              while (current && !iphoneGroup) {
                if (current.name === "CfdQrXYnljwmMLk") {
                  iphoneGroup = current;
                  break;
                }
                current = current.parent;
              }
            }
            // Other materials
            else if (child.material) {
              child.material.emissive = new THREE.Color(config.isLight ? 0x404040 : 0x2a2a2a);
              child.material.emissiveIntensity = config.isLight ? 0.2 : 0.3;
              child.material.needsUpdate = true;
            }
          }
        });

        const scale = 70;
        model.scale.set(scale, scale, scale);
        model.rotation.y = -0.4;
        model.position.y = -30;

        const wrapper = new THREE.Group();
        wrapper.add(model);
        scene.add(wrapper);
        
        resolve({ wrapper, laptopGroup, iphoneGroup });
      },
      undefined,
      (error) => {
        console.error(`❌ Error loading model:`, error);
        resolve(null);
      }
    );
  });
};

export async function initProjects3DScene() {
  // Get both desktop and mobile containers
  const desktopContainers = document.querySelectorAll('[data-3d-container^="project-"]:not([data-3d-container^="project-mobile"])');
  const mobileContainers = document.querySelectorAll('[data-3d-container^="project-mobile-"]');
  
  const allContainers = [...Array.from(desktopContainers), ...Array.from(mobileContainers)];
  
  if (allContainers.length === 0) return;

  const projects = getFeaturedProjects();
  const cleanupFunctions: Array<() => void> = [];

  for (let index = 0; index < allContainers.length; index++) {
    const container = allContainers[index] as HTMLElement;
    if (!container) continue;

    // Determine if this is a mobile container
    const isMobile = container.getAttribute('data-3d-container')?.includes('mobile');
    const projectIndex = isMobile ? 
      parseInt(container.getAttribute('data-3d-container')?.split('-')[2] || '0') : 
      parseInt(container.getAttribute('data-3d-container')?.split('-')[1] || '0');

    const project = projects[projectIndex];
    const iphoneImage = project?.media.images[0] || "";
    const laptopImage = project?.media.images[1] || "";

    const config = getViewportConfig();
    const { scene, camera, renderer } = createScene(container);

    setupLighting(scene, config.isLight);

    const iphoneTexture = await loadTexture(renderer, iphoneImage);
    const laptopTexture = await loadTexture(renderer, laptopImage);
    
    const modelData = await loadModel(scene, config, iphoneTexture, laptopTexture, index);
    if (!modelData) continue;
    
    const { wrapper: modelWrapper, laptopGroup, iphoneGroup } = modelData;

    if (modelWrapper) {
      modelWrapper.position.set(0, 0, 0);
    }

    // Store ORIGINAL positions and rotations
    const laptopOriginal = laptopGroup ? {
      pos: { x: laptopGroup.position.x, y: laptopGroup.position.y, z: laptopGroup.position.z },
      rot: { x: laptopGroup.rotation.x, y: laptopGroup.rotation.y, z: laptopGroup.rotation.z }
    } : null;
    
    const iphoneOriginal = iphoneGroup ? {
      pos: { x: iphoneGroup.position.x, y: iphoneGroup.position.y, z: iphoneGroup.position.z },
      rot: { x: iphoneGroup.rotation.x, y: iphoneGroup.rotation.y, z: iphoneGroup.rotation.z }
    } : null;

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;

      // Scene-wide subtle float
      if (modelWrapper && modelWrapper.children[0]) {
        modelWrapper.position.y = Math.sin(time * 0.8) * 8;
        const modelChild = modelWrapper.children[0];
        modelChild.rotation.x = Math.sin(time * 0.4) * 0.02;
        modelChild.rotation.z = Math.sin(time * 0.3) * 0.015;
      }

      // Laptop gentle floating - visible motion with MORE rotation
      if (laptopGroup && laptopOriginal) {
        laptopGroup.position.x = laptopOriginal.pos.x + Math.sin(time * 0.4) * 4;
        // Reduced downward movement so laptop stays higher
        laptopGroup.position.y = laptopOriginal.pos.y - Math.abs(Math.cos(time * 0.35)) * 2;
        laptopGroup.position.z = laptopOriginal.pos.z + Math.sin(time * 0.3) * 3;
        
        // MORE rotation for visual interest
        laptopGroup.rotation.x = laptopOriginal.rot.x + Math.sin(time * 0.2) * 0.08;
        laptopGroup.rotation.y = laptopOriginal.rot.y + Math.cos(time * 0.25) * 0.12;
        laptopGroup.rotation.z = laptopOriginal.rot.z + Math.sin(time * 0.3) * 0.06;
      }

      // iPhone gentle floating - stays ABOVE with MORE rotation
      if (iphoneGroup && iphoneOriginal) {
        iphoneGroup.position.x = iphoneOriginal.pos.x + Math.cos(time * 0.5 + 2) * 3.5;
        iphoneGroup.position.y = iphoneOriginal.pos.y + Math.abs(Math.sin(time * 0.4 + 1)) * 4.5;
        iphoneGroup.position.z = iphoneOriginal.pos.z + Math.cos(time * 0.35 + 1.5) * 2.5;
        
        // MORE rotation for visual interest
        iphoneGroup.rotation.x = iphoneOriginal.rot.x + Math.cos(time * 0.25) * 0.1;
        iphoneGroup.rotation.y = iphoneOriginal.rot.y + Math.sin(time * 0.3) * 0.15;
        iphoneGroup.rotation.z = iphoneOriginal.rot.z + Math.cos(time * 0.35) * 0.08;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Store scene data for scroll animations
    const sceneKey = isMobile ? `__projectScene_mobile_${projectIndex}` : `__projectScene_${projectIndex}`;
    (window as any)[sceneKey] = {
      scene,
      camera,
      renderer,
      modelWrapper,
      model: modelWrapper?.children[0],
      laptop: laptopGroup,
      iphone: iphoneGroup,
    };

    cleanupFunctions.push(() => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer.domElement.parentNode) container.removeChild(renderer.domElement);
      renderer.dispose();
      delete (window as any)[sceneKey];
    });
  }

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}