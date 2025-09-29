import * as THREE from "three";
import { getThemeState } from "@/utils/theme-helpers";

export async function initHero3DScene() {
  const container = document.querySelector(
    '[data-3d-container="hero"]'
  ) as HTMLElement;
  if (!container) return;

  const THREE = await import("three");
  const { isLight } = getThemeState();

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 30, 800);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Hexagon outline floor with gradient borders - WORKING VERSION
  const createHexFloor = () => {
    const group = new THREE.Group();
    
    // Create hexagon outlines in more rectangular pattern
    for (let q = -8; q <= 8; q++) {
      for (let r = -10; r <= 8; r++) { // Extended much further back
        if (Math.abs(q) > 8 || r < -20 || r > 8) continue;
        
        const hexSize = 80;
        
        // Create hexagon outline
        const points = [];
        for (let i = 0; i <= 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          points.push(new THREE.Vector3(
            Math.cos(angle) * hexSize,
            0,
            Math.sin(angle) * hexSize
          ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Distance-based effects for better perspective
        const distance = Math.sqrt(q * q + r * r);
        const opacity = Math.max(0.1, 1 - distance / 20);
        
        // Gradient effect - alternate between your colors based on position
        const gradientFactor = (Math.sin(q * 0.5) + Math.cos(r * 0.5)) * 0.5 + 0.5;
        const color = new THREE.Color().lerpColors(
          new THREE.Color(0x02bccc),  // secondary color
          new THREE.Color(0xccff02),  // primary color
          gradientFactor
        );
        
        const material = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity * (isLight ? 0.6 : 0.4),
          linewidth: 2
        });
        
        const hex = new THREE.Line(geometry, material);
        
        // Convert hex grid to cartesian
        const x = hexSize * 1.5 * q;
        const z = hexSize * Math.sqrt(3) * (r + q / 2);
        
        hex.position.set(x, -200, z);
        
        // Store animation data
        (hex as any).baseOpacity = opacity * (isLight ? 0.6 : 0.4);
        (hex as any).pulseOffset = distance * 0.2;
        (hex as any).gradientFactor = gradientFactor;
        
        group.add(hex);
      }
    }
    
    return group;
  };

  const hexFloor = createHexFloor();
  scene.add(hexFloor);

  // Theme-aware lighting
  const ambientLight = new THREE.AmbientLight(
    isLight ? 0xffffff : 0xffffff, 
    isLight ? 1.2 : 0.9
  );
  scene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(
    isLight ? 0xffffff : 0xffffff, 
    isLight ? 0.8 : 0.6
  );
  dirLight.position.set(200, 500, 300);
  scene.add(dirLight);

  if (isLight) {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-200, 300, -300);
    scene.add(fillLight);
  }

  // Load VS Code texture
  const textureLoader = new THREE.TextureLoader();
  let vscodeTexture: THREE.Texture | null = null;
  let logoTexture: THREE.Texture | null = null;
  
  try {
    vscodeTexture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        '/assets/images/vscode-texture.png',
        (texture) => {
          texture.flipY = false;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          console.log('✅ VS Code texture loaded successfully', texture.image.width + 'x' + texture.image.height);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error('❌ Failed to load VS Code texture:', error);
          reject(error);
        }
      );
    });
  } catch (error) {
    console.warn('⚠️ Could not load VS Code texture, using fallback');
  }

  try {
    logoTexture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        '/assets/images/logo/logo-mobile-gradient.png',
        (texture) => {
          texture.flipY = false;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          console.log('✅ Logo texture loaded successfully');
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error('❌ Failed to load logo texture:', error);
          reject(error);
        }
      );
    });
  } catch (error) {
    console.warn('⚠️ Could not load logo texture, using fallback');
  }

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

  await new Promise<void>((resolve) => {
    loader.load("/assets/models/code-3D.glb", (gltf) => {
      codeModel = gltf.scene;
      codeModel.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: isLight ? 0xf0f0f0 : 0xffffff,
            roughness: isLight ? 0.3 : 0.95,
            metalness: isLight ? 0.1 : 0.95,
            transmission: isLight ? 0.2 : 0.7,
            opacity: isLight ? 0.7 : 1,
            ior: isLight ? 1.5 : 2.5,
            thickness: isLight ? 2.0 : 5.0,
            clearcoat: isLight ? 1.0 : 5.0,
            clearcoatRoughness: isLight ? 0.1 : 0.55,
          });
        }
      });

      codeModel.scale.set(50, 50, 50);
      codeModel.position.set(-100, -100, 0);

      codeWrapper = new THREE.Group();
      codeWrapper.add(codeModel);

      const setCodeModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        codeWrapper.position.set(
          isDesktop ? 300 : 0,
          80,
          200
        );
      };

      setCodeModelPosition();
      window.addEventListener("resize", setCodeModelPosition);

      scene.add(codeWrapper);
      resolve();
    });
  });

  await new Promise<void>((resolve) => {
    loader.load("/assets/models/laptop-logo.glb", (gltf) => {
      laptopModel = gltf.scene;
      
laptopModel.traverse((child: any) => {
  if (child.isMesh) {
    if (child.name === "Screen_Screen_0" && vscodeTexture) {
      child.material = new THREE.MeshBasicMaterial({
        map: vscodeTexture,
        transparent: false,
        opacity: 1.0,
        toneMapped: false
      });
      child.material.needsUpdate = true;
      child.receiveShadow = false;
      child.castShadow = false;
    } else if (child.name === "Keyboard_Keyboard_0") {
      child.material.color = new THREE.Color(isLight ? 0x282828 : 0x181818);
      child.material.emissive = new THREE.Color(0x000000);
      child.material.emissiveIntensity = 0;
    } else if (child.material) {
      child.material.emissive = new THREE.Color(isLight ? 0x4e4e4e : 0x2a2a2a);
      child.material.emissiveIntensity = isLight ? 0.3 : 0.6;
      child.material.transparent = false;
      child.material.opacity = 1.0;
      child.material.needsUpdate = true;
    }
  }
});

      laptopModel.scale.set(60, 60, 60);
      laptopModel.position.set(0, 0, 0);

      laptopWrapper = new THREE.Group();
      laptopWrapper.add(laptopModel);

      const setLaptopModelPosition = () => {
        const isDesktop = window.innerWidth >= 1024;
        laptopWrapper.position.set(
          isDesktop ? 200 : 0,
          -50,
          150
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

      let clickedObject = intersects[0].object;
      while (clickedObject.parent && clickedObject.parent.type !== "Scene") {
        clickedObject = clickedObject.parent;
      }

      selectedObject = clickedObject as THREE.Group;

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

  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mouseleave", onMouseUp);

  let animationId: number;
  let time = 0;

  const animate = () => {
    time += 0.01;
    
    // Animate hexagon gradients and opacity
    hexFloor.children.forEach((hex) => {
      const material = (hex as THREE.Line).material as THREE.LineBasicMaterial;
      const pulse = Math.sin(time * 2 + (hex as any).pulseOffset);
      
      // Animate opacity
      material.opacity = (hex as any).baseOpacity + pulse * 0.2;
      
      // Animate gradient colors
      const gradientShift = Math.sin(time + (hex as any).gradientFactor * Math.PI) * 0.5 + 0.5;
      material.color.lerpColors(
        new THREE.Color(0x02bccc),
        new THREE.Color(0xccff02),
        gradientShift
      );
    });
    if (codeModel) {
      codeModel.rotation.y += isLight ? 0.003 : 0.005;
    }

    if (laptopModel) {
      laptopModel.rotation.y += isLight ? 0.001 : 0.002;
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