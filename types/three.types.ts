import { THREE } from "@/lib/animations";

export interface HeroSceneElements {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  hexFloor: THREE.Group;
  codeWrapper: THREE.Group | null;
  laptopWrapper: THREE.Group | null;
  codeModel: THREE.Group | null;
  laptopModel: THREE.Group | null;
}

export interface SceneConfig {
  isLight: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}