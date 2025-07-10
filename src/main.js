import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

// Initialize the Pane
const pane = new Pane()

// Initialize the Scene
const scene = new THREE.Scene()
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/textures/cubeMap/')
const backgroundCubeMap = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
])
backgroundCubeMap.colorSpace = THREE.SRGBColorSpace
scene.background = backgroundCubeMap

// Initialize the texture loader
const textureLoader = new THREE.TextureLoader()

// Add textures
const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
sunTexture.colorSpace = THREE.SRGBColorSpace
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg')
mercuryTexture.colorSpace = THREE.SRGBColorSpace
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg')
venusTexture.colorSpace = THREE.SRGBColorSpace
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg')
earthTexture.colorSpace = THREE.SRGBColorSpace
const marsTexture = textureLoader.load('textures/2k_mars.jpg')
marsTexture.colorSpace = THREE.SRGBColorSpace
const moonTexture = textureLoader.load('/textures/2k_moon.jpg')
moonTexture.colorSpace = THREE.SRGBColorSpace

// Add materials
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture })
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture })
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture })
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture })
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture })

// Initialize the geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture
})

const sun = new THREE.Mesh(sphereGeometry, sunMaterial)
sun.scale.setScalar(5)
scene.add(sun)

const planets = [
  {
    name: 'Mercury',
    radius: 0.3,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: []
  },
  {
    name: 'Venus',
    radius: 0.6,
    distance: 14,
    speed: 0.007,
    material: venusMaterial,
    moons: []
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: 0.2,
        distance: 3,
        speed: 0.015
      }
    ]
  },
  {
    name: 'Mars',
    radius: 0.7,
    distance: 24,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: 'Phobos',
        radius: 0.01,
        distance: 2,
        speed: 0.02,
        color: 'lightgray'
      },
      {
        name: 'Deimos',
        radius: 0.02,
        distance: 3,
        speed: 0.015,
        color: 'white'
      },
    ]
  },

]

// Create Meshes
const planetMeshes = planets.map((planet) => {
  // Create meshes
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material)
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  // Add it to our scene
  scene.add(planetMesh)
  // Loop through each moon and create the moon
  planet.moons.forEach((moon) => {
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
    moonMesh.scale.setScalar(moon.radius)
    moonMesh.position.x = moon.distance
    // Add moon to planet
    planetMesh.add(moonMesh)
  })
  return planetMesh
})


// Initialize the light
const light = new THREE.AmbientLight('white', 0.3)
scene.add(light)

const pointLight = new THREE.PointLight('daylight', 1000)
pointLight.position.set(0, 0, 0)
scene.add(pointLight)

// Initialize the camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400)

camera.position.z = 50
camera.position.y = 5

// Initialize the renderer
const canvas = document.querySelector('.threejs')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
const maxPixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(maxPixelRatio)

// Instantiate the controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Render the scene
const renderLoop = () => {
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += planets[index].speed * 10
    planet.position.x = Math.sin(planet.rotation.y/10) * planets[index].distance
    planet.position.z = Math.cos(planet.rotation.y/10) * planets[index].distance
    
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[index].moons[moonIndex].speed
      moon.position.x = Math.sin(moon.rotation.y) * planets[index].moons[moonIndex].distance
      moon.position.z = Math.cos(moon.rotation.y) * planets[index].moons[moonIndex].distance
    })
  })
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop)
}

renderLoop()