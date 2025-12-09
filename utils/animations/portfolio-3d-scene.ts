import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import type { SceneConfig } from "@/types/three";
import { getAllProjects } from "@/data/projects";
import { loadCachedGLTF } from "@/utils/model-cache";

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
          const config = getViewportConfig();

          texture.flipY = true;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = config.isDesktop
            ? Math.min(renderer.capabilities.getMaxAnisotropy(), 4)
            : 1;

          if (config.isMobile) {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
          }

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

    const scale = config.isMobile ? 35 : config.isTablet ? 40 : 55;
    model.scale.set(scale, scale, scale);
    model.rotation.y = -0.3;

    const modelY = config.isMobile ? 40 : config.isTablet ? 50 : -25;
    const modelX = config.isMobile ? 10 : config.isTablet ? -15 : -20;
    model.position.set(modelX, modelY, 0);

    const wrapper = new THREE.Group();
    wrapper.add(model);
    scene.add(wrapper);

    return { wrapper, laptopGroup, iphoneGroup };
  } catch (error) {
    console.error(`❌ Error loading model:`, error);
    return null;
  }
};

export async function initPortfolioScene() {
  console.log("🎬 initPortfolioScene: Starting...");

  const hexContainer = document.querySelector(
    '[data-3d-container="portfolio-hex"]'
  ) as HTMLElement;

  if (!hexContainer) {
    console.error("❌ Portfolio hex container not found");
    return;
  }

  const config = getViewportConfig();
  const projects = getAllProjects();

  console.log(`📦 Loading ${projects.length} project models...`);

  const scene = new THREE.Scene();

  const fov = config.isMobile ? 50 : config.isTablet ? 35 : 25;

  const camera = new THREE.PerspectiveCamera(
    fov,
    hexContainer.clientWidth / hexContainer.clientHeight,
    0.1,
    5000
  );

  const cameraX = config.isMobile ? -80 : config.isTablet ? -120 : -200;
  const cameraY = config.isMobile ? 60 : config.isTablet ? 70 : 100;
  const cameraZ = config.isMobile ? 500 : config.isTablet ? 700 : 1000;

  camera.position.set(cameraX, cameraY, cameraZ);

  const lookAtX = config.isMobile ? -10 : config.isTablet ? -30 : -50;
  const lookAtY = config.isMobile ? -60 : config.isTablet ? -60 : 0;
  camera.lookAt(lookAtX, lookAtY, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  });
  renderer.setSize(hexContainer.clientWidth, hexContainer.clientHeight);
  const maxPixelRatio = config.isMobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);

  if (config.isMobile) {
    renderer.shadowMap.enabled = false;
  }

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
  const hexSize = config.isMobile ? 60 : 80;
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
      const hexY = config.isMobile ? -150 : config.isTablet ? -180 : -200;
      hex.position.set(x, hexY, z);

      (hex as any).baseOpacity = opacity * (config.isLight ? 0.6 : 0.4);
      (hex as any).pulseOffset = distance * 0.2;
      (hex as any).gradientFactor = gradientFactor;

      hexFloor.add(hex);
    }
  }

  hexFloor.position.set(lookAtX, 0, 0);
  scene.add(hexFloor);

  const projectModels: Array<{
    wrapper: THREE.Group;
    laptop: THREE.Object3D | null;
    iphone: THREE.Object3D | null;
    laptopOriginal: any;
    iphoneOriginal: any;
  }> = [];

  const loadStartTime = performance.now();

  const modelLoadPromises = projects.map(async (project, i) => {
    const modelPath = MODEL_PATHS[i % MODEL_PATHS.length];

    console.log(
      `📥 Loading project ${i + 1}/${projects.length}: ${project.client}`
    );

    const [laptopTexture, iphoneTexture] = await Promise.all([
      project.media.laptopTexture
        ? loadTexture(renderer, project.media.laptopTexture)
        : Promise.resolve(null),
      project.media.mobileTexture
        ? loadTexture(renderer, project.media.mobileTexture)
        : Promise.resolve(null),
    ]);

    const modelData = await loadModel(
      scene,
      config,
      laptopTexture,
      iphoneTexture,
      modelPath
    );

    if (modelData) {
      const { wrapper, laptopGroup, iphoneGroup } = modelData;

      const wrapperX = config.isMobile ? -10 : config.isTablet ? -10 : -120;
      wrapper.position.set(wrapperX, 0, 0);
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

      return {
        wrapper,
        laptop: laptopGroup,
        iphone: iphoneGroup,
        laptopOriginal,
        iphoneOriginal,
      };
    }
    return null;
  });

  const loadedModels = await Promise.all(modelLoadPromises);

  loadedModels.forEach((modelData) => {
    if (modelData) {
      projectModels.push(modelData);
    }
  });

  const loadDuration = performance.now() - loadStartTime;
  console.log(`✅ All models loaded in ${Math.round(loadDuration)}ms`);

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
  let lastFrameTime = performance.now();
  const targetFPS = config.isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

  const hexColor1 = new THREE.Color(0x02bccc);
  const hexColor2 = new THREE.Color(0xccff02);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (elapsed < frameInterval) {
      return;
    }

    lastFrameTime = now - (elapsed % frameInterval);

    if (document.hidden) {
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
        const floatIntensity = config.isMobile ? 2 : config.isTablet ? 2.5 : 3;
        modelData.wrapper.position.y = Math.sin(time * 0.6) * floatIntensity;

        if (modelData.wrapper.children[0]) {
          const rotationFactor = config.isMobile
            ? 0.8
            : config.isTablet
            ? 0.9
            : 1;
          modelData.wrapper.children[0].rotation.x =
            Math.sin(time * 0.3) * 0.01 * rotationFactor;
          modelData.wrapper.children[0].rotation.z =
            Math.sin(time * 0.25) * 0.008 * rotationFactor;
        }

        if (modelData.laptop && modelData.laptopOriginal) {
          const laptopFloatIntensity = config.isMobile
            ? 2
            : config.isTablet
            ? 2.3
            : 2.5;
          const rotationFactor = config.isMobile
            ? 0.7
            : config.isTablet
            ? 0.85
            : 1;
          modelData.laptop.position.y =
            modelData.laptopOriginal.pos.y +
            Math.sin(time * 0.35) * laptopFloatIntensity;
          modelData.laptop.rotation.x =
            modelData.laptopOriginal.rot.x +
            Math.sin(time * 0.18) * 0.02 * rotationFactor;
          modelData.laptop.rotation.y =
            modelData.laptopOriginal.rot.y +
            Math.cos(time * 0.22) * 0.015 * rotationFactor;
          modelData.laptop.rotation.z =
            modelData.laptopOriginal.rot.z +
            Math.sin(time * 0.26) * 0.01 * rotationFactor;
        }

        if (modelData.iphone && modelData.iphoneOriginal) {
          const iphoneFloatIntensity = config.isMobile
            ? 2
            : config.isTablet
            ? 2.3
            : 2.5;
          const rotationFactor = config.isMobile
            ? 0.7
            : config.isTablet
            ? 0.85
            : 1;
          modelData.iphone.position.y =
            modelData.iphoneOriginal.pos.y +
            Math.cos(time * 0.42 + 2) * iphoneFloatIntensity;
          modelData.iphone.rotation.x =
            modelData.iphoneOriginal.rot.x +
            Math.cos(time * 0.22) * 0.025 * rotationFactor;
          modelData.iphone.rotation.y =
            modelData.iphoneOriginal.rot.y +
            Math.sin(time * 0.27) * 0.02 * rotationFactor;
          modelData.iphone.rotation.z =
            modelData.iphoneOriginal.rot.z +
            Math.cos(time * 0.32) * 0.015 * rotationFactor;
        }
      }
    });

    renderer.render(scene, camera);
  };

  animate();

  (window as any).__portfolioScene = {
    scene,
    camera,
    renderer,
    hexFloor,
    projectModels,
    currentProject: 0,
    isReady: true,
  };

  console.log("🎉 Portfolio scene fully initialized and ready!");

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
