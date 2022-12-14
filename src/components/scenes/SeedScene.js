import * as Dat from 'dat.gui';
import { Scene, TextureLoader, Color, AmbientLight, DirectionalLight, BoxGeometry, Mesh, MeshLambertMaterial} from 'three';
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

        var am_light = new AmbientLight( 0x444444 );
		this.add( am_light );

        var dir_light = new DirectionalLight( 0xFFFFFF );
		dir_light.position.set( 20, 30, -5 );
		dir_light.target.position.copy( this.position );
		dir_light.castShadow = true;
		dir_light.shadowCameraLeft = -30;
		dir_light.shadowCameraTop = -30;
		dir_light.shadowCameraRight = 30;
		dir_light.shadowCameraBottom = 30;
		dir_light.shadowCameraNear = 20;
		dir_light.shadowCameraFar = 200;
		dir_light.shadowBias = -.001
		dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
		dir_light.shadowDarkness = .5;
		this.add( dir_light );

        var block_length = 3, block_height = 0.5, block_width = 0.75, block_offset = 0.9,
			geometry = new BoxGeometry( block_length, block_height, block_width );

        var i, j, rows = 16,
        block;

        const land = new Land();
        const childMeshes = [land];
        this.add(land);

    
        for ( i = 0; i < rows; i++ ) {
            for ( j = 0; j < 3; j++ ) {
                block = new Mesh( geometry, new MeshLambertMaterial({color: 0x808080}));
                block.position.y = (block_height / 2) + block_height * i;
                if ( i % 2 === 0 ) {
                    block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
                    block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                } else {
                    block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                }
                block.receiveShadow = true;
                block.castShadow = true;
                this.add( block );
                childMeshes.push(block);
            }
        }

        // Add top view
        this.topView = new TopScene(this, childMeshes, am_light, dir_light);
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
    constructor(parent, childMeshes, am_light, dir_light) {
        super();

        this.state = {
            parent: parent,
        };

        // Use a nice sky color
        this.background = new Color(0x7ec0ee);
        this.add(am_light);
        this.add(dir_light);
        this.add(...childMeshes);
    }

    update(timeStamp) {
        this.rotation.copy(this.state.parent.rotation);
    }
}

export default SeedScene;
