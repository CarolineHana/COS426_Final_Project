import * as Dat from 'dat.gui';
import { Scene, TextureLoader, Color } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';


// Background image
import BACKGROUND from '../textures/yeh-college.jpg';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        }

        // Set background to a construction site
        this.background = new TextureLoader().load(BACKGROUND);

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        // Pass meshes to top view, so that they are children of both scenes
        const childMeshes = [land, flower, lights];

        // Add top view
        this.topView = new TopScene(this, childMeshes);
        this.add(this.topView);

        

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5).setValue(0);
    }
      // Create scenes
      create() {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(640, 480);
        // Initialize dictionary of scenes
   

        this.currentScene.addEvents();
      }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

/**
 * Represents a top visual representation of a SeedScene.
 * Basically the same thing, but with a different background.
 */
class TopScene extends Scene {
    constructor(parent, childMeshes) {
        super();

        this.state = {
            parent: parent,
        };

        // Use a nice sky color
        this.background = new Color(0x7ec0ee);
        this.add(...childMeshes);
    }

    update(timeStamp) {
        this.rotation.copy(this.state.parent.rotation);
    }
}

export default SeedScene;
