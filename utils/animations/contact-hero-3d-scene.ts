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

export async function initContactHero3DScene() {
  const measure = perfMonitor.startMeasure("contact-hero:init");

  const container = document.querySelector('[data-3d-container="contact-hero"]') as HTMLElement;
  if (!container) {
    measure();
    return;
  }

  const { isLight } = getThemeState();
  const isMobile = window.innerWidth < 768;
  const lowPerf = isLowPerformanceDevice();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    isMobile ? 65 : 55,
    container.clientWidth / container.clientHeight,
    0.1,
    3000
  );
  camera.position.set(0, 0, isMobile ? 400 : 500);
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

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.6 : 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x02bccc, isLight ? 1.2 : 1.5, 800);
  pointLight1.position.set(-200, 150, 200);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xccff02, isLight ? 1.0 : 1.3, 800);
  pointLight2.position.set(200, -100, 150);
  scene.add(pointLight2);

  // Create network nodes
  const networkGroup = new THREE.Group();
  const nodes: any[] = [];
  const connections: any[] = [];

  const nodeCount = isMobile ? 40 : 60;
  const nodeGeometry = new THREE.SphereGeometry(isMobile ? 2 : 3, 12, 12);

  // Create envelope icon positions for morphing
  const envelopePositions = createEnvelopePositions(nodeCount, isMobile);

  // Create nodes in a sphere pattern
  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;

    const radius = isMobile ? 180 : 250;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: i % 2 === 0 ? 0x02bccc : 0xccff02,
      emissive: i % 2 === 0 ? 0x02bccc : 0xccff02,
      emissiveIntensity: isLight ? 0.2 : 0.3,
      transparent: true,
      opacity: 0.6,
    });

    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(x, y, z);

    (node as any).baseEmissiveIntensity = isLight ? 0.2 : 0.3;
    (node as any).pulseSpeed = 0.5 + Math.random() * 0.5;
    (node as any).pulseOffset = Math.random() * Math.PI * 2;
    (node as any).baseColor = i % 2 === 0 ? 0x02bccc : 0xccff02;
    (node as any).originalPosition = new THREE.Vector3(x, y, z);
    (node as any).envelopePosition = envelopePositions[i];

    networkGroup.add(node);
    nodes.push(node);
  }

  function createEnvelopePositions(count: number, mobile: boolean) {
    const positions: THREE.Vector3[] = [];

    // Collapse point positioned WHERE THE TITLE IS - FAR LEFT
    const singlePoint = new THREE.Vector3(
      mobile ? -200 : -400,  // LEFT side where title is
      mobile ? 30 : 50,       // Title vertical position
      100                      // Forward
    );

    for (let i = 0; i < count; i++) {
      positions.push(singlePoint.clone());
    }

    return positions;
  }

  // Create connections between nearby nodes
  const maxConnectionDistance = isMobile ? 100 : 120;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = nodes[i].position.distanceTo(nodes[j].position);

      if (distance < maxConnectionDistance) {
        const points = [nodes[i].position, nodes[j].position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x02bccc,
          transparent: true,
          opacity: 0.1,
          linewidth: 1,
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        (line as any).nodeA = nodes[i];
        (line as any).nodeB = nodes[j];
        (line as any).baseOpacity = 0.1;

        networkGroup.add(line);
        connections.push(line);
      }
    }
  }

  scene.add(networkGroup);

  // Create hexagon floor
  const hexFloor = new THREE.Group();
  const hexSize = isMobile ? 50 : 60;
  const radius = isMobile ? 6 : 9;

  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(q) > radius || Math.abs(r) > radius || Math.abs(s) > radius) continue;

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
      const gradientFactor = (Math.sin(q * 0.5) + Math.cos(r * 0.5)) * 0.5 + 0.5;

      const color = new THREE.Color().lerpColors(
        new THREE.Color(0x02bccc),
        new THREE.Color(0xccff02),
        gradientFactor
      );

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: opacity * (isLight ? 0.6 : 0.4),
        linewidth: 2,
      });

      const hex = new THREE.Line(geometry, material);
      const x = hexSize * 1.5 * q;
      const z = hexSize * Math.sqrt(3) * (r + q / 2);
      hex.position.set(x, -150, z);

      (hex as any).baseOpacity = opacity * (isLight ? 0.6 : 0.4);
      (hex as any).pulseOffset = distance * 0.2;
      (hex as any).gradientFactor = gradientFactor;

      hexFloor.add(hex);
    }
  }
  scene.add(hexFloor);

  // Particles for ambient effect (reduced prominence)
  const particleCount = lowPerf ? 20 : 40;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities: THREE.Vector3[] = [];

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 600;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 400;

    particleVelocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15
      )
    );
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x02bccc,
    size: isMobile ? 1 : 1.5,
    transparent: true,
    opacity: isLight ? 0.15 : 0.25,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);

  // Interaction state
  let focusedField: string | null = null;
  let networkActivation = 0;
  let isSubmitting = false;
  let messageParticles: any[] = [];

  // Listen for form field focus events
  const handleFieldFocus = (event: any) => {
    focusedField = event.detail?.field || 'active';
    networkActivation = 1;
  };

  const handleFieldBlur = () => {
    focusedField = null;
    networkActivation = 0;
  };

  const handleFormSubmit = () => {
    isSubmitting = true;

    // Create message particles that travel through network
    const messageCount = isMobile ? 15 : 30;
    for (let i = 0; i < messageCount; i++) {
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      const messageGeo = new THREE.SphereGeometry(2, 8, 8);
      const messageMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1,
      });
      const message = new THREE.Mesh(messageGeo, messageMat);
      message.position.copy(startNode.position);

      (message as any).targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      (message as any).progress = 0;
      (message as any).speed = 0.02 + Math.random() * 0.03;
      (message as any).lifetime = 0;

      networkGroup.add(message);
      messageParticles.push(message);
    }

    setTimeout(() => {
      isSubmitting = false;
      messageParticles.forEach(p => networkGroup.remove(p));
      messageParticles = [];
    }, 3000);
  };

  window.addEventListener('contactFieldFocus', handleFieldFocus);
  window.addEventListener('contactFieldBlur', handleFieldBlur);
  window.addEventListener('contactFormSubmit', handleFormSubmit);

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  let animationId: number;
  let time = 0;

  // Pre-create color objects for hexagons
  const hexColor1 = new THREE.Color(0x02bccc);
  const hexColor2 = new THREE.Color(0xccff02);

  const animate = () => {
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    time += 0.01;

    // Rotate network slowly (more subtle)
    networkGroup.rotation.y = time * 0.08;
    networkGroup.rotation.x = Math.sin(time * 0.04) * 0.08;

    // Subtle floor rotation
    hexFloor.rotation.y = Math.sin(time * 0.3) * 0.05;
    hexFloor.rotation.x = Math.sin(time * 0.2) * 0.02;

    // Animate hexagons
    hexFloor.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);
      material.opacity = (hex as any).baseOpacity + pulse * 0.25;

      const gradientShift = Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
      material.color.lerpColors(
        hexColor1,
        hexColor2,
        gradientShift
      );

      // Add subtle position animation for wave effect
      const waveOffset = Math.sin(time * 1.5 + (hex as any).pulseOffset) * 3;
      hex.position.y = -150 + waveOffset;
    });

    // Animate lights
    pointLight1.position.x = -200 + Math.sin(time * 0.3) * 60;
    pointLight1.position.y = 150 + Math.cos(time * 0.25) * 40;
    pointLight2.position.x = 200 + Math.cos(time * 0.28) * 70;
    pointLight2.position.z = 150 + Math.sin(time * 0.32) * 50;

    // Animate nodes
    nodes.forEach((node, index) => {
      const material = node.material as THREE.MeshPhongMaterial;
      const pulse = Math.sin(time * (node as any).pulseSpeed + (node as any).pulseOffset);

      // Base pulsing
      material.emissiveIntensity = (node as any).baseEmissiveIntensity + pulse * 0.2;

      // Enhanced glow when form is focused
      if (focusedField) {
        const targetIntensity = (node as any).baseEmissiveIntensity + 0.8 + pulse * 0.3;
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity,
          targetIntensity,
          0.1
        );
      }

      // Scale animation
      const baseScale = 1;
      const focusScale = focusedField ? 1.3 : 1;
      const targetScale = baseScale * focusScale * (1 + pulse * 0.1);
      node.scale.setScalar(THREE.MathUtils.lerp(node.scale.x, targetScale, 0.1));
    });

    // Animate connections
    connections.forEach((connection) => {
      const material = connection.material as THREE.LineBasicMaterial;

      // Update connection geometry
      const positions = new Float32Array([
        connection.nodeA.position.x,
        connection.nodeA.position.y,
        connection.nodeA.position.z,
        connection.nodeB.position.x,
        connection.nodeB.position.y,
        connection.nodeB.position.z,
      ]);
      connection.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Pulse connections when focused
      if (focusedField) {
        const pulse = Math.sin(time * 3) * 0.5 + 0.5;
        material.opacity = THREE.MathUtils.lerp(
          material.opacity,
          (connection as any).baseOpacity + pulse * 0.3,
          0.1
        );
      } else {
        material.opacity = THREE.MathUtils.lerp(
          material.opacity,
          (connection as any).baseOpacity,
          0.1
        );
      }
    });

    // Animate message particles
    messageParticles = messageParticles.filter((message) => {
      const progress = (message as any).progress;
      const target = (message as any).targetNode;

      message.position.lerp(target.position, (message as any).speed);
      (message as any).progress += (message as any).speed;
      (message as any).lifetime += 0.016;

      const material = message.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - (message as any).lifetime / 3);

      // Change target occasionally
      if (Math.random() < 0.02) {
        (message as any).targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      }

      return (message as any).lifetime < 3;
    });

    // Animate particles
    const positions = particlesGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += particleVelocities[i].x;
      positions[i * 3 + 1] += particleVelocities[i].y;
      positions[i * 3 + 2] += particleVelocities[i].z;

      // Wrap around
      if (Math.abs(positions[i * 3]) > 300) particleVelocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 300) particleVelocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 200) particleVelocities[i].z *= -1;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  (window as any).__contactHeroScene = {
    scene,
    camera,
    renderer,
    networkGroup,
    nodes,
    connections,
    hexFloor,
  };

  measure();

  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener('contactFieldFocus', handleFieldFocus);
    window.removeEventListener('contactFieldBlur', handleFieldBlur);
    window.removeEventListener('contactFormSubmit', handleFormSubmit);
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

    if (renderer.domElement.parentNode) container.removeChild(renderer.domElement);
    renderer.dispose();
    delete (window as any).__contactHeroScene;
  };
}
