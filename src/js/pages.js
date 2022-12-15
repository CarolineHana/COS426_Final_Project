import START_INSTRUCTIONS from '../pages/startInstructions.html';
import GAME_COMMANDS from '../pages/gameCommands.html';

const PAUSED_MESSAGE = '<div>Paused</div>';
const GAME_OVER_TEXT = '<div>Game over</div>';

const BACKGROUND_AUDIO_SRC =
    'https://raw.githubusercontent.com/harveyw24/Glider/main/src/sounds/menu.wav';
const PAUSED_AUDIO_SRC =
    'https://raw.githubusercontent.com/harveyw24/Glider/main/src/sounds/interstellar-railway.wav';

const STEEL_AUDIO_SRC =
   'https://raw.githubusercontent.com/CarolineHana/PrincetonJenga/main/src/sounds/steel.wav';

// idea from https://github.com/efyang/portal-0.5/blob/main/src/app.js
// https://github.com/efyang/portal-0.5/blob/main/src/instructions.html

// Global flags
let hadFirstInteraction = false;

export function showStartScreen(startScreenCanvas, isMuted = null) {
    // Clear document body
    document.body.innerHTML = '';

    // Add start screen canvas
    document.body.appendChild(startScreenCanvas);

    // Add the instructions
    const instructionsDiv = document.createElement('div');
    instructionsDiv.classList.add('start-screen-element');
    instructionsDiv.innerHTML = START_INSTRUCTIONS;
    document.body.appendChild(instructionsDiv);

    // Add audio
    const audioElement = document.createElement('audio');
    audioElement.setAttribute('src', BACKGROUND_AUDIO_SRC);
    audioElement.id = 'background-audio';
    audioElement.loop = true;
    audioElement.volume = 0.5;
    document.body.appendChild(audioElement);
    // Add audio
    const steelAudio = document.createElement('audio');
    steelAudio.setAttribute('src', STEEL_AUDIO_SRC);
    steelAudio.id = 'steel';
    steelAudio.loop = false;
    steelAudio.volume = 0.5;
    document.body.appendChild(steelAudio);
  

    if (isMuted != null && !isMuted) {
        audioElement.pause();
        audioElement.play();
    }
}

export function showGameScreen(gameCanvas, topViewCanvas, isMuted) {
    if (!hadFirstInteraction) {
        // the user has interacted with the DOM, so can now start playing music
        // see: https://developer.chrome.com/blog/autoplay/
        hadFirstInteraction = true;
        if (!isMuted) {
            const backgroundAudio = document.getElementById('background-audio');
            backgroundAudio.play();
        }
    }

    // Remove start screen elements
    document
        .querySelectorAll('.start-screen-element')
        .forEach((element) => element.remove());

    // Add game screen elements
    document.body.appendChild(gameCanvas);
    document.body.appendChild(topViewCanvas);

    const scoreCounterDiv = document.createElement('div');
    scoreCounterDiv.id = 'score';
  
    const remindersDiv = document.createElement('div');
    remindersDiv.id = 'reminders';
    remindersDiv.classList.add('game-playing-element');
    remindersDiv.innerHTML = GAME_COMMANDS;
    remindersDiv.prepend(scoreCounterDiv);
    document.body.appendChild(remindersDiv);

    // const fillScreenDiv = document.createElement('div');
    // fillScreenDiv.classList.add('fillScreen');
    // document.body.appendChild(fillScreenDiv);

    // Add hidden paused screen
    const pausedBackground = document.createElement('div');
    pausedBackground.id = 'paused-background';
    pausedBackground.classList.add('fillScreen');

    const pausedMessageDiv = document.createElement('div');
    pausedMessageDiv.id = 'paused-text';
    pausedMessageDiv.classList.add('message-box');
    pausedMessageDiv.innerHTML = PAUSED_MESSAGE;

    const pausedAudio = document.createElement('audio');
    pausedAudio.setAttribute('src', PAUSED_AUDIO_SRC);
    pausedAudio.id = 'paused-audio';
    pausedAudio.loop = true;

    const pausedDiv = document.createElement('div');
    pausedDiv.id = 'paused';
    pausedDiv.classList.add('game-paused-element', 'invisible');
    pausedDiv.appendChild(pausedBackground);
    pausedDiv.appendChild(pausedMessageDiv);
    pausedDiv.appendChild(pausedAudio);
    document.body.appendChild(pausedDiv);
}

export function showPausedScreen(isMuted) {
    // Show hidden paused screen
    const pausedDiv = document.getElementById('paused');
    pausedDiv.classList.remove('invisible');

    if (!isMuted) {
        // Stop background audio
        const backgroundAudio = document.getElementById('background-audio');
        backgroundAudio.pause();

        // Play paused audio
        const pausedAudio = document.getElementById('paused-audio');
        pausedAudio.play();
    }
}

export function hidePausedScreen(isMuted) {
    if (!isMuted) {
        // Stop paused audio
        const pausedAudio = document.getElementById('paused-audio');
        pausedAudio.pause();

        // Play background audio
        const backgroundAudio = document.getElementById('background-audio');
        backgroundAudio.play();
    }

    // Hide paused screen
    const pausedDiv = document.getElementById('paused');
    pausedDiv.classList.add('invisible');
}

export function showGameOverScreen(score) {
    // Remove game playing elements
    document
        .querySelectorAll('.game-playing-element, .game-paused-element')
        .forEach((element) => element.remove());

    // Create game over messages
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over';
    gameOverDiv.classList.add('message-box', 'game-over-element');
    gameOverDiv.innerHTML = GAME_OVER_TEXT;
    document.body.appendChild(gameOverDiv);

    const finalScore = document.getElementById('finalScore');
    finalScore.innerHTML = 'Score: ' + (score !== 'Infinity' ? score : '∞');

    const scoreComment = document.getElementById('scoreComment');
    if (score < 5) scoreComment.innerHTML = 'Were you even trying?';
    else if (score < 15) scoreComment.innerHTML = 'You could do better.';
    else if (score < 30) scoreComment.innerHTML = 'Not too shabby.';
    else if (score < 45)
        scoreComment.innerHTML = 'Maybe you have potential after all.';
    else if (score < 60) scoreComment.innerHTML = "You're a true pilot.";
    else if (score < 75) scoreComment.innerHTML = "I'm impressed!";
    else if (score < 100)
        scoreComment.innerHTML = 'You have transcended the mortal realm.';
    else if (score < 150)
        scoreComment.innerHTML = 'You have surpassed the heavens.';
    else if (score < 200)
        scoreComment.innerHTML =
            "If you've gotten this far...Why are you spending so much time on this game? Go do your PSET or something.";
    else if (score < 250)
        scoreComment.innerHTML = 'How is this score even humanly impossible?';
    else
        scoreComment.innerHTML =
            "Either you're Harvey, you're cheating, or both.";
}

export function initFonts() {
    const FONTS = [
        {
            id: 'titleFont',
            href: 'https://fonts.googleapis.com/css?family=Nabla',
        },
        {
            id: 'font',
            href: 'https://fonts.googleapis.com/css?family=Radio+Canada',
        },
    ];

    for (const font of FONTS) {
        const linkElement = document.createElement('link');
        linkElement.id = font.id;
        linkElement.rel = 'stylesheet';
        linkElement.href = font.href;
        document.head.appendChild(linkElement);
    }
}
