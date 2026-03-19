import {
    GAME_CONFIG
} from "./config.js";
import animateNextTurnPlayerCell, {
    createGameBoard
} from "./UI.js";
const uru = document.getElementById("uru");

let ke = 0;
let ii;
let consecutiveSixes = 0;
let globalPlayerTurn = 0;
let rekor = 0;
let h = GAME_CONFIG.Players.A.name;

function acak() {
    //Activate the game
    GAME_CONFIG.game = true;
    //set The total players
    setTotalPlayers();
    //Hide the total player selector
    document.getElementById("mode").style.display = "none";
    //roll the dice
    let dice = Math.floor(Math.random() * 6) + 1;
    //cek = dice;
    //Calculate the score player
    calculatePlayerScore(h, dice);
    //Display movement in the log
    const playerKey = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].name === h);
    const player = GAME_CONFIG.Players[playerKey];
    setLogs(player.name, dice, player.score);
    // hitungRekor();
    //select player who move next turn
    let playerr = nextTurn(dice);
    ke++;
    //Identify if the game should be ended
    endGame();
    //Display button dice for the next turn player
    animateNextTurnPlayerCell(h);
    //Call the AI that control player if current player controled by AI
    AI(h);
    //Calculate the total of roll dice
    uru.textContent = "Giliran ke: " + ke;
}
document.getElementById("acak").addEventListener("click", acak);
document.getElementById("reset").addEventListener("click", reset);

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

function beriNama() {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if (this.id === p.elementId.box) {
            p.name = prompt(`Silahkan berinama Pemain ${p.name}`);
            updatePlayerState();
        }
    });
}

function endGame() {
    const tomacak = document.getElementById("acak");
    let uiNumPlayer = document.querySelector(
        'input[name="mode"]:checked'
    ).value;
    if (
        uiNumPlayer === "2p" &&
        GAME_CONFIG.Players.A.score === 100 &&
        GAME_CONFIG.Players.B.score === 100
    ) {
        resetSelectedPlayerDisplay();
        tomacak.style.display = "none";
        GAME_CONFIG.game = false;
    } else if (
        uiNumPlayer === "3p" &&
        GAME_CONFIG.Players.A.score === 100 &&
        GAME_CONFIG.Players.B.score === 100 &&
        GAME_CONFIG.Players.C.score === 100
    ) {
        resetSelectedPlayerDisplay();
        tomacak.style.display = "none";
        GAME_CONFIG.game = false;
    } else if (
        uiNumPlayer === "4p" &&
        GAME_CONFIG.Players.A.score === 100 &&
        GAME_CONFIG.Players.B.score === 100 &&
        GAME_CONFIG.Players.C.score === 100 &&
        GAME_CONFIG.Players.D.score === 100
    ) {
        resetSelectedPlayerDisplay();
        tomacak.style.display = "none";
        GAME_CONFIG.game = false;
    }
}

function setLogs(playerName, dice, score, message = "") {
    const console = document.getElementById("p");
    const log = document.createElement("li");
    const previusScore = (score - dice);
    log.innerHTML = ke + ' '+ playerName + ": +" + dice + " === " + previusScore +"  → " + score +' ' + message;
    console.appendChild(log);
    console.scrollTop = console.scrollHeight;
}

function calculatePlayerScore(name, s) {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if (name === p.name && p.score < 100) {
            const i = calculateScore((p.score += s));
            p.score = i;
            updatePlayerState();
        }
    });
}

function calculateScore(s) {
    if (GAME_CONFIG.Ladders[s]) {
        //Ledder
        return GAME_CONFIG.Ladders[s];
    } else if (GAME_CONFIG.Snakes[s]) {
        //Snake
        return GAME_CONFIG.Snakes[s];
    } else if (s > 100) {
        //Normal move
        const i = s - 100;
        return 100 - i;
    } else {
        return s;
    }
}
document.getElementById('reset').addEventListener("click", resetGame);
function resetGame() {
    document.getElementById("acak").style.display = "block";
    document.getElementById("mode").style.display = "flex";
    ke = 0;
    h = GAME_CONFIG.Players.A.name;
    rekor = 0;
    GAME_CONFIG.game = false;
    if (GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
    }
    Object.values(GAME_CONFIG.Players).forEach(p => {
        p.score = 0;
        p.record = 0;
        p.status = false;
        p.turn = 0;
    });
    updatePlayerState();
    resetSelectedPlayerDisplay();
    p.innerText = "";
    uru.textContent = "Giliran ke: " + ke;
    if (ii) {
        clearInterval(ii);
    }
}

