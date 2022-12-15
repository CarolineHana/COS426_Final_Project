/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    PCFSoftShadowMap,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GameScene, StartScene } from 'scenes';
import * as handlers from './js/handlers.js';
import * as pages from './js/pages.js';
import './styles.css';

// Set up start menu scene
const startScene = new StartScene();
const startSceneCamera = new PerspectiveCamera();
const startSceneRenderer = new WebGLRenderer({ antialias: true });
startSceneRenderer.setPixelRatio(window.devicePixelRatio);
const startScreenCanvas = startSceneRenderer.domElement;
startScreenCanvas.id = 'startScreenCanvas';
startScreenCanvas.classList.add('start-screen-element');

// Set up game scene
const gameScene = new GameScene();
const gameCamera = new PerspectiveCamera();
gameCamera.position.set(5, 15, 5);
gameCamera.lookAt(new Vector3(0, 0, 0));
const gameRenderer = new WebGLRenderer({ antialias: true });
gameRenderer.setPixelRatio(window.devicePixelRatio);
gameRenderer.shadowMap.enabled = true;
gameRenderer.shadowMap.type = PCFSoftShadowMap;
const gameCanvas = gameRenderer.domElement;
gameCanvas.id = 'gameCanvas';
gameCanvas.classList.add('game-playing-element');

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
topViewCanvas.id = 'topViewCanvas';
topViewCanvas.classList.add('game-playing-element');

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
    // reset the game on menu screen
    if (screens.CURRENT === 'start screen') {
        startSceneRenderer.render(startScene, startSceneCamera);
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
const screens = {
    startScreenCanvas,
    gameCanvas,
    topViewCanvas,
    CURRENT: 'start screen',
};

/**************************EVENT LISTENERS*****************************/
window.addEventListener('keydown', (event) => {
    handlers.handleKeydown(event, screens);
});

/****************************INIT HTML*********************************/
pages.initFonts();
pages.showStartScreen(startScreenCanvas);
