import { Scene, TextureLoader } from 'three';

import BACKGROUND from '../textures/title_screen.jpg';

class StartScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Set background of title screen
        this.background = new TextureLoader().load(BACKGROUND);
    }
}

export default StartScene;
