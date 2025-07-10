import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

// Initialize the Pane
const pane = new Pane()

// Initialize the Scene
const scene = new THREE.Scene()

// Initialize the texture loader
const textureLoader = new THREE.TextureLoader()

// Initialize the geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff700
})

const sun = new THREE.Mesh(sphereGeometry, sunMaterial)
sun.scale.setScalar(5)

const earthMaterial = new THREE.MeshBasicMaterial({
  color: 'blue'
})

const earth = new THREE.Mesh(sphereGeometry, earthMaterial)
earth.position.x = 15

const moonMaterial = new THREE.MeshBasicMaterial({
  color: 'gray'
})

const moon = new THREE.Mesh(sphereGeometry, moonMaterial)
moon.scale.setScalar(0.3)
moon.position.x = 2
earth.add(moon)

scene.add(sun)
scene.add(earth)



// Initialize the light
const light = new THREE.AmbientLight('white', 1)
scene.add(light)

const pointLight = new THREE.PointLight('white', 200)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// Initialize the camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 10000)

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

// Initialize a clock
const clock = new THREE.Clock()

// Render the scene
const renderLoop = () => {
  const elapsedTime = clock.getElapsedTime()
  earth.position.x = Math.sin(elapsedTime) * 10
  earth.position.z = Math.cos(elapsedTime) * 10

  moon.position.x = Math.sin(elapsedTime) * 2
  moon.position.z = Math.cos(elapsedTime) * 2


  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop)
}

renderLoop()