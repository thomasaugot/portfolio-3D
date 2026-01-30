import { THREE } from "@/lib/three";
import { getViewportConfig } from "@/utils/three/helpers";
import { THEME_COLORS } from "@/utils/colors";
import type { SceneConfig } from "@/utils/three/scene";

const createScene = (container: HTMLElement, config: SceneConfig) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    config.isMobile ? 75 : 60,
    container.clientWidth / container.clientHeight,
    0.1,
    5000
  );

  camera.position.set(0, config.isMobile ? 50 : 30, config.isMobile ? 600 : 800);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile,
    powerPreference: "high-performance",
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  const maxPixelRatio = config.isMobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
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
};

const createHexFloor = (config: SceneConfig) => {
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
        new THREE.Color(THEME_COLORS.primary.hex),
        new THREE.Color(THEME_COLORS.secondary.hex),
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

      group.add(hex);
    }
  }

  return group;
};

export async function initNotFound3DScene() {
  const container = document.querySelector(
    '[data-3d-container="not-found"]'
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
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;

  const hexColor1 = new THREE.Color(THEME_COLORS.primary.hex);
  const hexColor2 = new THREE.Color(THEME_COLORS.secondary.hex);

  const animate = () => {
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    time += 0.01;

    hexFloor.rotation.y = Math.sin(time * 0.3) * 0.05;
    hexFloor.rotation.x = Math.sin(time * 0.2) * 0.02;

    // Update hex colors and opacity
    hexFloor.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);

      material.opacity = (hex as any).baseOpacity + pulse * 0.2;

      const gradientShift =
        Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
      material.color.lerpColors(hexColor1, hexColor2, gradientShift);
    });

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) cancelAnimationFrame(animationId);

    scene.traverse((child: any) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    if (renderer.domElement.parentNode) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };
}
