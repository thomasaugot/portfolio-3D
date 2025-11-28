import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let hexFloor: THREE.Group | null = null;
let animationId: number | null = null;

const getViewportConfig = () => {
  const width = window.innerWidth;
  const { isLight } = getThemeState();

  return {
    isLight,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

const createHexFloor = (config: any) => {
  const group = new THREE.Group();
  const hexSize = config.isMobile ? 50 : 70;
  const radius = config.isMobile ? 7 : 10;

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

      hex.position.set(x, config.isMobile ? -150 : -200, z);

      (hex as any).baseOpacity = opacity * (config.isLight ? 0.6 : 0.4);
      (hex as any).pulseOffset = distance * 0.2;
      (hex as any).gradientFactor = gradientFactor;

      group.add(hex);
    }
  }

  return group;
};

export async function initBlog3DDataStream() {
  const container = document.querySelector('[data-3d-container="blog"]');
  if (!container) return;

  const config = getViewportConfig();

  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    config.isMobile ? 75 : 60,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  camera.position.set(
    0,
    config.isMobile ? 100 : 150,
    config.isMobile ? 500 : 700
  );
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !config.isMobile,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, config.isLight ? 1.2 : 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, config.isLight ? 0.8 : 0.6);
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  if (config.isLight) {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-200, 300, -300);
    scene.add(fillLight);
  }

  // Create hex floor
  hexFloor = createHexFloor(config);
  scene.add(hexFloor);

  // Store scene references for external access
  (window as any).__blogScene = {
    scene,
    camera,
    renderer,
    hexFloor,
  };

  // Animation loop
  let time = 0;
  const hexColor1 = new THREE.Color(0x02bccc);
  const hexColor2 = new THREE.Color(0xccff02);

  function animate() {
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    animationId = requestAnimationFrame(animate);
    time += 0.01;

    // Animate hex floor with gentle rotation and pulsing
    if (hexFloor) {
      hexFloor.rotation.y = Math.sin(time * 0.3) * 0.05;
      hexFloor.rotation.x = Math.sin(time * 0.2) * 0.02;

      // Update hex colors with pulsing effect
      hexFloor.children.forEach((hex) => {
        const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
        const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);
        material.opacity = (hex as any).baseOpacity + pulse * 0.2;

        const gradientShift =
          Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
        material.color.lerpColors(hexColor1, hexColor2, gradientShift);
      });
    }

    // Render
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  animate();

  // Handle resize
  const handleResize = () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  // Cleanup function
  return () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }

    window.removeEventListener("resize", handleResize);

    if (renderer && container) {
      container.removeChild(renderer.domElement);
      renderer.dispose();
    }

    if (hexFloor) {
      hexFloor.children.forEach((hex) => {
        if (hex instanceof THREE.Line) {
          hex.geometry.dispose();
          (hex.material as THREE.Material).dispose();
        }
      });
    }

    delete (window as any).__blogScene;

    scene = null;
    camera = null;
    renderer = null;
    hexFloor = null;
  };
}

// Export for external animations
export const getBlogCamera = () => camera;
export const getBlogScene = () => scene;
export const getHexFloor = () => hexFloor;
