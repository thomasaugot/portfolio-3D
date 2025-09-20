import * as THREE from 'three';

export interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  color: string
  images?: string[]
  url?: string
  github?: string
}

export interface SequenceAnimation {
  selector: string
  frameCount: number
  basePath: string
  trigger: string
  start?: string
  end?: string
}

export interface ThreeScene {
  canvas: HTMLCanvasElement
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
}