import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import type { SceneConfig } from "@/types/three";
import { getAllProjects } from "@/data/projects";

const MODEL_PATHS = [
  "/assets/models/iphone-laptop-scene-1.glb",
  "/assets/models/iphone-laptop-scene-2.glb",
  "/assets/models/iphone-laptop-scene-3.glb",
];

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
  modelPath: string
): Promise<{
  wrapper: THREE.Group;
  laptopGroup: THREE.Object3D | null;
  iphoneGroup: THREE.Object3D | null;
} | null> => {
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const loader = new GLTFLoader();

  return new Promise((resolve) => {
    loader.load(
      modelPath,
      (gltf) => {
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

        const scale = 55;
        model.scale.set(scale, scale, scale);
        model.rotation.y = -0.3;
        model.position.set(-20, -35, 0);

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

export async function initPortfolioScene() {
  const hexContainer = document.querySelector(
    '[data-3d-container="portfolio-hex"]'
  ) as HTMLElement;
  
  if (!hexContainer) return;

  const config = getViewportConfig();
  const projects = getAllProjects();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    config.isMobile ? 75 : 25,
    hexContainer.clientWidth / hexContainer.clientHeight,
    0.1,
    5000
  );
  camera.position.set(
    config.isMobile ? -100 : -200,
    config.isMobile ? 50 : 80,
    config.isMobile ? 800 : 1000
  );
  camera.lookAt(-50, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile,
    powerPreference: "high-performance",
  });
  renderer.setSize(hexContainer.clientWidth, hexContainer.clientHeight);
  const maxPixelRatio = config.isMobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  hexContainer.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(
    0xffffff,
    config.isLight ? 1.2 : 0.9
  );
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(
    0xffffff,
    config.isLight ? 0.8 : 0.6
  );
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  if (config.isLight) {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-200, 300, -300);
    scene.add(fillLight);
  }

  const hexFloor = new THREE.Group();
  const hexSize = config.isMobile ? 40 : 50;
  const radius = config.isMobile ? 6 : 9;

  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(q) > radius || Math.abs(r) > radius || Math.abs(s) > radius)
        continue;

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

      hexFloor.add(hex);
    }
  }
  scene.add(hexFloor);

  const projectModels: Array<{
    wrapper: THREE.Group;
    laptop: THREE.Object3D | null;
    iphone: THREE.Object3D | null;
    laptopOriginal: any;
    iphoneOriginal: any;
  }> = [];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const modelPath = MODEL_PATHS[i % MODEL_PATHS.length];

    const laptopTexture = project.media.laptopTexture 
      ? await loadTexture(renderer, project.media.laptopTexture)
      : null;
    
    const iphoneTexture = project.media.mobileTexture
      ? await loadTexture(renderer, project.media.mobileTexture)
      : null;

    const modelData = await loadModel(
      scene,
      config,
      laptopTexture,
      iphoneTexture,
      modelPath
    );

    if (modelData) {
      const { wrapper, laptopGroup, iphoneGroup } = modelData;

      wrapper.position.set(config.isMobile ? -50 : -120, 0, 0);
      wrapper.visible = i === 0;
      wrapper.scale.set(0.01, 0.01, 0.01);

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

      projectModels.push({
        wrapper,
        laptop: laptopGroup,
        iphone: iphoneGroup,
        laptopOriginal,
        iphoneOriginal,
      });
    }
  }

  const handleResize = () => {
    camera.aspect = hexContainer.clientWidth / hexContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(hexContainer.clientWidth, hexContainer.clientHeight);
    const newConfig = getViewportConfig();
    const maxPixelRatio = newConfig.isMobile ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;

  const hexColor1 = new THREE.Color(0x02bccc);
  const hexColor2 = new THREE.Color(0xccff02);

  const animate = () => {
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    time += 0.01;

    hexFloor.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);

      material.opacity = (hex as any).baseOpacity + pulse * 0.2;

      const gradientShift =
        Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
      material.color.lerpColors(hexColor1, hexColor2, gradientShift);
    });

    projectModels.forEach((modelData) => {
      if (modelData.wrapper.visible && modelData.wrapper.scale.x > 0.9) {
        modelData.wrapper.position.y = Math.sin(time * 0.6) * 10;

        if (modelData.wrapper.children[0]) {
          modelData.wrapper.children[0].rotation.x =
            Math.sin(time * 0.3) * 0.015;
          modelData.wrapper.children[0].rotation.z =
            Math.sin(time * 0.25) * 0.012;
        }

        if (modelData.laptop && modelData.laptopOriginal) {
          modelData.laptop.position.y =
            modelData.laptopOriginal.pos.y + Math.sin(time * 0.35) * 7;
          modelData.laptop.rotation.x =
            modelData.laptopOriginal.rot.x + Math.sin(time * 0.18) * 0.035;
          modelData.laptop.rotation.y =
            modelData.laptopOriginal.rot.y + Math.cos(time * 0.22) * 0.028;
          modelData.laptop.rotation.z =
            modelData.laptopOriginal.rot.z + Math.sin(time * 0.26) * 0.018;
        }

        if (modelData.iphone && modelData.iphoneOriginal) {
          modelData.iphone.position.y =
            modelData.iphoneOriginal.pos.y + Math.cos(time * 0.42 + 2) * 8;
          modelData.iphone.rotation.x =
            modelData.iphoneOriginal.rot.x + Math.cos(time * 0.22) * 0.045;
          modelData.iphone.rotation.y =
            modelData.iphoneOriginal.rot.y + Math.sin(time * 0.27) * 0.038;
          modelData.iphone.rotation.z =
            modelData.iphoneOriginal.rot.z + Math.cos(time * 0.32) * 0.028;
        }
      }
    });

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__portfolioScene = {
    scene,
    camera,
    renderer,
    hexFloor,
    projectModels,
    currentProject: 0,
  };

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) cancelAnimationFrame(animationId);

    scene.traverse((child: any) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    });

    if (renderer.domElement.parentNode)
      hexContainer.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__portfolioScene;
  };
}