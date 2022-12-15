import * as Dat from 'dat.gui';
import { Scene, PlaneGeometry,MeshBasicMaterial,  TextureLoader, Vector3,Color, AmbientLight, DirectionalLight, BoxGeometry, Mesh, MeshLambertMaterial} from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';

import {Physijs } from 'physijs';

// Background image
import BACKGROUND from '../textures/yeh-college.jpg';
import BLOCKTEXT from '../textures/steel3.jpg';
import wood from '../textures/wood.jpg';

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
		dir_light.shadow.camera.left = -30;
		dir_light.shadow.camera.top = -30;
		dir_light.shadow.camera.right = 30;
		dir_light.shadow.camera.bottom = 30;
		dir_light.shadow.camera.near = 20;
		dir_light.shadow.camera.far = 200;
		dir_light.shadow.bias = -.001
		dir_light.shadow.bias = dir_light.shadow.bias = 2048;
		dir_light.shadowDarkness = .5;
		this.add( dir_light );

        var block_length = 3, block_height = 0.5, block_width = 0.75, block_offset = 0.9,
		geometry = new BoxGeometry( block_length, block_height, block_width );
        

        var i, j;
        this.rows = 16;
        var block;
        this.blocks = [];

        const land = new Land();
        const childMeshes = [land];
        this.add(land);

        var loader = new TextureLoader();
    
        for ( i = 0; i < this.rows; i++ ) {
            for ( j = 0; j < 3; j++ ) {
                block = new Mesh( geometry, new MeshBasicMaterial({ map: loader.load(BLOCKTEXT)}));
                block.position.y = (block_height / 2) + block_height * i - 3;
                if ( i % 2 === 0 ) {
                    block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
                    block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                } else {
                    block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                }
                block.receiveShadow = true;
                block.castShadow = true;
                this.blocks.push( block);
                this.add( block );
                childMeshes.push(block);
            }
        }
        
        this.selected_block;
        this.highlight_block = this.blocks[0];
        this.ind = 0;
        
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
       
        var loader = new TextureLoader();
        this.highlight_block.MeshLambertMaterial = { map: loader.load(wood)}


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
