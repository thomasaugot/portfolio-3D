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
  camera.position.set(0, 200, 800);
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

  // Mouse interaction variables
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isDragging = false;
  let selectedObject: THREE.Group | null = null;
  let dragOffset = new THREE.Vector3();

  const loader = new (
    await import("three/examples/jsm/loaders/GLTFLoader.js")
  ).GLTFLoader();

  let codeModel: THREE.Group | null = null;
  let laptopModel: THREE.Group | null = null;
  let codeWrapper: THREE.Group;
  let laptopWrapper: THREE.Group;

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

      codeModel.scale.set(60, 60, 60);
      codeModel.position.set(0, 0, 0);

      // Create wrapper group for positioning
      codeWrapper = new THREE.Group();
      codeWrapper.add(codeModel);

      const setCodeModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        codeWrapper.position.set(
          isDesktop ? 300 : 0,
          80,
          200 // Brought much closer (was -50)
        );
      };

      setCodeModelPosition();
      window.addEventListener("resize", setCodeModelPosition);

      scene.add(codeWrapper);
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
            child.material.color = new THREE.Color(0x111111);
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          } else {
            child.material.emissive = new THREE.Color(0x333333);
            child.material.emissiveIntensity = 0.6;
          }

          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.needsUpdate = true;
        }
      });

      laptopModel.scale.set(800, 800, 800);
      laptopModel.position.set(0, 0, 0);

      // Create wrapper group for positioning
      laptopWrapper = new THREE.Group();
      laptopWrapper.add(laptopModel);

      const setLaptopModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        laptopWrapper.position.set(
          isDesktop ? 200 : 0,
          -50,
          150 // Brought much closer (was -100)
        );
      };

      setLaptopModelPosition();
      window.addEventListener("resize", setLaptopModelPosition);

      scene.add(laptopWrapper);
      resolve();
    });
  });

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  // Mouse interaction handlers
  const onMouseDown = (event: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (!codeWrapper || !laptopWrapper) return;

    const intersects = raycaster.intersectObjects(
      [codeWrapper, laptopWrapper],
      true
    );

    if (intersects.length > 0) {
      isDragging = true;

      // Find which wrapper was clicked
      let clickedObject = intersects[0].object;
      while (clickedObject.parent && clickedObject.parent.type !== "Scene") {
        clickedObject = clickedObject.parent;
      }

      selectedObject = clickedObject as THREE.Group;

      // Calculate drag offset
      const intersectPoint = intersects[0].point;
      dragOffset.copy(intersectPoint).sub(selectedObject.position);

      container.style.cursor = "grabbing";
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging || !selectedObject) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Project mouse position onto a plane at the object's Z position
    const targetZ = selectedObject.position.z;
    const planePoint = new THREE.Vector3(0, 0, targetZ);
    const planeNormal = new THREE.Vector3(0, 0, 1);
    const plane = new THREE.Plane(planeNormal, -targetZ);

    const intersectPoint = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      selectedObject.position.x = intersectPoint.x - dragOffset.x;
      selectedObject.position.y = intersectPoint.y - dragOffset.y;
    }
  };

  const onMouseUp = () => {
    isDragging = false;
    selectedObject = null;
    container.style.cursor = "default";
  };

  // Add event listeners
  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mouseleave", onMouseUp);

  let animationId: number;

  const animate = () => {
    if (codeModel) {
      codeModel.rotation.y += 0.005;
    }

    if (laptopModel) {
      laptopModel.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener("resize", handleResize);
    container.removeEventListener("mousedown", onMouseDown);
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mouseleave", onMouseUp);
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer.domElement.parentNode)
      container.removeChild(renderer.domElement);
    renderer.dispose();
  };
}
