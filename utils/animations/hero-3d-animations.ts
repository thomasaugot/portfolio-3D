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

  // Load single code model
  const loader = new (
    await import("three/examples/jsm/loaders/GLTFLoader.js")
  ).GLTFLoader();
  let codeModel: THREE.Group | null = null;

  await new Promise<void>((resolve) => {
    loader.load("/assets/models/code-3D.glb", (gltf) => {
      codeModel = gltf.scene;
      codeModel.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, // white base
            roughness: 0.95, // almost smooth
            metalness: 0.95, // slight metallic reflection
            transmission: 0.9, // glass-like transparency (requires WebGL2)
            opacity: 0.9, // fully opaque, but combined with transmission
            ior: 2.5, // index of refraction
            thickness: 5.0, // "depth" of glass
            clearcoat: 5.0, // adds an extra glossy layer
            clearcoatRoughness: 0.05,
          });
        }
      });

      // After loading the model
      codeModel.scale.set(100, 100, 100);

      // Responsive positioning
      const setModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;

        codeModel!.position.set(
          isDesktop ? 300 : 0, // X: right on desktop, center on mobile
          -100, // Y: a bit down
          -200 // Z: slightly behind
        );
      };

      // Initial set
      setModelPosition();

      // Update on resize
      window.addEventListener("resize", setModelPosition);

      scene.add(codeModel);
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
      codeModel.rotation.y += 0.003; // rotate in place
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
