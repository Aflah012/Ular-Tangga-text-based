import {GAME_CONFIG} from './config.js';

let klipkali = false;
let animationInterval;

export const dom = {
    console: document.getElementById("p"),
    resetBtn: document.getElementById('reset'),
    diceBtn: document.getElementById("acak"),
    modeColumn: document.getElementById("mode"),
    uiTurnCount: document.getElementById("uru")
};

const displayBoxColor = (id, content) => {
    document.getElementById(id).style.backgroundColor = content;
};

export function stopAnimation() {
    if(animationInterval) {
        clearInterval(animationInterval);
    }
}

function animateCell(id) {
    displayBoxColor(id, "green");
    klipkali = true;
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    animationInterval = setInterval(() => {
        if (!klipkali) {
            displayBoxColor(id, "green");
            klipkali = true;
        } else {
            displayBoxColor(id, "none");
            klipkali = false;
        }
    }, 500);
    if (!GAME_CONFIG.game && animationInterval) {
        clearInterval(animationInterval);
        displayBoxColor(id, "none");
    }
}

export default function animateNextTurnPlayerCell(player) {
    const key = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].name === player);
    if(key) {
        animateCell(GAME_CONFIG.Players[key].elementId.box);
    }
}

export function createGameBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.textContent = i;
        if (GAME_CONFIG.Snakes[i]) {
            cell.classList.add('snake');
        } else if (GAME_CONFIG.Ladders[i]) {
            cell.classList.add('ladder');
        }
        board.appendChild(cell);
    }
}