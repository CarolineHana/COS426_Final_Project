import { TextureLoader } from 'three';
import { BaseScene } from './BaseScene';

import BACKGROUND from '../textures/title_screen.jpg';

class StartScene extends BaseScene {
    constructor(options) {
        // Call parent BaseScene() constructor
        super(options);

        // Set background of title screen
        this.background = new TextureLoader().load(BACKGROUND);
    }
}

export default StartScene;
