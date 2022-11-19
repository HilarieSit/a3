import * as THREE from 'three'
import A3 from 'a3model'
import 'a3model/src/index.css'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// A3 
const a3canvas = document.querySelector('#a3canvas');
const mya3 = new A3(canvas, renderer, a3canvas, sizes);

// Scene
const scene = new THREE.Scene()

// Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 10
scene.add(camera)

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
var mesh = new THREE.Mesh(geometry, material)
mesh.name = "mesh"
mesh = mya3.createBox(mesh, "button")
scene.add(mesh)

// A3 Click 
let funct = mya3.functWrapper(changeColor, mesh)
mya3.click(mesh.name, funct, 'mesh color changed on click', camera)

function changeColor(child){
    child.material.color.setHex(Math.random() * 0xffffff);
}

mya3.renderEffects(camera)
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mya3.updateBoxes(camera)
    mya3.render(scene, camera)
};
animate();
