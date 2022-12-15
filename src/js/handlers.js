import * as pages from './pages.js';

// Global flags
let isMuted = false;

export function handleKeydown(event, screens) {
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
