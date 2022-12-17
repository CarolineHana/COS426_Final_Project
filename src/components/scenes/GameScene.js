import * as THREE from 'three';
import { Land, Block } from 'objects';
import { BaseScene } from './BaseScene';

// Background image
import BACKGROUND from '../textures/yeh-college.jpg';

// Constants
const GROUND_Y = -3;

const BLOCK_HEIGHT = 0.5;
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

        const land = new Land(GROUND_Y);
        children.push(land);

        this.blocks = [];
        for (let i = 0; i < NUM_ROWS; i++) {
            for (let j = 0; j < 3; j++) {
                let yRotation = 0;
                const yPos = GROUND_Y + BLOCK_HEIGHT / 2 + BLOCK_HEIGHT * i;
                let xPos = 0;
                let zPos = 0;
                const offset = BLOCK_OFFSET * (j - 1);
                if (i % 2 === 0) {
                    yRotation = Math.PI / 2;
                    xPos = offset;
                } else {
                    zPos = offset;
                }
                const block = new Block(
                    GROUND_Y,
                    new THREE.Vector3(xPos, yPos, zPos),
                    yRotation
                );
                this.blocks.push(block);
                children.push(block);
            }
        }
        this.rows = 16;
        this.selected_block = null;
        this.highlight_block = this.blocks[0];
        this.ind = 0;
        this.score_num =0; 

        // Add top view
        this.topView = new TopViewScene(children, this.blocks, {
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
    constructor(children, blocks, options = {}) {
        super(options);

        // Use a nice sky color
        this.background = new THREE.Color(0x7ec0ee);

        // Add all children from parent
        this.add(...children);

        this.blocks = blocks;
    }

    resize(width, height) {
        // use hardcoded values for now
        super.resize(200, 200);
    }

    update(dt) {
        // Apply gravity
        for (const block of this.blocks) {
            block.applyGravity(dt);
        }

        // Check for collisions between all blocks, updating positions
        // accordingly
        for (let i = 0; i < this.blocks.length -  3  ; i++) {
                // check for collision between blocks[i] and blocks[j] 
                this.blocks[i].handleCollision(this.blocks[i+3]);
        }

        // for (let i = 0; i < this.blocks.length; i++) {
        //     for (let j = 0; j < this.blocks.length; j++) {
        //         if (i != j ) {
        //             this.blocks[i].handleCollision(this.blocks[j]);
        //         }
        //     }
        // } 

        // Update children
        super.update(dt);
    }
}

export default GameScene;
