import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

// Initialize the Pane
const pane = new Pane()

// Initialize the Scene
const scene = new THREE.Scene()

// Initialize the geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16)
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)

// Initialize the material
const material = new THREE.MeshBasicMaterial()

// Initialize group
const group = new THREE.Group()

// Initialize the mesh
const cube = new THREE.Mesh(geometry, material)

const knot = new THREE.Mesh(torusKnotGeometry, material)
knot.position.x = 1.5

const plane = new THREE.Mesh(planeGeometry, material)
plane.position.x = -1.5
material.side = THREE.DoubleSide
console.log(material)

const sphere = new THREE.Mesh()
sphere.geometry = sphereGeometry
sphere.material = material
sphere.position.y = 1.5

const cylinder = new THREE.Mesh()
cylinder.geometry = cylinderGeometry
cylinder.material = material
cylinder.position.y = -1.5

// Add meshes to the scene
group.add(cube)
group.add(knot)
group.add(plane)
group.add(sphere, cylinder) // Multiple objects can be added to the same add function

scene.add(group)



// Initialize the light
const light = new THREE.AmbientLight('white', 0.4)
scene.add(light)

const pointLight = new THREE.PointLight('white', 1.2)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// Initialize the camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200)

camera.position.z = 10

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

  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y += 0.01
    }
  })

  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop)
}

renderLoop()