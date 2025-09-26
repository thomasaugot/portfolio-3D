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
  renderer.setClearColor(0x000000, 0); // transparent background
  container.appendChild(renderer.domElement);

  // Solid white grid (not transparent anymore)
  const gridHelper = new THREE.GridHelper(1500, 30, 0xffffff, 0xffffff);
  gridHelper.position.y = -200;
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  // Load model
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

      codeModel.scale.set(100, 100, 100);

      const setModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        codeModel!.position.set(
          isDesktop ? 300 : 0,
          -100,
          -200
        );
      };

      setModelPosition();
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
      codeModel.rotation.y += 0.003;
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
