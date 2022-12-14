/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene,MenuScene } from 'scenes';
import *  as handlers from './js/handlers.js';
import * as pages from "./js/pages.js";
import './styles.css';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

//menu scene
const menuScene = new MenuScene();
const menuCamera = new PerspectiveCamera();
const menuRenderer = new WebGLRenderer({ antialias: true });
menuCamera.position.set(-0.5, 0.5, -3)
menuCamera.lookAt(new Vector3(-2, 0.5, 0))

menuRenderer.setPixelRatio(window.devicePixelRatio);
const menuCanvas = menuRenderer.domElement;
menuCanvas.id = 'menuCanvas';
menuCanvas.style.display = 'block'; // Removes padding below canvas

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.id = 'canvas';
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// determines the angle that the camera is positioned
// 0 = from top, Math.PI / 2 = level, Math.PI = from bottom
const FIXED_POLAR_ANGLE = Math.PI / 3;
// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = FIXED_POLAR_ANGLE;
controls.maxPolarAngle = FIXED_POLAR_ANGLE;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
     // reset the game on menu screen
     if (screens['menu']) {
        menuRenderer.render(menuScene, menuCamera)

    }
    controls.update();
    renderer.render(scene, camera);
    scene.update?.(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
/**************************OTHER GLOBAL VARIABLES**********************/
const screens = { "menu": true, "ending": false, "pause": false };


/**************************EVENT LISTENERS*****************************/
window.addEventListener('keydown', event => handlers.handleScreens(event, screens, document, canvas));

/****************************INIT HTML*********************************/
pages.init_fonts(document);
pages.init_page(document, menuCanvas);
