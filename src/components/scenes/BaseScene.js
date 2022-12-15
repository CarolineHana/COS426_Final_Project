import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Like a THREE.Scene, but also creates a perspective camera and WebGL renderer
 * for the scene.
 */
export class BaseScene extends THREE.Scene {
    constructor({
        cameraPosition,
        cameraLookAt,
        canvasId,
        canvasClassList,
        controlsOptions,
    } = {}) {
        // Call parent Scene() constructor
        super();

        const camera = new THREE.PerspectiveCamera();
        if (cameraPosition != null) {
            camera.position.set(...cameraPosition);
        }
        if (cameraLookAt != null) {
            camera.lookAt(...cameraLookAt);
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);

        const canvas = renderer.domElement;
        if (canvasId != null) {
            canvas.id = canvasId;
        }
        if (canvasClassList != null) {
            canvas.classList.add(...canvasClassList);
        }

        let controls = null;
        if (controlsOptions != null) {
            controls = new OrbitControls(camera, canvas);
            for (const [key, value] of Object.entries(controlsOptions)) {
                controls[key] = value;
            }
            controls.update();
        }

        this.sceneElements = {
            camera,
            renderer,
            canvas,
            controls,
            renderChildren: [],
        };
    }

    get renderer() {
        return this.sceneElements.renderer;
    }

    get canvas() {
        return this.sceneElements.canvas;
    }

    addRenderChild(child) {
        this.sceneElements.renderChildren.push(child);
    }

    /**
     * Renders this scene with its renderer and camera.
     */
    render() {
        if (this.sceneElements.controls) {
            this.sceneElements.controls.update();
        }
        this.sceneElements.renderer.render(this, this.sceneElements.camera);

        for (const child of this.sceneElements.renderChildren) {
            child.render();
        }
    }

    resize(width, height) {
        this.sceneElements.renderer.setSize(width, height);
        const camera = this.sceneElements.camera;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        for (const child of this.sceneElements.renderChildren) {
            child.resize(width, height);
        }
    }
}
