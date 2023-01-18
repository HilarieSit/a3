# a3: Accessibility for Three.js models
[![Version](https://img.shields.io/badge/npm-v1.0.6-pink)](https://www.npmjs.com/package/a3model)

a3 aims to improve the accessibility of Three.js models by offering keyboard navigation for hover and click events, focus indication on meshes/objects, mobile touch events, cursor updates, and roles/descriptions for screen readers.

## Installation
``` 
npm install a3model 
```

## Documentation
```c 
import A3 from 'a3model'
import 'a3model/src/index.css';
```
Wrap the canvas element with a div element, as shown below.
```c 
<div id='a3canvas'><canvas id='webgl'></canvas></div>
```
Initialize the `A3` object with the canvas DOMElement, renderer, a3canvas DOMElement and renderer size.
```c 
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({canvas: canvas})
const a3canvas = document.getElementbyID('a3canvas')
const sizes = {
    'width': window.innerWidth,
    'height': window.innerHeight
}
const mya3 = new A3(canvas, renderer, a3canvas, sizes);
```
For every mesh or object that you want to make focusable, call `createBox`. It is important that you provide an unique name for each of these meshes. You can specify a role for the mesh, such as "button".
```c
mesh.name = 'uniqueName'
mesh = mya3.createBox(mesh, role=null)
```

<img src="https://github.com/HilarieSit/a3/blob/master/tabexample.gif" width="600" alt="gif demostrating focus of meshes using tab">

### Click Events
To click on a mesh with a keyboard, tab to the mesh and press 'Enter'. Upon hover over with a mouse, the cursor will change from 'default' to 'pointer'. All click events are translated to touch events on mobile devices.

<img src="https://github.com/HilarieSit/a3/blob/master/hoverexample.gif" width="600" alt="gif demostrating cursor change on hover for clickable meshes">

For every click event in your model, identify the mesh name, the function that will be called during the click event, and a description for the screen reader.
```c
mya3.click(meshname, function, description)
```
For the function, use the `functWrapper` function to wrap the function and its arguments.
```c
function = mya3.functWrapper(funct, ...args)
```

### Hover Events
To hover on a mesh with a keyboard, press 'Tab'. Similar to the click event, specify the mesh name, function called during the hover event, and description for the screen reader.
```c
mya3.hover(meshname, function, description)
```
### Update Focus Boxes on Camera Change
For any change to the camera orientation, call `updateBoxes` to update the focus boxes.
```c
mya3.updateBoxes(camera)
```
### Render
If you specified any click or hover events, call `renderEffects`.
```c
mya3.renderEffects(camera)
```
In your animation loop, call `render`.
```c
mya3.render(scene, camera)
```