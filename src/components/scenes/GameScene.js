import * as THREE from 'three';
import { Land } from 'objects';
import { BaseScene } from './BaseScene';

// Background image
import BACKGROUND from '../textures/yeh-college.jpg';
import BLOCK_TEXTURE from '../textures/steel.jpg';

// Constants
const GROUND_Y = -3;

const BLOCK_LENGTH = 3;
const BLOCK_HEIGHT = 0.5;
const BLOCK_WIDTH = 0.75;
const BLOCK_OFFSET = 0.9;

const NUM_ROWS = 16;

class GameScene extends BaseScene {
    constructor(options) {
        // Call parent BaseScene() constructor
        super(options);

        // Set background to a construction site
        this.background = new THREE.TextureLoader().load(BACKGROUND);

        // Delegate all children to the TopViewScene so that both of them will
        // render (since the top view will be a child of GameScene)
        const children = [];

        const amLight = new THREE.AmbientLight(0x444444);
        children.push(amLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(20, 30, -5);
        dirLight.target.position.copy(this.position);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -30;
        dirLight.shadow.camera.top = -30;
        dirLight.shadow.camera.right = 30;
        dirLight.shadow.camera.bottom = 30;
        dirLight.shadow.camera.near = 20;
        dirLight.shadow.camera.far = 200;
        dirLight.shadow.bias = -0.001;
        dirLight.shadow.bias = dirLight.shadow.bias = 2048;
        dirLight.shadowDarkness = 0.5;
        children.push(dirLight);

        const geometry = new THREE.BoxGeometry(
            BLOCK_LENGTH,
            BLOCK_HEIGHT,
            BLOCK_WIDTH
        );

        const land = new Land(GROUND_Y);
        children.push(land);

        const loader = new THREE.TextureLoader();

        for (let i = 0; i < NUM_ROWS; i++) {
            for (let j = 0; j < 3; j++) {
                const block = new THREE.Mesh(
                    geometry,
                    new THREE.MeshLambertMaterial({
                        map: loader.load(BLOCK_TEXTURE),
                    })
                );
                block.position.y =
                    GROUND_Y + BLOCK_HEIGHT / 2 + BLOCK_HEIGHT * i;
                const offset = BLOCK_OFFSET * (j - 1);
                if (i % 2 === 0) {
                    block.rotation.y = Math.PI / 2;
                    block.position.x = offset;
                } else {
                    block.position.z = offset;
                }
                block.receiveShadow = true;
                block.castShadow = true;
                children.push(block);
            }
        }

        // Add top view
        this.topView = new TopViewScene(children, {
            cameraPosition: [0, 15, 4],
            cameraLookAt: [0, 0, 0],
            canvasId: 'topViewCanvas',
            canvasClassList: ['game-playing-element'],
            controlsOptions: {
                autoRotate: true,
                autoRotateSpeed: 0.5,
                enableDamping: false,
                enablePan: false,
                enableRotate: false,
                enableZoom: false,
            },
        });
        this.add(this.topView);
        this.addRenderChild(this.topView);
    }
}

/**
 * Represents a top visual representation of a GameScene.
 * Basically the same thing, but with a different background.
 */
class TopViewScene extends BaseScene {
    constructor(children, options = {}) {
        super(options);

        // Use a nice sky color
        this.background = new THREE.Color(0x7ec0ee);

        // Add all children from parent
        this.add(...children);
    }

    resize(width, height) {
        // use hardcoded values for now
        super.resize(200, 200);
    }
}

export default GameScene;
