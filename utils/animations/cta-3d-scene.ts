import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import type { SceneConfig } from "@/types/three";
import { perfMonitor } from "@/utils/performance-monitor";

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
    config.isMobile ? 50 : 45,
    container.clientWidth / container.clientHeight,
    0.1,
    5000
  );

  camera.position.set(0, 350, 1200);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
};

const setupLighting = (scene: THREE.Scene, isLight: boolean) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.2 : 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, isLight ? 0.8 : 0.6);
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  if (isLight) {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-200, 300, -300);
    scene.add(fillLight);
  }
};

const createHexFloor = (config: SceneConfig) => {
  const group = new THREE.Group();
  const hexSize = config.isMobile ? 60 : 80;
  const radius = config.isMobile ? 6 : 10;

  const color1 = new THREE.Color(0x02bccc);
  const color2 = new THREE.Color(0xccff02);

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
        color1,
        color2,
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
      (hex as any).baseColor = color.clone();

      group.add(hex);
    }
  }

  return group;
};

export function initCTA3DScene() {
  console.log("🎬 initCTA3DScene called");
  
  const container = document.querySelector(
    '[data-3d-container="cta"]'
  ) as HTMLElement;
  if (!container) return;

  const config = getViewportConfig();
  const { scene, camera, renderer } = createScene(container, config);

  setupLighting(scene, config.isLight);

  const hexFloor = createHexFloor(config);
  scene.add(hexFloor);

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;
  let frameCounter = 0;

  const color1 = new THREE.Color(0x02bccc);
  const color2 = new THREE.Color(0xccff02);
  const tempColor = new THREE.Color();

  const animate = () => {
    const shouldMeasure = frameCounter % 60 === 0 && frameCounter > 0;
    const measure = shouldMeasure ? perfMonitor.startMeasure('cta:animate') : null;
    
    perfMonitor.updateFPS();
    time += 0.008;

    const sinTime = Math.sin(time);
    const cosTime = Math.cos(time);

    hexFloor.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const pulseOffset = (hex as any).pulseOffset;
      const gradientFactor = (hex as any).gradientFactor;
      const baseOpacity = (hex as any).baseOpacity;
      
      const pulse = Math.sin(time * 1.5 + pulseOffset);
      material.opacity = baseOpacity + pulse * 0.15;

      const gradientShift = (sinTime * 0.3 + 0.5) * (1 - gradientFactor) + gradientFactor;
      tempColor.lerpColors(color1, color2, gradientShift);
      material.color.copy(tempColor);
    });

    renderer.render(scene, camera);
    
    if (measure) measure();
    frameCounter++;
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__ctaScene = {
    scene,
    camera,
    renderer,
    hexFloor,
  };

  console.log("✅ CTA scene initialized");

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer.domElement.parentNode)
      container.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__ctaScene;
  };
}