import * as pages from './pages.js';

// maintan boolens to keep track if buffer period is active and if
// game is muted
let buffer = false;
let mute = false;
let j= 0;

// timer for timeout functions

// Global flags
let isMuted = false;

export function handleKeydown(event, screens, scene) {
    const key = event.key;

    // Global key presses

    // Mute
    if (key === 'm') {
        const audioId =
            screens.CURRENT === 'game paused' ? 'paused' : 'background';
        const audio = document.getElementById(audioId + '-audio');
        if (isMuted) {
            isMuted = false;
            audio.play();
        } else {
            isMuted = true;
            audio.pause();
        }
    }

    // Restart
    else if (key === 'r') {
        if (screens.CURRENT !== 'start screen') {
            pages.showStartScreen(screens.startScreenCanvas, isMuted);
            screens.CURRENT = 'start screen';
        }
    }

    // Starting the game
    else if (screens.CURRENT === 'start screen') {
        // Start
        if (key === ' ') {
            pages.showGameScreen(
                screens.gameCanvas,
                screens.topViewCanvas,
                isMuted
            );
            screens.CURRENT = 'game playing';
        }
    }

    // Playing the game
    else if (screens.CURRENT === 'game playing') {
        // Pause
        if (key === ' ') {
            pages.showPausedScreen(isMuted);
            screens.CURRENT = 'game paused';
        }

        else if (key == 'ArrowRight' && screens.CURRENT === 'game playing') {
            if(scene.ind < 47){
                scene.ind += 1;
                scene.highlight_block = scene.blocks[scene.ind];
            }
            console.log(scene.ind); 
            console.log(scene.blocks); 
            // need to somehow rotate bounding box
        }
        else if (key == 'ArrowLeft' && screens.CURRENT === 'game playing') {
            if(scene.ind > 0){
                scene.ind -= 1;
                scene.highlight_block = scene.blocks[scene.ind];
            }
           
        }
    
        else if (key == 'Enter' && screens.CURRENT === 'game playing') {
            var block_length = 3, block_height = 0.5, block_width = 0.75, block_offset = 0.9;
            scene.selected_block = scene.blocks[scene.ind];
            scene.selected_block.position.y = (block_height / 2) + block_height * scene.rows - 3  ;
            if ( scene.rows % 2 === 0 ) {
                scene.selected_block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
                scene.selected_block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
            } else {
                scene.block.position.z = block_offset * j - (block_offset * 3 / 2 - block_offset / 2 );
            }
            if(j == 2){
                j = 0;
                scene.rows+=1;  
            }
            j += 1;
            const audio = document.getElementById('steel');
            audio.play();
        } 
    }

    // Game paused
    else if (screens.CURRENT === 'game paused') {
        // Unpause
        if (key === ' ') {
            pages.hidePausedScreen(isMuted);
            screens.CURRENT = 'game playing';
        }
    }

    // Game over
    else if (screens.CURRENT === 'game over') {
        if (key === ' ') {
            pages.showStartScreen(screens.startScreenCanvas, isMuted);
            screens.CURRENT = 'start screen';
        }
    }
    
}
