import {
    GAME_CONFIG
} from "./config.js";
import animateNextTurnPlayerCell, {
    createGameBoard, dom
} from "./UI.js";
const uru = document.getElementById("uru");

let ke = 0;
let ii;
let consecutiveSixes = 0;
let indexPlayerTurn = 1;
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
    //select player who move next turn
    let playerr = nextTurn(dice);
    ke++;
    //Identify if the game should be ended
    isGameEnded();
    //Display button dice for the next turn player
    animateNextTurnPlayerCell(player.name);
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

function checkingPlayerScore() {
    let playerHasWonCount = 0;
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(p.score === 100) {
            playerHasWonCount++;
        }
    });
    return playerHasWonCount;
}

function endGame() {
    resetSelectedPlayerDisplay();
    dom.diceBtn.style.display = "none";
    GAME_CONFIG.game = false;
    updatePlayerState();
}

function isGameEnded() {
    let uiNumPlayer = document.querySelector('input[name="mode"]:checked').value;
    if (uiNumPlayer === "2p" && checkingPlayerScore() > 1) {
        endGame();
        return true;
    } else if (uiNumPlayer === "3p" && checkingPlayerScore() > 2) {
        endGame();
        return true;
    } else if (uiNumPlayer === "4p" && checkingPlayerScore() > 3) {
        endGame();
        return true;
    }
    return false;
}

function setLogs(playerName, dice, score, message = "") {
    const log = document.createElement("li");
    const previusScore = (score - dice);
    log.innerHTML = ke + ' '+ playerName + ": +" + dice + " === " + previusScore +"  → " + score +' ' + message;
    dom.console.appendChild(log);
    dom.console.scrollTop = dom.console.scrollHeight;
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
dom.resetBtn.addEventListener("click", resetGame);
function resetGame() {
    dom.diceBtn.style.display = "block";
    dom.selectedTotalPlayerBtn.style.display = "flex";
    ke = 0;
    h = GAME_CONFIG.Players.A.name;
    rekor = 0;
    GAME_CONFIG.game = false;
    if (GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
    }
    indexPlayerTurn = 1;
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

function updateIndexPlayerTurn() {
    let totalPlayer = 0;
    let textLog = "";
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(p.status === true && p.score < 100) {
            totalPlayer++;
            p.turn = totalPlayer;
        } else {
            p.turn = 0;
        }
        textLog += ` {name: ${p.name} score: ${p.score} turn: ${p.turn}}`;
    }); console.log(ke, indexPlayerTurn, textLog)
    if(indexPlayerTurn >= totalPlayer) {
        indexPlayerTurn = 0;
    }
    indexPlayerTurn++
}

function selectPlayer(player) {
    h = player.name;
    return player.name;
}

//Menentukan Pemain yang mendapat jatah gerak di giliran berikutnya
function nextTurn(dice) {
    resetSelectedPlayerDisplay();
    consecutiveSixes++;
    updateIndexPlayerTurn();
    const filterCurrentPlayer = Object.keys(GAME_CONFIG.Players).find(
        key => GAME_CONFIG.Players[key].name === h
    );
    document.getElementById(GAME_CONFIG.Players[filterCurrentPlayer].elementId.box).style.backgroundColor = 'gray';
    if (filterCurrentPlayer) {
        //Jika Pemain saat ini mendapatkan angka enam, maka dia berhak mendapatkan jatah gerak pada giliran berikutnya
        if (dice === 6 && GAME_CONFIG.Players[filterCurrentPlayer].score < 100 && consecutiveSixes < 3) {
            indexPlayerTurn = GAME_CONFIG.Players[filterCurrentPlayer].turn;
            return selectPlayer(GAME_CONFIG.Players[filterCurrentPlayer],false);
        } else {
            consecutiveSixes = 0;
            const nextPlayer = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].turn === indexPlayerTurn);
            //Jika Pemain yang tercatat pada data setelah pemain yang bergerak mengikuti permainan dan masih belum menang
            //Maka dia berhak mendapatkan jatah gerak pada giliran berikutnya
            if (nextPlayer) {
                return selectPlayer(GAME_CONFIG.Players[nextPlayer]);
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
            indexPlayerTurn = (p.turn - 1);
            document.getElementById(p.elementId.score).innerText =
            "No." + p.record + "\n" + p.name;
        } else if (p.score < 100) {
            document.getElementById(p.elementId.score).innerText =
            p.name + ":\n" + p.score;
        }
    });
}

function AI(am) {
    if (!GAME_CONFIG.game && ii) {
        clearInterval(ii);
        return;
    } else if (ii) {
        clearInterval(ii);
    }
    if (isAI(am)) {
        dom.diceBtn.style.display = "none";
    } else {
        dom.diceBtn.style.display = "block";
    }
    ii = setInterval(() => {
        if (isAI(am)) {
            dom.diceBtn.click();
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