import { GAME_CONFIG } from './config.js';

let animationInterval;

export const dom = {
    console: document.getElementById("p"),
    resetBtn: document.getElementById('reset'),
    diceBtn: document.getElementById("acak"),
    modeColumn: document.getElementById("mode"),
    uiTurnCount: document.getElementById("uru"),
    board: document.getElementById('game-board')
};

const displayBoxColor = (id, content) => {
    document.getElementById(id).style.backgroundColor = content;
};

export function resetPlayerDisplay(players) {
    Object.values(players).forEach(p => {
        document.getElementById(p.elementId.box).style.backgroundColor = "transparent";
    });
}

export function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
}

export function animateCell(id, game) {
    displayBoxColor(id, "green");
    let klipkali = true;
    stopAnimation();
    animationInterval = setInterval(() => {
        if (!klipkali) {
            displayBoxColor(id, "green");
            klipkali = true;
        } else {
            displayBoxColor(id, "transparent");
            klipkali = false;
        }
    }, 500);
    if (!game && animationInterval) {
        clearInterval(animationInterval);
        displayBoxColor(id, "transparent");
    }
}

export function createGameBoard() {
    dom.board.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.textContent = i;
        if (GAME_CONFIG.Snakes[i]) {
            cell.classList.add('snake');
        } else if (GAME_CONFIG.Ladders[i]) {
            cell.classList.add('ladder');
        }
        dom.board.appendChild(cell);
    }
}

export function playerCellEL(id, fungsi) {
    document.getElementById(id).addEventListener("click", fungsi);
}