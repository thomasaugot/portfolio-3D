import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import type { SceneConfig } from "@/types/three";
import { perfMonitor } from "@/utils/performance-monitor";

const isLowPerformanceDevice = () => {
  if (typeof navigator === 'undefined') return false;
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

const createScene = (container: HTMLElement, config: SceneConfig) => {
  const measure = perfMonitor.startMeasure('about:createScene');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    config.isMobile ? 65 : 55,
    container.clientWidth / container.clientHeight,
    0.1,
    3000
  );

  camera.position.set(
    config.isMobile ? 0 : 200,
    config.isMobile ? 40 : 60,
    config.isMobile ? 450 : 550
  );
  camera.lookAt(0, 0, 0);

  const lowPerf = isLowPerformanceDevice();
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile && !lowPerf,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  const maxPixelRatio = config.isMobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  measure();
  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene, isLight: boolean) => {
  const measure = perfMonitor.startMeasure('about:setupLighting');

  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.8 : 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x02bccc, isLight ? 1.0 : 1.2, 600);
  pointLight1.position.set(-150, 100, 150);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xccff02, isLight ? 0.8 : 1.0, 600);
  pointLight2.position.set(150, -80, 100);
  scene.add(pointLight2);

  measure();
};

const createHexFloor = (config: SceneConfig) => {
  const measure = perfMonitor.startMeasure('about:createHexFloor');

  const group = new THREE.Group();
  const hexSize = config.isMobile ? 60 : 80;
  const radius = config.isMobile ? 6 : 9;

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
      const baseY = config.isMobile ? -150 : -200;

      hex.position.set(x, baseY, z);

      (hex as any).baseOpacity = opacity * (config.isLight ? 0.6 : 0.4);
      (hex as any).baseY = baseY;
      (hex as any).pulseOffset = distance * 0.2;
      (hex as any).gradientFactor = gradientFactor;

      group.add(hex);
    }
  }

  measure();
  return group;
};

// Scroll progress tracker
let scrollProgress = 0;

const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = Math.min(scrollTop / docHeight, 1);
};

export async function initAbout3DScene() {
  console.log("🎓 initAbout3DScene called");
  const initMeasure = perfMonitor.startMeasure('about:init:total');

  const container = document.querySelector(
    '[data-3d-container="about"]'
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

  // Initialize scroll tracking
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  const handleResize = () => {
    const measure = perfMonitor.startMeasure('about:resize');
    const newConfig = getViewportConfig();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    const maxPixelRatio = newConfig.isMobile ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    measure();
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;
  let frameCounter = 0;

  // Pre-create color objects for hexagons
  const hexColor1 = new THREE.Color(0x02bccc);
  const hexColor2 = new THREE.Color(0xccff02);

  const animate = () => {
    // Skip rendering when tab is hidden
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const shouldMeasure = frameCounter % 60 === 0;
    const animateMeasure = shouldMeasure ? perfMonitor.startMeasure('about:animate') : null;

    perfMonitor.updateFPS();
    time += 0.01;

    // Scroll-based floor rotation
    hexFloor.rotation.y = scrollProgress * Math.PI * 0.5 + Math.sin(time * 0.3) * 0.05;
    hexFloor.rotation.x = scrollProgress * 0.3 + Math.sin(time * 0.2) * 0.02;

    // Animate hexagons with scroll-triggered wave effect (every 3 frames in batches)
    if (frameCounter % 3 === 0) {
      const totalHexes = hexFloor.children.length;
      const batchSize = Math.ceil(totalHexes / 5);
      const startIndex = (Math.floor(frameCounter / 3) * batchSize) % totalHexes;
      const endIndex = Math.min(startIndex + batchSize, totalHexes);

      for (let i = startIndex; i < endIndex; i++) {
        const hex = hexFloor.children[i];
        const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;

        // Scroll-based wave effect
        const scrollWave = Math.sin(scrollProgress * Math.PI * 4 + (hex as any).pulseOffset);
        const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);

        // Combine scroll and time-based animation
        const combinedPulse = (scrollWave * 0.4 + pulse * 0.6);
        material.opacity = (hex as any).baseOpacity + combinedPulse * 0.3;

        // Scroll affects color gradient
        const gradientShift =
          (Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5) * (1 - scrollProgress * 0.3);
        material.color.lerpColors(
          hexColor1,
          hexColor2,
          gradientShift + scrollProgress * 0.3
        );

        // Scroll-based position wave
        const positionWave = Math.sin(scrollProgress * Math.PI * 2 + (hex as any).pulseOffset) * 10;
        hex.position.y = (hex as any).baseY + positionWave;
      }
    }

    renderer.render(scene, camera);

    if (animateMeasure) animateMeasure();
    frameCounter++;
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__aboutScene = {
    scene,
    camera,
    renderer,
    hexFloor,
  };

  initMeasure();
  console.log("✅ About scene initialized");

  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", updateScrollProgress);
    if (animationId) cancelAnimationFrame(animationId);

    // Properly dispose all geometries, materials, and textures
    scene.traverse((child: any) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material: any) => {
            material.dispose();
          });
        } else {
          child.material.dispose();
        }
      }
    });

    if (renderer.domElement.parentNode)
      container.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__aboutScene;
  };
}
