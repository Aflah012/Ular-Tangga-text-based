import {GAME_CONFIG} from './config.js';
import selanjutnya, {createGameBoard} from './UI.js';
const uru = document.getElementById('uru');
const select = 'gray';

let ke = 0;
let ii;
let skor = 0;
let aturan = 0;
let cek = 0;
let batas = 0;
let rekor = 0;
let [p1, p2, p3, p4] = [0, 0, 0, 0];
let [pr1, pr2, pr3, pr4] = [0, 0, 0, 0];
let [A, B, C, D] = ['A', 'B', 'C', 'D'];
let h = A;

function acak() {
    GAME_CONFIG.game = true;
    document.getElementById('mode').style.display = 'none';
    let apa = Math.floor(Math.random() * 6) +1;
    cek = apa;
    hitungSkor(h, apa);
    // hitungRekor();
    let playerr = player();
    ke++;
    riwayat(playerr, apa);
    selanjutnya(h);
    AI(h);
    uru.textContent = 'Giliran ke: '+ke;
}
document.getElementById('acak').addEventListener("click", acak);
document.getElementById('reset').addEventListener("click", reset);

function beriNama() {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(this.id === p.elementId.box) {
            p.name = prompt(`Silahkan berinama Pemain ${p.name}`);
            updatePlayerState(p.elementId.score, p.name, p.score);
        }
    });
}

function riwayat(player, a) {
    const tomacak = document.getElementById('acak');
    let mode = document.querySelector('input[name="mode"]:checked').value;
    const p = document.getElementById('p');
    const li = document.createElement('li');
    let sesskor = skor + a;
    if (mode === '2p' && p1 === 100 && p2 === 100) {
        resetSelectedPlayerDisplay();
        tomacak.style.display = 'none';
        GAME_CONFIG.game = false;
    } else if (mode === '3p' && p1 === 100 && p2 === 100 && p3 === 100) {
        resetSelectedPlayerDisplay();
        tomacak.style.display = 'none';
        GAME_CONFIG.game = false;
    } else if (mode === '4p' && p1 === 100 && p2 === 100 && p3 === 100 &&
        p4 === 100) {
        resetSelectedPlayerDisplay();
        tomacak.style.display = 'none';
        GAME_CONFIG.game = false;
    }

    if (sesskor === aturan) {
        if (sesskor === 100) {
            li.innerHTML = player+': +'+a+' == '+skor+' > '+sesskor+' == <span class="green">Menang</span>';
        } else {
            li.textContent = player+': +'+a+' == '+skor+' > '+sesskor;
        }
    } else {
        if (sesskor < aturan && aturan < 100 && sesskor < 100) {
            li.textContent = player+': +'+a+' == '+skor+' > '+sesskor+' > '+aturan+' == Naik Tangga';
        } else if (sesskor > aturan && aturan < 100 && sesskor < 100) {
            li.textContent = player+': +'+a+' == '+skor+' > '+sesskor+' > '+aturan+' == Masuk mulut Ular';
        } else {
            li.textContent = player+': +'+a+' == '+skor+' > '+sesskor+' > '+aturan+' == Gagal masuk';
        }
    }
    p.appendChild(li);
    p.scrollTop = p.scrollHeight;
}

function hitungSkor(name, s) {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(name === p.name) {
            let i = aturanSkor(p.score += s);
            p.score = i;
            aturan = p.score;
            updatePlayerState(p.elementId.score, p.name, p.score);
        }
    });
    /* if (p === A) {
        skor = p1;
        p1 += s;
        let l = aturanSkor(p1);
        p1 = l;
        aturan = p1;
        updatePlayerState('p1', A, p1);
        return p1;
    } else if (p === B) {
        skor = p2;
        p2 += s;
        let l = aturanSkor(p2);
        p2 = l;
        aturan = p2;
        updatePlayerState('p2', B, p2);
        return p2;
    } else if (p === C) {
        skor = p3;
        p3 += s;
        let l = aturanSkor(p3);
        p3 = l;
        aturan = p3;
        updatePlayerState('p3', C, p3);
        return p3;
    } else if (p === D) {
        skor = p4;
        p4 += s;
        let l = aturanSkor(p4);
        p4 = l;
        aturan = p4;
        updatePlayerState('p4', D, p4);
        return p4;
    } */
}

/* function hitungRekor() {
    if (p1 === 100 && h === A) {
        rekor++;
        pr1 = rekor;
        updatePlayerState('p1', A, p1);
    } else if (p2 === 100 && h === B) {
        rekor++;
        pr2 = rekor;
        updatePlayerState('p2', B, p2);
    } else if (p3 === 100 && h === C) {
        rekor++;
        pr3 = rekor;
        updatePlayerState('p3', C, p3);
    } else if (p4 === 100 && h === D) {
        rekor++;
        pr4 = rekor;
        updatePlayerState('p4', D, p4);
    }
} */

