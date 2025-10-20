import { THREE } from "@/lib/animations";
import { getThemeState } from "@/utils/theme-helpers";
import { perfMonitor } from "@/utils/performance-monitor";

export async function initContact3DScene() {
  const measure = perfMonitor.startMeasure("contact:init");
  
  const container = document.querySelector('[data-3d-container="contact"]') as HTMLElement;
  if (!container) {
    measure();
    return;
  }

  const { isLight } = getThemeState();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 50, 600);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1 : 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, isLight ? 0.6 : 0.4);
  dirLight.position.set(100, 200, 100);
  scene.add(dirLight);

  const particles = new THREE.Group();
  const particleCount = 150;
  const particleGeometry = new THREE.SphereGeometry(2, 8, 8);
  
  for (let i = 0; i < particleCount; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: i % 2 === 0 ? 0x02bccc : 0xccff02,
      emissive: i % 2 === 0 ? 0x02bccc : 0xccff02,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.6,
    });

    const particle = new THREE.Mesh(particleGeometry, material);
    
    const radius = 300 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    particle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );

    (particle as any).velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5,
    };

    particles.add(particle);
  }
  
  scene.add(particles);

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;

  const animate = () => {
    time += 0.01;

    particles.rotation.y += 0.001;
    particles.rotation.x = Math.sin(time * 0.3) * 0.1;

    particles.children.forEach((particle: any) => {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      const distance = Math.sqrt(
        particle.position.x ** 2 +
        particle.position.y ** 2 +
        particle.position.z ** 2
      );

      if (distance > 600 || distance < 200) {
        particle.velocity.x *= -1;
        particle.velocity.y *= -1;
        particle.velocity.z *= -1;
      }

      particle.material.opacity = 0.3 + Math.sin(time * 2 + distance * 0.01) * 0.3;
    });

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__contactScene = {
    scene,
    camera,
    renderer,
    particles,
  };

  measure();

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer.domElement.parentNode) container.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__contactScene;
  };
}