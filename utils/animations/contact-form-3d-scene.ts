import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
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

export async function initContactForm3DScene() {
  const measure = perfMonitor.startMeasure("contact-form-3d:init");

  const container = document.querySelector('[data-3d-container="contact-form"]') as HTMLElement;
  if (!container) {
    measure();
    return;
  }

  const { isLight } = getThemeState();
  const isMobile = window.innerWidth < 768;
  const lowPerf = isLowPerformanceDevice();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 200, isMobile ? 400 : 500);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !isMobile && !lowPerf,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  const maxPixelRatio = isMobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.0 : 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, isLight ? 0.6 : 0.4);
  dirLight.position.set(150, 300, 150);
  scene.add(dirLight);

  // Add floating particles
  const particles = new THREE.Group();
  const particleCount = isMobile ? 40 : 80;

  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(isMobile ? 2 : 3, 8, 8);
    const material = new THREE.MeshPhongMaterial({
      color: i % 2 === 0 ? 0x02bccc : 0xccff02,
      emissive: i % 2 === 0 ? 0x02bccc : 0xccff02,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
    });

    const particle = new THREE.Mesh(geometry, material);

    const radius = 200 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    particle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );

    (particle as any).baseY = particle.position.y;
    (particle as any).velocity = {
      x: (Math.random() - 0.5) * 0.3,
      y: (Math.random() - 0.5) * 0.3,
      z: (Math.random() - 0.5) * 0.3,
    };
    (particle as any).rotationSpeed = (Math.random() - 0.5) * 0.02;

    particles.add(particle);
  }
  scene.add(particles);

  const handleResize = () => {
    const newConfig = window.innerWidth < 768;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    const maxPixelRatio = newConfig ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  };
  window.addEventListener("resize", handleResize);

  // Form field focus tracking for interactive effects
  let focusIntensity = 0;
  let targetFocusIntensity = 0;

  const setupFormInteraction = () => {
    const formFields = document.querySelectorAll('[data-form-field] input, [data-form-field] textarea');

    formFields.forEach((field) => {
      field.addEventListener('focus', () => {
        targetFocusIntensity = 1;
      });

      field.addEventListener('blur', () => {
        targetFocusIntensity = 0;
      });

      field.addEventListener('input', (e: any) => {
        const value = e.target.value;
        if (value.length > 0) {
          targetFocusIntensity = Math.min(1, 0.5 + value.length * 0.01);
        }
      });
    });
  };

  // Setup after a small delay to ensure form is rendered
  setTimeout(setupFormInteraction, 100);

  let animationId: number;
  let time = 0;

  const animate = () => {
    // Skip rendering when tab is hidden
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    time += 0.01;

    // Smooth focus intensity transition
    focusIntensity += (targetFocusIntensity - focusIntensity) * 0.05;

    // Animate particles
    particles.rotation.y += 0.002 + focusIntensity * 0.003;
    particles.children.forEach((particle: any) => {
      // Floating motion
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y + focusIntensity * 0.1;
      particle.position.z += particle.velocity.z;

      // Rotation
      particle.rotation.x += particle.rotationSpeed;
      particle.rotation.y += particle.rotationSpeed * 0.7;

      // Boundary check
      const distance = Math.sqrt(
        particle.position.x ** 2 +
        particle.position.y ** 2 +
        particle.position.z ** 2
      );

      if (distance > 400 || distance < 150) {
        particle.velocity.x *= -1;
        particle.velocity.y *= -1;
        particle.velocity.z *= -1;
      }

      // Pulsing opacity and size
      const pulseValue = Math.sin(time * 2 + particle.position.x * 0.01);
      particle.material.opacity = 0.5 + pulseValue * 0.3 + focusIntensity * 0.2;
      const scale = 1 + pulseValue * 0.2 + focusIntensity * 0.3;
      particle.scale.set(scale, scale, scale);
    });

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__contactFormScene = {
    scene,
    camera,
    renderer,
    particles,
  };

  measure();

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) cancelAnimationFrame(animationId);

    // Properly dispose all geometries and materials
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

    if (renderer.domElement.parentNode) container.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__contactFormScene;
  };
}
