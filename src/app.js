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
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

const topViewCamera = new PerspectiveCamera();
const topViewRenderer = new WebGLRenderer({ antialias: true });

// Set up cameras
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

topViewCamera.position.set(0, 10, 5);
topViewCamera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas

topViewRenderer.setPixelRatio(window.devicePixelRatio);
const topViewCanvas = topViewRenderer.domElement;
// Set style
for (const [attr, value] of Object.entries({
    position: 'absolute',
    top: '10px',
    left: '10px',
})) {
    topViewCanvas.style[attr] = value;
}

// Add canvases to document
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);
document.body.appendChild(topViewCanvas);

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

// Make top view camera rotate around the center
const topViewControls = new OrbitControls(topViewCamera, topViewCanvas);
topViewControls.autoRotate = true;
topViewControls.autoRotateSpeed = 0.5;
topViewControls.enableDamping = false;
topViewControls.enablePan = false;
topViewControls.enableRotate = false;
topViewControls.enableZoom = false;
topViewControls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    topViewControls.update();
    renderer.render(scene, camera);
    topViewRenderer.render(scene, topViewCamera);
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

    // TODO: can also resize the top view?
    const topViewWidth = 200;
    const topViewHeight = 200;
    topViewRenderer.setSize(topViewWidth, topViewHeight);
    topViewCamera.aspect = topViewWidth / topViewHeight;
    topViewCamera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
