import {GAME_CONFIG} from './config.js';

let klipkali = false;

export const dom = {
    
};

const displayBoxColor = (id, content) => {
    document.getElementById(id).style.backgroundColor = content;
};

function animateCell(id) {
    displayBoxColor(id, "green");
    klipkali = true;
    if (GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
    }
    GAME_CONFIG.interval = setInterval(() => {
        if (!klipkali) {
            displayBoxColor(id, "green");
            klipkali = true;
        } else {
            displayBoxColor(id, "none");
            klipkali = false;
        }
    }, 500);
    if (!GAME_CONFIG.game && GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
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