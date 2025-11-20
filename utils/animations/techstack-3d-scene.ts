import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import type { SceneConfig } from "@/types/three";

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
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );

  camera.position.set(0, 0, 400);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.isMobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene, isLight: boolean) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.6 : 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x02bccc, 1, 800);
  pointLight.position.set(0, 100, 200);
  scene.add(pointLight);

  return { pointLight };
};

// Create just 3 minimal shapes
const createMinimalShapes = (config: SceneConfig) => {
  const group = new THREE.Group();
  const shapes: THREE.Mesh[] = [];

  // Large central icosahedron
  const geo1 = new THREE.IcosahedronGeometry(80, 1);
  const mat1 = new THREE.MeshBasicMaterial({
    color: 0x02bccc,
    transparent: true,
    opacity: 0.08,
    wireframe: true,
  });
  const shape1 = new THREE.Mesh(geo1, mat1);
  shape1.position.set(0, 0, -100);
  (shape1 as any).rotationSpeed = { x: 0.001, y: 0.002 };
  group.add(shape1);
  shapes.push(shape1);

  // Smaller octahedron offset left
  const geo2 = new THREE.OctahedronGeometry(40, 0);
  const mat2 = new THREE.MeshBasicMaterial({
    color: 0xccff02,
    transparent: true,
    opacity: 0.06,
    wireframe: true,
  });
  const shape2 = new THREE.Mesh(geo2, mat2);
  shape2.position.set(-150, -50, -50);
  (shape2 as any).rotationSpeed = { x: 0.002, y: -0.001 };
  group.add(shape2);
  shapes.push(shape2);

  // Smaller tetrahedron offset right
  const geo3 = new THREE.TetrahedronGeometry(35, 0);
  const mat3 = new THREE.MeshBasicMaterial({
    color: 0x02bccc,
    transparent: true,
    opacity: 0.06,
    wireframe: true,
  });
  const shape3 = new THREE.Mesh(geo3, mat3);
  shape3.position.set(150, 50, -50);
  (shape3 as any).rotationSpeed = { x: -0.001, y: 0.002 };
  group.add(shape3);
  shapes.push(shape3);

  return { group, shapes };
};

let scrollProgress = 0;
let sectionVisible = false;

const updateScrollProgress = () => {
  const section = document.querySelector('[data-tech-stack-3d]');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  sectionVisible = rect.top < windowHeight && rect.bottom > 0;

  scrollProgress = Math.max(0, Math.min(1,
    (windowHeight - rect.top) / (windowHeight + rect.height)
  ));
};

export async function initTechStack3DScene() {
  const container = document.querySelector(
    '[data-3d-container="techstack"]'
  ) as HTMLElement;
  if (!container) return;

  const config = getViewportConfig();
  const { scene, camera, renderer } = createScene(container, config);
  setupLighting(scene, config.isLight);

  const { group: shapesGroup, shapes } = createMinimalShapes(config);
  scene.add(shapesGroup);

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;

  const animate = () => {
    if (document.hidden || !sectionVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    // Simple scroll-driven rotation
    shapes.forEach((shape) => {
      const data = shape as any;
      shape.rotation.x += data.rotationSpeed.x;
      shape.rotation.y += data.rotationSpeed.y;
    });

    // Subtle scene rotation based on scroll
    shapesGroup.rotation.y = scrollProgress * Math.PI * 0.3;

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", updateScrollProgress);
    if (animationId) cancelAnimationFrame(animationId);

    scene.traverse((child: any) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });

    if (renderer.domElement.parentNode) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };
}
