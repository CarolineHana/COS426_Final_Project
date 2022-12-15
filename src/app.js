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
import { SeedScene, MenuScene } from 'scenes';
import * as handlers from './js/handlers.js';
import * as pages from './js/pages.js';
import './styles.css';

// Make CSS adjustments to page
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling

// Set up start menu scene
const menuScene = new MenuScene();
const menuCamera = new PerspectiveCamera();
menuCamera.position.set(-0.5, 0.5, -3);
menuCamera.lookAt(new Vector3(-2, 0.5, 0));
const menuRenderer = new WebGLRenderer({ antialias: true });
menuRenderer.setPixelRatio(window.devicePixelRatio);
const menuCanvas = menuRenderer.domElement;
menuCanvas.id = 'menuCanvas';
menuCanvas.style.display = 'block'; // Removes padding below canvas

// Set up game scene
const gameScene = new SeedScene();
const gameCamera = new PerspectiveCamera();
gameCamera.position.set(10, -5, -10);
gameCamera.lookAt(new Vector3(0, 0, 0));
const gameRenderer = new WebGLRenderer({ antialias: true });
gameRenderer.setPixelRatio(window.devicePixelRatio);
const gameCanvas = gameRenderer.domElement;
gameCanvas.id = 'canvas';
gameCanvas.style.display = 'block'; // Removes padding below canvas
document.body.appendChild(gameCanvas);

// Set up game controls
// determines the angle that the camera is positioned
// 0 = from top, Math.PI / 2 = level, Math.PI = from bottom
const FIXED_POLAR_ANGLE = Math.PI / 3;
const gameControls = new OrbitControls(gameCamera, gameCanvas);
gameControls.enableDamping = true;
gameControls.enablePan = false;
gameControls.enableZoom = false;
gameControls.minPolarAngle = FIXED_POLAR_ANGLE;
gameControls.maxPolarAngle = FIXED_POLAR_ANGLE;
gameControls.update();

// Set up top view
const topViewCamera = new PerspectiveCamera();
topViewCamera.position.set(0, 15, 4);
topViewCamera.lookAt(new Vector3(0, 0, 0));
const topViewRenderer = new WebGLRenderer({ antialias: true });
topViewRenderer.setPixelRatio(window.devicePixelRatio);
const topViewCanvas = topViewRenderer.domElement;
for (const [attr, value] of Object.entries({
    position: 'absolute',
    top: '10px',
    right: '10px',
})) {
    topViewCanvas.style[attr] = value;
}
document.body.appendChild(topViewCanvas);

// Make top view camera rotate around the center
const topViewControls = new OrbitControls(topViewCamera, topViewCanvas);
topViewControls.autoRotate = true;
topViewControls.autoRotateSpeed = 0.5;
topViewControls.enableDamping = false;
topViewControls.enablePan = false;
topViewControls.enableRotate = true;
topViewControls.enableZoom = false;
topViewControls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // reset the game on menu screen
    if (screens['menu']) {
        menuRenderer.render(menuScene, menuCamera);
    } else {
        gameControls.update();
        topViewControls.update();
        gameRenderer.render(gameScene, gameCamera);
        topViewRenderer.render(gameScene.topView, topViewCamera);
        gameScene.update?.(timeStamp);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    gameRenderer.setSize(innerWidth, innerHeight);
    gameCamera.aspect = innerWidth / innerHeight;
    gameCamera.updateProjectionMatrix();

    // TODO: can also resize the top view?
    const topViewWidth = 200;
    const topViewHeight = 200;
    topViewRenderer.setSize(topViewWidth, topViewHeight);
    topViewCamera.aspect = topViewWidth / topViewHeight;
    topViewCamera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

/**************************OTHER GLOBAL VARIABLES**********************/
const screens = { menu: true, ending: false, pause: false };

/**************************EVENT LISTENERS*****************************/
window.addEventListener('keydown', (event) => {
    handlers.handleScreens(
        event,
        screens,
        document,
        menuCanvas,
        gameCanvas,
        topViewCanvas
    );
});

/****************************INIT HTML*********************************/
pages.init_fonts(document);
pages.init_page(document, menuCanvas);
