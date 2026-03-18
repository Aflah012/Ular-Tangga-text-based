import {
    GAME_CONFIG
} from "./config.js";
import selanjutnya, {
    createGameBoard
} from "./UI.js";
const uru = document.getElementById("uru");
const select = "gray";

let ke = 0;
let ii;
let skor = 0;
let aturan = 0;
let cek = 0;
let batas = 0;
let rekor = 0;
let h = GAME_CONFIG.Players.A.name;

function acak() {
    GAME_CONFIG.game = true;
    setTotalPlayers();
    document.getElementById("mode").style.display = "none";
    let dice = Math.floor(Math.random() * 6) + 1;
    cek = dice;
    hitungSkor(h, dice);
    const playerKey = Object.keys(GAME_CONFIG.Players).find(key => GAME_CONFIG.Players[key].name === h);
    const player = GAME_CONFIG.Players[playerKey];
    setLogs(player.name, dice, player.score);
    // hitungRekor();
    let playerr = nextTurn();
    ke++;
    endGame();
    // riwayat(playerr, dice);
    selanjutnya(h);
    AI(h);
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
    log.innerHTML = playerName + ": +" + dice + " === " + previusScore +"  → " + score +' ' + message;
    console.appendChild(log);
    console.scrollTop = console.scrollHeight;
}

function riwayat(player, a) {
    //const tomacak = document.getElementById('acak');
    //let mode = document.querySelector('input[name="mode"]:checked').value;
    const p = document.getElementById("p");
    const li = document.createElement("li");
    let sesskor = skor + a;
    endGame();

    if (sesskor === aturan) {
        if (sesskor === 100) {
            li.innerHTML =
            player +
            ": +" +
            a +
            " == " +
            skor +
            " > " +
            sesskor +
            ' == <span class="green">Menang</span>';
        } else {
            li.textContent =
            player + ": +" + a + " == " + skor + " > " + sesskor;
        }
    } else {
        if (sesskor < aturan && aturan < 100 && sesskor < 100) {
            li.textContent =
            player +
            ": +" +
            a +
            " == " +
            skor +
            " > " +
            sesskor +
            " > " +
            aturan +
            " == Naik Tangga";
        } else if (sesskor > aturan && aturan < 100 && sesskor < 100) {
            li.textContent =
            player +
            ": +" +
            a +
            " == " +
            skor +
            " > " +
            sesskor +
            " > " +
            aturan +
            " == Masuk mulut Ular";
        } else {
            li.textContent =
            player +
            ": +" +
            a +
            " == " +
            skor +
            " > " +
            sesskor +
            " > " +
            aturan +
            " == Gagal masuk";
        }
    }
    p.appendChild(li);
    p.scrollTop = p.scrollHeight;
}

function hitungSkor(name, s) {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if (name === p.name && p.score < 100) {
            let i = aturanSkor((p.score += s));
            p.score = i;
            //aturan = p.score;
            updatePlayerState();
        }
    });
}

function aturanSkor(s) {
    if (GAME_CONFIG.Ladders[s]) {
        //Ledder
        return GAME_CONFIG.Ladders[s];
    } else if (GAME_CONFIG.Snakes[s]) {
        //Snake
        return GAME_CONFIG.Snakes[s];
    } else if (s === 100) {
        return s;
    } else if (s > 100) {
        //Normal move
        let i = s - 100;
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
    })
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

function nextTurn(dice) {
    resetSelectedPlayerDisplay();
    batas++;
    const key = Object.keys(GAME_CONFIG.Players).find(
        key => GAME_CONFIG.Players[key].name === h
    );
    if (key) {
        const currentPlayer = GAME_CONFIG.Players[key];
        if (dice === 6 && currentPlayer.score < 100 && batas < 3) {
            h = currentPlayer.name;
            document.getElementById(currentPlayer.elementId.box).style.backgroundColor = select;
            return currentPlayer.name;
        } else {
            const nextPlayer = GAME_CONFIG.Players[getNextChar(key)];
            if (nextPlayer && nextPlayer.score < 100 && nextPlayer.status === true) {
                h = nextPlayer.name;
                //console.log(GAME_CONFIG.Players[getNextChar(key)].name);
                document.getElementById(nextPlayer.elementId.box).style.backgroundColor = select;
                return nextPlayer.name;
            } else {
                h = GAME_CONFIG.Players["A"].name;
                document.getElementById(GAME_CONFIG.Players["A"].elementId.box).style.backgroundColor = select;
                return GAME_CONFIG.Players["A"].name;
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