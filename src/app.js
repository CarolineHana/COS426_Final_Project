/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { PCFSoftShadowMap } from 'three';
import { GameScene, StartScene } from 'scenes';
import * as handlers from './js/handlers.js';
import * as pages from './js/pages.js';
import './styles.css';

// Set up start menu scene
const startScene = new StartScene({
    canvasId: 'startScreenCanvas',
    canvasClassList: ['start-screen-element'],
});

// Set up game scene
// determines the angle that the camera is positioned
// 0 = from top, Math.PI / 2 = level, Math.PI = from bottom
const FIXED_POLAR_ANGLE = Math.PI / 3;
const gameScene = new GameScene({
    cameraPosition: [5, 15, 5],
    cameraLookAt: [0, 0, 0],
    canvasId: 'gameCanvas',
    canvasClassList: ['game-playing-element'],
    controlsOptions: {
        enableDamping: true,
        enablePan: false,
        enableZoom: false,
        minPolarAngle: FIXED_POLAR_ANGLE,
        maxPolarAngle: FIXED_POLAR_ANGLE,
    },
});
gameScene.renderer.shadowMap.enabled = true;
gameScene.renderer.shadowMap.type = PCFSoftShadowMap;

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // reset the game on menu screen
    if (screens.CURRENT === 'start screen') {
        startScene.render();
    } else {
        gameScene.render();
        gameScene.update?.(timeStamp);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerWidth, innerHeight } = window;
    gameScene.resize(innerWidth, innerHeight);
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

/**************************OTHER GLOBAL VARIABLES**********************/
const screens = {
    startScreenCanvas: startScene.canvas,
    gameCanvas: gameScene.canvas,
    topViewCanvas: gameScene.topView.canvas,
    CURRENT: 'start screen',
};

/**************************EVENT LISTENERS*****************************/
window.addEventListener('keydown', (event) => {
    handlers.handleKeydown(event, screens);
});

/****************************INIT HTML*********************************/
window.onload = () => {
    pages.initFonts();
    pages.showStartScreen(screens.startScreenCanvas);
};
