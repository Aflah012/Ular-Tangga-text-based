import {
    GAME_CONFIG
} from "./config.js";
import {animateNextTurnPlayerCell,createGameBoard, dom, stopAnimation} from "./UI.js";
import AI from "./AI.js";

let turnCount = 0;
let consecutiveSixes = 0;
let indexPlayerTurn = 1;
let recordCount = 0;
let currentPlayerName = GAME_CONFIG.Players.A.name;
const robot = new AI();
function rollDice(isAI = true) {
    //roll the dice
    let dice = Math.floor(Math.random() * 6) + 1;
    //Calculate the score player
    calculatePlayerScore(currentPlayerName, dice);
    //select player who move next turn
    nextTurn(dice);
    turnCount++;
    //Identify if the game should be ended
    isGameEnded();
    //Display button dice for the next turn player
    animateNextTurnPlayerCell(currentPlayerName);
    //Call the AI that control player if current player controled by AI
    robot.move(currentPlayerName, rollDice);
    //Display the total of roll dice
    dom.uiTurnCount.textContent = "Giliran ke: " + turnCount;
}

function startGame() {
    GAME_CONFIG.game = true;
    setTotalPlayers();
    dom.modeColumn.style.display = "none";
    robot.move(currentPlayerName, rollDice);
}

dom.diceBtn.addEventListener("click", () => {
    if(GAME_CONFIG.game) {
        rollDice();
    } else {
        startGame();
    }
});
dom.resetBtn.addEventListener("click", reset);

function setTotalPlayers() {
    const uiNumPlayer = document.querySelector('input[name="mode"]:checked').value;
    const player = GAME_CONFIG.Players;
    player.A.status = true;
    player.B.status = true;
    if (uiNumPlayer === "3p" || uiNumPlayer === '4p') {
        player.C.status = true;
        if (uiNumPlayer === "4p") {
            player.D.status = true;
        }
    }
}

function setPlayerName() {
    const selectedPlayer = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].elementId.box === this.id);
    if(selectedPlayer) {
        GAME_CONFIG.Players[selectedPlayer].name = prompt(`Text ${p.name}'s name!`);
    }
    updatePlayerState();
}

function endGame() {
    resetSelectedPlayerDisplay();
    dom.diceBtn.style.display = "none";
    GAME_CONFIG.game = false;
    updatePlayerState();
}

function isGameEnded() {
    let uiNumPlayer = document.querySelector('input[name="mode"]:checked').value;
    if (uiNumPlayer === "2p" && recordCount > 1) {
        endGame();
    } else if (uiNumPlayer === "3p" && recordCount > 2) {
        endGame();
    } else if (uiNumPlayer === "4p" && recordCount > 3) {
        endGame();
    }
}

function setLogs(playerName, dice, previousScore, score, message = "") {
    const log = document.createElement("li");
    log.innerHTML = turnCount + ' '+ playerName + ": +" + dice + " === " + previousScore +"  → " + score +' ' + message;
    dom.console.appendChild(log);
    dom.console.scrollTop = dom.console.scrollHeight;
}

function calculatePlayerScore(name, dice) {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if (name === p.name && p.score < 100) {
            const uncalculatedScore = p.score;
            const calculatedScore = calculateScore((p.score += dice));
            p.score = calculatedScore;
            updatePlayerState();
            //Display movement in the log
            setLogs(name, dice, uncalculatedScore, calculatedScore);
        }
    });
}

function calculateScore(dice) {
    if (GAME_CONFIG.Ladders[dice]) {
        return GAME_CONFIG.Ladders[dice];
    } else if (GAME_CONFIG.Snakes[dice]) {
        return GAME_CONFIG.Snakes[dice];
    } else if (dice > 100) {//Bounce back when the score is more than 100
        const i = dice - 100;
        return 100 - i;
    } else {
        return dice;
    }
}
dom.resetBtn.addEventListener("click", resetGame);
function resetGame() {
    dom.diceBtn.style.display = "block";
    dom.modeColumn.style.display = "flex";
    turnCount = 0;
    currentPlayerName = GAME_CONFIG.Players.A.name;
    recordCount = 0;
    GAME_CONFIG.game = false;
    stopAnimation();
    indexPlayerTurn = 1;
    Object.values(GAME_CONFIG.Players).forEach(p => {
        p.score = 0;
        p.record = 0;
        p.status = false;
        p.turn = 0;
    });
    updatePlayerState();
    resetSelectedPlayerDisplay();
    dom.console.innerText = "";
    dom.uiTurnCount.textContent = "Giliran ke: " + turnCount;
}

function updateIndexPlayerTurn() {
    let totalPlayer = 0;
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(p.status === true && p.score < 100) {
            totalPlayer++;
            p.turn = totalPlayer;
        } else {
            p.turn = 0;
        }
    });
    if(indexPlayerTurn >= totalPlayer) {
        indexPlayerTurn = 0;
    }
    indexPlayerTurn++;
}

//Menentukan Pemain yang mendapat jatah gerak di giliran berikutnya
function nextTurn(dice) {
    resetSelectedPlayerDisplay();
    consecutiveSixes++;
    updateIndexPlayerTurn();
    const filterCurrentPlayer = Object.keys(GAME_CONFIG.Players).find(
        key => GAME_CONFIG.Players[key].name === currentPlayerName
    );
    document.getElementById(GAME_CONFIG.Players[filterCurrentPlayer].elementId.box).style.backgroundColor = 'gray';
    if (filterCurrentPlayer) {
        //Jika Pemain saat ini mendapatkan angka enam, maka dia berhak mendapatkan jatah gerak pada giliran berikutnya
        if (dice === 6 && GAME_CONFIG.Players[filterCurrentPlayer].score < 100 && consecutiveSixes < 3) {
            indexPlayerTurn = GAME_CONFIG.Players[filterCurrentPlayer].turn;
            currentPlayerName = GAME_CONFIG.Players[filterCurrentPlayer].name;
        } else {
            consecutiveSixes = 0;
            const nextPlayer = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].turn === indexPlayerTurn);
            //Jika Pemain yang tercatat pada data setelah pemain yang bergerak mengikuti permainan dan masih belum menang
            //Maka dia berhak mendapatkan jatah gerak pada giliran berikutnya
            if (nextPlayer) {
                currentPlayerName = GAME_CONFIG.Players[nextPlayer].name;
            }
        }
    }
}

function resetSelectedPlayerDisplay() {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        document.getElementById(p.elementId.box).style.backgroundColor = "transparent";
    });
}

function playerCellEL(id, fungsi) {
    document.getElementById(id).addEventListener("click", fungsi);
}

function updatePlayerState() {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if (p.score === 100 && p.record === 0) {
            recordCount++;
            p.record = recordCount;
            indexPlayerTurn = (p.turn - 1);
            document.getElementById(p.elementId.score).innerText =
            "No." + p.record + "\n" + p.name;
        } else if (p.score < 100) {
            document.getElementById(p.elementId.score).innerText =
            p.name + ":\n" + p.score;
        }
        playerCellEL(p.elementId.box, setPlayerName)
    });
}

/* playerCellEL("cp1", setPlayerName);
playerCellEL("cp2", setPlayerName);
playerCellEL("cp3", setPlayerName);
playerCellEL("cp4", setPlayerName); */

updatePlayerState();

// Call createGameBoard() when the page loads
document.addEventListener("DOMContentLoaded", createGameBoard);