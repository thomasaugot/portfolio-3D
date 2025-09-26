import * as THREE from "three";

export async function initHero3DScene() {
  const container = document.querySelector(
    '[data-3d-container="hero"]'
  ) as HTMLElement;
  if (!container) return;

  const THREE = await import("three");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 200, 600);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Subtle white grid
  const gridHelper = new THREE.GridHelper(2000, 50, 0xffffff, 0xffffff);
  gridHelper.position.y = -200;
  (gridHelper.material as THREE.Material).transparent = true;
  (gridHelper.material as THREE.Material).opacity = 0.15;
  scene.add(gridHelper);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  const loader = new (
    await import("three/examples/jsm/loaders/GLTFLoader.js")
  ).GLTFLoader();

  let codeModel: THREE.Group | null = null;
  let laptopModel: THREE.Group | null = null;

  // Load code model
  await new Promise<void>((resolve) => {
    loader.load("/assets/models/code-3D.glb", (gltf) => {
      codeModel = gltf.scene;
      codeModel.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.95,
            metalness: 0.95,
            transmission: 0.9,
            opacity: 0.9,
            ior: 2.5,
            thickness: 5.0,
            clearcoat: 5.0,
            clearcoatRoughness: 0.05,
          });
        }
      });

      codeModel.scale.set(80, 80, 80);

      const setCodeModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        codeModel!.position.set(
          isDesktop ? 350 : 0, // Even more to the right
          20, // Just slightly above the laptop
          -100
        );
      };

      setCodeModelPosition();
      window.addEventListener("resize", setCodeModelPosition);

      scene.add(codeModel);
      resolve();
    });
  });

  // Load laptop model
  await new Promise<void>((resolve) => {
    loader.load("/assets/models/laptop-3D.glb", (gltf) => {
      laptopModel = gltf.scene;
      // Keep original materials with textures from the GLTF file
      laptopModel.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Make screen and keyboard parts much darker
          if (
            child.name === "Screen_Screen_0" ||
            child.name === "Keyboard_Keyboard_0"
          ) {
            child.material.color = new THREE.Color(0x111111); // Very dark
            child.material.emissive = new THREE.Color(0x000000); // No glow for dark parts
            child.material.emissiveIntensity = 0;
          } else {
            // Other parts get normal visibility
            child.material.emissive = new THREE.Color(0x333333);
            child.material.emissiveIntensity = 0.6;
          }

          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.needsUpdate = true;
        }
      });

      laptopModel.scale.set(1000, 1000, 1000);

      const setLaptopModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        laptopModel!.position.set(
          isDesktop ? 250 : 0, // Move laptop to the right too
          -50,
          -100
        );
      };

      setLaptopModelPosition();
      window.addEventListener("resize", setLaptopModelPosition);

      scene.add(laptopModel);
      resolve();
    });
  });

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;

  const animate = () => {
    if (codeModel) {
      codeModel.rotation.y += 0.005; // faster rotation for code model
    }

    if (laptopModel) {
      laptopModel.rotation.y += 0.002; // slower rotation for laptop model
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer.domElement.parentNode)
      container.removeChild(renderer.domElement);
    renderer.dispose();
  };
}
