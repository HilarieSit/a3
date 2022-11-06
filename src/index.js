import * as THREE from 'three';
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'

class A3{
    constructor(body, canvas, renderer, sizes) {
        this.canvas = canvas
        this.renderer = renderer;
        this.sizes = sizes;
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(this.sizes.width, this.sizes.height)
        body.appendChild(this.labelRenderer.domElement);
        this.raycaster = new THREE.Raycaster()
        
        this.meshList = []
        this.annotationDivList = []
    }
    render(scene, camera){
        this.labelRenderer.domElement.style.top = this.canvas.offsetTop;
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer.render(scene, camera);
    }
    createBox(mesh){
        const annotationDiv = document.createElement('div')
        annotationDiv.className = 'annotationLabelClass'
        annotationDiv.id = mesh.name
        annotationDiv.tabIndex = '0'

        const annotationLabel = new CSS2DObject(annotationDiv)
        annotationLabel.position.set(0, 0, 0)
        mesh.add(annotationLabel)

        this.annotationDivList.push(annotationDiv)
        this.meshList.push(mesh)
        return mesh
    }
    updateBoxes(camera){
        for (let i=0; i<this.annotationDivList.length; i++){
            let size = new THREE.Vector3()
            let boundingBox = new THREE.Box3().setFromObject(this.meshList[i])
            boundingBox.getSize(size)

            var vFOV = camera.fov * Math.PI / 180;
            var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
            var aspect = this.sizes.width / this.sizes.height;
            var w = h * aspect;
            
            const pixelSizeWidth = this.sizes.width * ((1 / w) * size.x)
            const pixelSizeHeight = this.sizes.height * ((1 / h) * size.z)
            this.annotationDivList[i].style.width = (pixelSizeWidth).toString() + 'px'
            this.annotationDivList[i].style.height = (pixelSizeHeight).toString() + 'px'
        }
    }
    functWrapper(funct, ...args){
        return function(){ return funct(...args); }
    }
    click(meshes, functs, descriptions, camera){
        document.addEventListener('keydown', (e) => onKeyDown(e, meshes))
        function onKeyDown(e, meshes) {
            let index = meshes.findIndex(m => m === document.activeElement.id)
            let annotation = document.getElementById(meshes[index])
            annotation.setAttribute('role', 'button')
            for (let i=0; i<meshes.length; i++){
                if (i != index){
                    let annotation = document.getElementById(meshes[i]) 
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
                    let annotation = document.getElementById(meshes[i])
                    annotation.setAttribute('role', 'button')
                    if (click){
                        if (intersects[0].object.name == meshes[i]){
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
            let index = meshes.findIndex(m => m === document.activeElement.id)
            if (index>=0){
                let annotation = document.getElementById(meshes[index+1]) 
                annotation.setAttribute('role', '') 
                annotation.innerHTML = descriptions[index+1]   
                if (e.keyCode == 9) { 
                    functs[index+1]()
                }
                for (let i=0; i<meshes.length-1; i++){
                    if (i != index){
                        let annotation = document.getElementById(meshes[i+1]) 
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
                    let annotation = document.getElementById(meshes[i])
                    annotation.setAttribute('role', '')
                    if (intersects[0].object.name == meshes[i]){
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

export default A3;