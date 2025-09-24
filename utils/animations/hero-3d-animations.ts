export async function initHero3DScene() {
  const container = document.querySelector('[data-3d-container="hero"]') as HTMLElement
  if (!container) return

  const THREE = await import('three')
  
  const scene = new THREE.Scene()
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  )
  camera.position.set(0, 0, 600)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const meshes: any[] = []
  const cubes = [
    { size: 80, color: 0xccff02 },
    { size: 60, color: 0x02bccc },
    { size: 100, color: 0xccff02 },
    { size: 70, color: 0x02bccc },
    { size: 90, color: 0xccff02 }
  ]

  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(cubes[i].size, cubes[i].size, cubes[i].size)
    const edges = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineBasicMaterial({ 
      color: cubes[i].color,
      transparent: true,
      opacity: 0.7
    })
    
    const cube = new THREE.LineSegments(edges, material)
    
    const angle = (i / 5) * Math.PI * 2
    const radius = 400
    cube.position.x = Math.cos(angle) * radius
    cube.position.y = Math.sin(angle) * radius * 0.5
    cube.position.z = (Math.random() - 0.5) * 400
    
    cube.rotation.x = Math.random() * Math.PI
    cube.rotation.y = Math.random() * Math.PI
    
    scene.add(cube)
    meshes.push({
      mesh: cube,
      baseX: cube.position.x,
      baseY: cube.position.y,
      baseZ: cube.position.z,
      speed: Math.random() * 0.5 + 0.3
    })
  }

  const gridHelper = new THREE.GridHelper(2000, 50, 0xccff02, 0x02bccc)
  gridHelper.position.y = -200
  gridHelper.material.transparent = true
  gridHelper.material.opacity = 0.2
  scene.add(gridHelper)

  const handleResize = () => {
    if (!container) return
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  window.addEventListener('resize', handleResize)

  let time = 0
  let animationId: number

  const animate = () => {
    time += 0.01

    meshes.forEach((item, i) => {
      item.mesh.rotation.x += 0.01 * item.speed
      item.mesh.rotation.y += 0.015 * item.speed
      
      item.mesh.position.y = item.baseY + Math.sin(time * item.speed + i) * 50
      item.mesh.position.z = item.baseZ + Math.cos(time * item.speed * 0.5 + i) * 100
    })

    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', handleResize)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (renderer.domElement.parentNode) {
      container.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }
}