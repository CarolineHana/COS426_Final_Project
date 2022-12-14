import * as Dat from 'dat.gui';
import { Scene, TextureLoader, Color } from 'three';
import BACKGROUND from '../textures/title_screen.jpg';

class MenuScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

    
        // Set background to a construction site
        this.background = new TextureLoader().load(BACKGROUND);
    }

       


    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default MenuScene;