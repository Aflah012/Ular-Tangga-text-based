import {GAME_CONFIG} from './config.js';

let klipkali = false;

function klip(id) {
    document.getElementById(id).style.backgroundColor = 'green';
    klipkali = true;
    if (GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
    }
    GAME_CONFIG.interval = setInterval(() => {
        if (!klipkali) {
            document.getElementById(id).style.backgroundColor = 'green';
            klipkali = true;
        } else {
            document.getElementById(id).style.background = 'none';
            klipkali = false;
        }
    }, 500);
    if (!GAME_CONFIG.game && GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
        document.getElementById(id).style.background = 'none';
    }
}

export default function selanjutnya(player) {
    if (player === 'A') {
        klip('cp1');
    } else if (player === 'B') {
        klip('cp2');
    } else if (player === 'C') {
        klip('cp3');
    } else if (player === 'D') {
        klip('cp4');
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