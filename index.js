import * as THREE from 'three';
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'

class A3{
    constructor(body, renderer) {
        this.body = body;
        this.renderer = renderer;
        this.labelRenderer = new CSS2DRenderer();
        this.body.appendChild(this.labelRenderer.domElement);
        this.raycaster = new THREE.Raycaster()
        this.meshList = []
    }
    render(scene, camera){
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer.render(scene, camera);
    }
    createBox(mesh){
        const annotationDiv = document.createElement('div')
        annotationDiv.className = 'annotationLabelClass'
        annotationDiv.id = mesh.name
        annotationDiv.tabIndex = '0'
        
        let boundingBox = new THREE.Box3().setFromObject(mesh)
        let size = boundingBox.getSize()
        annotationDiv.style.width = (size.x).toString() + 'px'
        annotationDiv.style.height = (size.z).toString() + 'px'
        annotationDiv.tabIndex = '0'

        const annotationLabel = new CSS2DObject(annotationDiv)
        annotationLabel.position.set(0, 0, 0)
        mesh.add(annotationLabel)

        this.meshList.push(mesh)
        return mesh
    }
    functWrapper(funct, ...args){
        return function(){ return funct(...args); }
    }
    click(meshes, functs, descriptions, camera){
        document.addEventListener('keydown', (e) => onKeyDown(e, meshes))
        function onKeyDown(e, meshes) {
            let index = meshes.findIndex(m => m.name === document.activeElement.id)
            let annotation = document.getElementById(meshes[index].name)
            annotation.setAttribute('role', 'button')
            for (let i=0; i<meshes.length; i++){
                if (i != index){
                    let annotation = document.getElementById(meshes[i].name) 
                    annotation.innerHTML = ''
                }
            }
            if (e.keyCode == 13) { 
                annotation.innerHTML = descriptions[index]
                functs[index]()
            }   
        }
        this.renderer.domElement.addEventListener('mousemove', (e) => onClick(e, false, false, meshes, this.raycaster, this.renderer, this.meshList, camera));
        this.renderer.domElement.addEventListener('click', (e) => onClick(e, true, false, meshes, this.raycaster, this.renderer, this.meshList, camera));
        this.renderer.domElement.addEventListener('touchstart', (e) => onClick(e, true, true, meshes, this.raycaster, this.renderer, this.meshList, camera));
        function onClick(e, click, touch, meshes, raycaster, renderer, meshList, camera) {
            if (touch){
                e.clientX = e.touches[0].pageX;
                e.clientY = e.touches[0].pageY;
            }
            raycaster.setFromCamera(
                {
                    x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
                    y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
                },
                camera
            );
            const intersects = raycaster.intersectObjects(meshList);
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer'
                for (let i=0; i<meshes.length; i++){
                    let annotation = document.getElementById(meshes[i].name)
                    annotation.setAttribute('role', 'button')
                    if (click){
                        if (intersects[0].object.name == meshes[i].name){
                            functs[i]()
                            annotation.innerHTML = descriptions[i]
                            annotation.focus()
            
                        } else {
                            annotation.innerHTML = ''
                        }
                    }
                }
            } else {
                document.body.style.cursor = 'default'
            }
        }
    }
    hover(meshes, functs, descriptions, camera){
        document.addEventListener('keydown', (e) => onKeyDown(e, meshes))
        function onKeyDown(e, meshes) {
            let index = meshes.findIndex(m => m.name === document.activeElement.id)
            if (index>=0){
                let annotation = document.getElementById(meshes[index+1].name) 
                annotation.setAttribute('role', '') 
                annotation.innerHTML = descriptions[index+1]   
                if (e.keyCode == 9) { 
                    functs[index+1]()
                }
                for (let i=0; i<meshes.length-1; i++){
                    if (i != index){
                        let annotation = document.getElementById(meshes[i+1].name) 
                        annotation.innerHTML = ''
                    }
                }
            }
        
        }
        this.renderer.domElement.addEventListener('pointermove', (e) => onHover(e, meshes, this.raycaster, this.renderer, this.meshList, camera));
        function onHover(e, meshes, raycaster, renderer, meshList, camera) {
            raycaster.setFromCamera(
                {
                    x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
                    y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
                },
                camera
            );
            const intersects = raycaster.intersectObjects(meshList);
            if (intersects.length > 0) {
                for (let i=0; i<meshes.length; i++){
                    let annotation = document.getElementById(meshes[i].name)
                    annotation.setAttribute('role', '')
                    if (intersects[0].object.name == meshes[i].name){
                        functs[i]() 
                        annotation.innerHTML = descriptions[i]
                        annotation.focus()
                    } else {
                        annotation.innerHTML = ''
                    }
                }
            }
        }
    }
}

module.exports = A3;