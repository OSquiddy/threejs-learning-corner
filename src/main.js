import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()

const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })

const cubeMesh = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial
)

scene.add(cubeMesh)

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 30)

camera.position.z = 5
// scene.add(camera)


const canvas = document.querySelector('.threejs')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
const maxPixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(maxPixelRatio)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.autoRotate = true

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const clock = new THREE.Clock();

let previousTime = 0

const renderLoop = () => {
  // controls.update()

  const currentTime = clock.getElapsedTime()
  const delta = currentTime - previousTime
  previousTime = currentTime


  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop)
}

renderLoop()