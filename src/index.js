import * as THREE from 'three';
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'

class A3{
    constructor(canvas, renderer, a3canvas, sizes) {
        this.canvas = canvas
        this.renderer = renderer;
        this.sizes = sizes;
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(this.sizes.width, this.sizes.height)
        a3canvas.appendChild(this.labelRenderer.domElement);
        this.raycaster = new THREE.Raycaster()
        
        this.meshList = []
        this.annotationDivList = []
        this.clickList = []
        this.hoverList = []
    }
    render(scene, camera){
        this.labelRenderer.domElement.style.top = this.canvas.offsetTop;
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer.render(scene, camera);
    }
    createBox(mesh, role=null){
        const annotationDiv = document.createElement('div')
        annotationDiv.className = 'annotationLabelClass'
        annotationDiv.id = mesh.name
        annotationDiv.tabIndex = '0'
        if (role != null){
            annotationDiv.setAttribute('role', role)
        }

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
    click(meshname, funct, description){
        this.clickList.push({'mesh': meshname, 'funct': funct, 'description': description})
    }
    hover(meshname, funct, description){
        this.hoverList.push({'mesh': meshname, 'funct': funct, 'description': description})
    }
    renderEffects(camera){
        document.addEventListener('keydown', (e) => onKeyDown(e, this.clickList, this.hoverList))
        function onKeyDown(e, clickList, hoverList) {
            let cIndex = clickList.findIndex(m => m.mesh === document.activeElement.id)
            let hIndex = hoverList.findIndex(m => m.mesh === document.activeElement.id)
            if (e.keyCode == 9) {
                let hoverAnnotation = document.getElementById(hoverList[hIndex+1].mesh)
                hoverAnnotation.innerHTML = hoverList[hIndex+1].description
                hoverList[hIndex+1].funct()
            }
            if (e.keyCode == 13) { 
                if (cIndex >= 0){
                    let clickAnnotation = document.getElementById(clickList[cIndex].mesh)
                    clickAnnotation.innerHTML = clickList[cIndex].description
                    setTimeout(function(clickAnnotation){
                        clickAnnotation.innerHTML = ''
                    }, 500, clickAnnotation)
                    clickAnnotation.click()
                    clickList[cIndex].funct()
                }
            }   
        }
        this.renderer.domElement.addEventListener('mousemove', (e) => onClick(e, this.clickList, this.hoverList, this.raycaster, this.renderer, this.meshList, camera));
        this.renderer.domElement.addEventListener('click', (e) => onClick(e, this.clickList, this.hoverList, this.raycaster, this.renderer, this.meshList, camera));
        this.renderer.domElement.addEventListener('touchstart', (e) => onClick(e, this.clickList, this.hoverList, this.raycaster, this.renderer, this.meshList, camera));
        function onClick(e, clickList, hoverList, raycaster, renderer, meshList, camera) {
            console.log(e.type)
            if (e.type == "touchstart"){
                e.clientX = e.touches[0].pageX;
                e.clientY = e.touches[0].pageY;
            }
            raycaster.setFromCamera(
                {
                    x: (e.offsetX / renderer.domElement.clientWidth) * 2 - 1,
                    y: -(e.offsetY / renderer.domElement.clientHeight) * 2 + 1,
                },
                camera
            );
            const intersects = raycaster.intersectObjects(meshList);
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer'
                for (let i=0; i<clickList.length; i++){
                    let clickAnnotation = document.getElementById(clickList[i].mesh)
                    if (e.type == "click"){
                        if (intersects[0].object.name == clickList[i].mesh){
                            clickList[i].funct()
                            clickAnnotation.innerHTML = clickList[i].description
                            setTimeout(function(clickAnnotation){
                                clickAnnotation.innerHTML = ''
                            }, 500, clickAnnotation)
                            clickAnnotation.focus()
                        }
                    }
                let hIndex = hoverList.findIndex(m => m.mesh === intersects[0].object.name)
                if (hIndex > -1){
                    let hoverAnnotation = document.getElementById(hoverList[i].mesh)
                    hoverList[hIndex].funct()
                    hoverAnnotation.innerHTML = hoverList[hIndex].description
                    hoverAnnotation.click()
                    }
                }
            } else {
                document.body.style.cursor = 'default'
            }
        }
    }
}

export default A3;