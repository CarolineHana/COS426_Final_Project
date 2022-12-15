import { Scene, TextureLoader } from 'three';

import BACKGROUND from '../textures/title_screen.jpg';

class MenuScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Set background of title screen
        this.background = new TextureLoader().load(BACKGROUND);
    }
}

export default MenuScene;
