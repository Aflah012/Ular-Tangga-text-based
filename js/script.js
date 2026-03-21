import {
    GAME_CONFIG
} from "./config.js";
import {playerCellEL, createGameBoard, dom, stopAnimation, animateCell, resetPlayerDisplay} from "./UI.js";
import AI from "./AI.js";
import SnakeLadderGame from './Game.js';

let config = {
    players: {...GAME_CONFIG.Players},
    ladders: {...GAME_CONFIG.Ladders},
    snakes: {...GAME_CONFIG.Snakes}
};
const robot = new AI();
const game = new SnakeLadderGame(config);

function runningGame() {
    const numTotalPlayer = document.querySelector('input[name="mode"]:checked').value;
    if(game.getGameStatus()) {
        resetPlayerDisplay(game.getPlayerStat());
        game.rollDice(numTotalPlayer);
        animateCell(game.getCurrentElIdCell(), game.getGameStatus());
        updatePlayerDisplay();
        displayLogs();
        checkPlayer(game.getCurrentPlayerName());
    }
}

function checkPlayer(player) {
    if(robot.isAI(player)) {
        dom.diceBtn.style.display = 'none';
        robot.move(runningGame);
    } else {
        dom.diceBtn.style.display = "block";
    }
}

function setPlayerName() {
    const newName = prompt(`Text ${p.name}'s name!`);
    game.setPlayerName(this.id, newName);
    updatePlayerDisplay();
}

function displayLogs() {
    const logs = game.getLogs();
    const i = logs.length - 1;
    const log = document.createElement("li");
    log.innerHTML = logs[i].count + ' '+ logs[i].name + ": +" + logs[i].movement + " === " + logs[i].preScore +"  → " + logs[i].score ;//+' ' + message;
    dom.console.appendChild(log);
    dom.console.scrollTop = dom.console.scrollHeight;
}

function resetGame() {
    dom.diceBtn.style.display = "block";
    dom.modeColumn.style.display = "flex";
    game.resetGame();
    stopAnimation();
    resetPlayerDisplay(game.getPlayerStat());
    updatePlayerDisplay();
    dom.console.innerText = "";
}

function updatePlayerDisplay() {
    Object.values(game.getPlayerStat()).forEach(p => {
        if (p.score === 100 && p.record > 0) {
            document.getElementById(p.elementId.score).innerText =
            "No." + p.record + "\n" + p.name;
        } else if (p.score < 100) {
            document.getElementById(p.elementId.score).innerText =
            p.name + ":\n" + p.score;
        }
        playerCellEL(p.elementId.box, setPlayerName);
    });
}

dom.diceBtn.addEventListener("click", () => {
    if(game.getGameStatus()) {
        runningGame();
    } else {
        const numTotalPlayer = document.querySelector('input[name="mode"]:checked').value;
        game.startGame(numTotalPlayer);
        dom.modeColumn.style.display = "none";
        checkPlayer(game.getCurrentPlayerName());
    }
});
dom.resetBtn.addEventListener("click", resetGame);

updatePlayerDisplay();
// Call createGameBoard() when the page loads
document.addEventListener("DOMContentLoaded", createGameBoard);