function aturanSkor(s) {
    if (GAME_CONFIG.Ladders[s]) {
        //Ledder
        return GAME_CONFIG.Ladders[s];
    } else if (GAME_CONFIG.Snakes[s]) {
        //Snake
        return GAME_CONFIG.Snakes[s];
    } else if (s > 100) {
        //Normal move
        let i = s - 100;
        return 100 - i;
    } else {
        return s;
    }
}

function reset() {
    document.getElementById('acak').style.display = 'block';
    document.getElementById('mode').style.display = 'flex';
    ke = 0;
    h = A;
    rekor = 0;
    GAME_CONFIG.game = false;
    if (GAME_CONFIG.interval) {
        clearInterval(GAME_CONFIG.interval);
    }
    [p1,
        p2,
        p3,
        p4] = [0,
        0,
        0,
        0];
    [pr1,
        pr2,
        pr3,
        pr4] = [0,
        0,
        0,
        0];
    updatePlayerState('p1', A, p1);
    updatePlayerState('p2', B, p2);
    updatePlayerState('p3', C, p3);
    updatePlayerState('p4', D, p4);
    resetSelectedPlayerDisplay();
    p.innerText = '';
    uru.textContent = 'Giliran ke: '+ke;
    if (ii) {
        clearInterval(ii);
    }
}

function player() {
    resetSelectedPlayerDisplay();
    let mode = document.querySelector('input[name="mode"]:checked').value;
    batas++;
    if (h === A) {
        if (cek === 6 && batas < 3 && p1 < 100) {
            h = A;
        } else if (p2 < 100) {
            h = B;
            batas = 0;
        } else if (p3 < 100 && mode === '3p' || mode === '4p' && p3 < 100) {
            h = C;
            batas = 0;
        } else if (p4 < 100 && mode === '4p') {
            h = D;
            batas = 0;
        }
        document.getElementById('cp1').style.backgroundColor = select;
        return A;
    } else if (h === B) {
        if (cek === 6 && batas < 3 && p2 < 100) {
            h = B;
        } else if (mode === '3p' && p3 < 100 || mode === '4p' && p3 < 100) {
            h = C;
            batas = 0;
        } else if (mode === '4p' && p4 < 100) {
            h = D;
            batas = 0;
        } else if (p1 < 100) {
            h = A;
            batas = 0;
        }
        document.getElementById('cp2').style.backgroundColor = select;
        return B;
    } else if (h === C) {
        if (cek === 6 && batas < 3 && p3 < 100) {
            h = C;
        } else if (mode === '4p' && p4 < 100) {
            h = D;
            batas = 0;
        } else if (p1 < 100) {
            h = A;
            batas = 0;
        } else if (p2 < 100) {
            h = B;
            batas = 0;
        }
        document.getElementById('cp3').style.backgroundColor = select;
        return C;
    } else if (h === D) {
        if (cek === 6 && batas < 3 && p4 < 100) {
            h = D;
        } else if (p1 < 100) {
            h = A;
            batas = 0;
        } else if (p2 < 100) {
            h = B;
            batas = 0;
        } else if (p3 < 100) {
            h = C;
            batas = 0;
        }
        document.getElementById('cp4').style.backgroundColor = select;
        return D;
    } else {
        return 'selesai';
    }
}

function resetSelectedPlayerDisplay() {
    document.getElementById('cp1').style.background = 'none';
    document.getElementById('cp2').style.background = 'none';
    document.getElementById('cp3').style.background = 'none';
    document.getElementById('cp4').style.background = 'none';
}

function klikpemain(id, fungsi) {
    document.getElementById(id).addEventListener('click', fungsi);
}

function updatePlayerState(id, name, score) {
    Object.values(GAME_CONFIG.Players).forEach(p => {
        if(p.score === 100) {
            rekor++;
            p.record = rekor;
            document.getElementById(p.elementId.score).innerText = 'No.'+pr1+'\n'+p.name;
        } else {
            document.getElementById(p.elementId.score).innerText = p.name+':\n'+p.score;
        }
    })
}

function AI(am) {
    const tomacak = document.getElementById('acak');
    if (!GAME_CONFIG.game && ii) {
        clearInterval(ii);
        return;
    } else if (ii) {
        clearInterval(ii);
    }
    if (isAI(am)) {
        tomacak.style.display = 'none';
    } else {
        tomacak.style.display = 'block';
    }
    ii = setInterval(() => {
        if (isAI(am)) {
            tomacak.click();
        }
    },
        500);
}

function isAI(am) {
    if (am === 'A' || am === 'B' || am === 'C' || am === 'D') {
        return true;
    } else {
        return false;
    }
}

klikpemain('cp1', beriNama);
klikpemain('cp2', beriNama);
klikpemain('cp3', beriNama);
klikpemain('cp4', beriNama);

updatePlayerState('p1', A, p1);
updatePlayerState('p2', B, p2);
updatePlayerState('p3', C, p3);
updatePlayerState('p4', D, p4);

// Call createGameBoard() when the page loads
document.addEventListener('DOMContentLoaded', createGameBoard);