function getNextChar(char) {
    const character = `${char}`;
    return String.fromCharCode(character.charCodeAt(0) + 1);
}

function updateGlobalPlayerTurn() {
    let totalPlayer = 0;
    let totalTurn = 0;
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(p.status === true && p.score < 100) {
            totalPlayer++;
            totalTurn += p.turn;
        }
    });
    globalPlayerTurn = totalTurn / totalPlayer;
}

function selectPlayer(player, saveTurn = true) {
    h = player.name;
    if(saveTurn) {
        player.turn++;
    }
    return player.name;
}

function nextTurn(dice) {
    resetSelectedPlayerDisplay();
    updateGlobalPlayerTurn();
    consecutiveSixes++;
    const filterCurrentPlayer = Object.keys(GAME_CONFIG.Players).find(
        key => GAME_CONFIG.Players[key].name === h
    );
    document.getElementById(GAME_CONFIG.Players[filterCurrentPlayer].elementId.box).style.backgroundColor = 'gray';
    if (filterCurrentPlayer) {
        if (dice === 6 && GAME_CONFIG.Players[filterCurrentPlayer].score < 100 && consecutiveSixes < 3) {
            return selectPlayer(GAME_CONFIG.Players[filterCurrentPlayer],false);
        } else {
            consecutiveSixes = 0;
            const nextPlayer = GAME_CONFIG.Players[getNextChar(filterCurrentPlayer)];
            if (nextPlayer && nextPlayer.score < 100 && nextPlayer.status === true) {
                return selectPlayer(GAME_CONFIG.Players[getNextChar(filterCurrentPlayer)]);
            } else {
                const filterPlayerTurn = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].status === true && GAME_CONFIG.Players[key].score < 100 && GAME_CONFIG.Players[key].turn < globalPlayerTurn);
                const filterSameGlobalPlayerTurn = Object.keys(GAME_CONFIG.Players).find(item => GAME_CONFIG.Players[item].status === true && GAME_CONFIG.Players[item].score < 100 && GAME_CONFIG.Players[item].turn === globalPlayerTurn && GAME_CONFIG.Players[item].name !== h);
                if(filterPlayerTurn) {
                    return selectPlayer(GAME_CONFIG.Players[filterPlayerTurn]);
                } else if(Number.isInteger(globalPlayerTurn) && filterSameGlobalPlayerTurn) {
                    return selectPlayer(GAME_CONFIG.Players[filterSameGlobalPlayerTurn]);
                }
            }
        }
    }
}

function resetSelectedPlayerDisplay() {
    document.getElementById("cp1").style.background = "none";
    document.getElementById("cp2").style.background = "none";
    document.getElementById("cp3").style.background = "none";
    document.getElementById("cp4").style.background = "none";
}

function klikpemain(id, fungsi) {
    document.getElementById(id).addEventListener("click", fungsi);
}

function updatePlayerState() {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if (p.score === 100 && p.record === 0) {
            rekor++;
            p.record = rekor;
            document.getElementById(p.elementId.score).innerText =
            "No." + p.record + "\n" + p.name;
        } else if (p.score < 100) {
            document.getElementById(p.elementId.score).innerText =
            p.name + ":\n" + p.score;
        }
    });
}

function AI(am) {
    const tomacak = document.getElementById("acak");
    if (!GAME_CONFIG.game && ii) {
        clearInterval(ii);
        return;
    } else if (ii) {
        clearInterval(ii);
    }
    if (isAI(am)) {
        tomacak.style.display = "none";
    } else {
        tomacak.style.display = "block";
    }
    ii = setInterval(() => {
        if (isAI(am)) {
            tomacak.click();
        }
    },500);
}

function isAI(am) {
    if (am === "A" || am === "B" || am === "C" || am === "D") {
        return true;
    } else {
        return false;
    }
}

klikpemain("cp1", beriNama);
klikpemain("cp2", beriNama);
klikpemain("cp3", beriNama);
klikpemain("cp4", beriNama);

updatePlayerState();

// Call createGameBoard() when the page loads
document.addEventListener("DOMContentLoaded", createGameBoard);