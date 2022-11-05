# a3: Accessibility for Three.js models
[![Version](https://img.shields.io/badge/npm-1.0.1-pink)](https://www.npmjs.com/package/a3model)

a3 aims to improve the accessibility of Three.js models by offering keyboard navigation for hover and click events, focus indication on meshes/objects, mobile touch events, cursor updates, and roles/descriptions for screen readers.

## Installation
``` 
npm install a3model 
```

## Documentation
```c 
import A3 from 'a3model'
```
Begin by initializing the `A3` object with the body DOMElement and renderer.
```c 
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({canvas: canvas})
const body = document.querySelector('body')
const mya3 = new A3(body, renderer);
```
For every mesh or object that you want to make clickable or hoverable, call `createBox`. It is important that you provide an unique name for each of these meshes.
```c
mesh = mya3.createBox(mesh)
```
### Click Events
Meshes with click events will be given the role of a button. To click on a mesh with a keyboard, tab to the mesh and press 'Enter'. Upon hover over with a mouse, the cursor will change from 'default' to 'pointer'. All click events are translated to touch events on mobile devices.

For every click event in your model, identify the mesh, the function that will be called during the click event, and a description for the screen reader. Put these (in order) in three seperate lists: meshes, functions, descriptions, respectively.
```c
mya3.click(meshes, functions, descriptions, camera)
```
For functions, use the functWrapper function to wrap the function and its arguments
```c
mya3.functWrapper(funct, ...args)
```

### Hover Events
To hover on a mesh with a keyboard, press 'Tab'. Similarly to the click event, specify the meshes, functions, and descriptions.
```c
mya3.hover(meshes, functions, descriptions, camera)
```

### Render
Finally, in your animation loop, call `render`.
```c
mya3.render(scene, camera)
```