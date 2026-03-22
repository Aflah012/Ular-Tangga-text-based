

export default class SnakeLadderGame {
    constructor(config = {}) {
        this.players = {};
        this.game = false;
        this.turnCount = 0;
        this.consecutiveSixes = 0;
        this.indexPlayerTurn = 1;
        this.recordCount = 0;
        this.logs = [];
        this.currentPlayerName = "";
        this.config = config;
    }

    getCurrentPlayerName() {
        return this.currentPlayerName;
    }

    getGameStatus() {
        return this.game;
    }

    getCurrentElIdCell() {
        const key = Object.keys(this.config.players).find(k => this.config.players[k].name === this.currentPlayerName);
        if (key) {
            return this.config.players[key].elementId.box;
        }
    }

    setTotalPlayers(uiNumPlayer) {
        const player = this.config.players;
        player.A.status = true;
        player.B.status = true;
        if (uiNumPlayer === "3p" || uiNumPlayer === '4p') {
            player.C.status = true;
            if (uiNumPlayer === "4p") {
                player.D.status = true;
            }
        }
    }

    startGame(selectedTotalPlayer) {
        this.game = true;
        this.setTotalPlayers(selectedTotalPlayer);
        this.currentPlayerName = this.config.players.A.name;
    }

    rollDice(numTotalPlayer) {
        const dice = Math.floor(Math.random() * 6) + 1;
        this.calculatePlayerScore(this.currentPlayerName, dice);
        this.setWinners();
        this.nextTurn(dice);
        this.turnCount++;
        this.isGameEnded(numTotalPlayer);
    }

    setPlayerName(id, newName) {
        const selectedPlayer = Object.keys(this.config.players).find(key => this.config.players[key].elementId.box === id);
        if (selectedPlayer) {
            if (newName) {
                this.config.players[selectedPlayer].name = newName;
            }
        }
    }

    endGame() {
        this.game = false;
    }

    isGameEnded(uiNumPlayer) {
        if (uiNumPlayer === "2p" && this.recordCount > 1) {
            this.endGame();
        } else if (uiNumPlayer === "3p" && this.recordCount > 2) {
            this.endGame();
        } else if (uiNumPlayer === "4p" && this.recordCount > 3) {
            this.endGame();
        }
    }

    calculatePlayerScore(name, dice) {
        Object.values(this.config.players).forEach(p => {
            if (name === p.name && p.score < this.config.boardSize) {
                const uncalculatedScore = p.score;
                const { newPos, message } = this.calculateScore(p.score += dice);
                p.score = newPos;
                this.updateLogs(this.turnCount, name, dice, uncalculatedScore, newPos, message);
            }
        });
    }

    updateLogs(count, playerName, dice, previousScore, playerScore, message) {
        this.logs.push({ count: count, name: playerName, movement: dice, preScore: previousScore, score: playerScore, message: message });
    }

    getLogs() {
        return this.logs;
    }

    calculateScore(position) {
        if (this.config.ladders[position]) {
            return { newPos: this.config.ladders[position], message: "Naik Tangga" };
        } else if (this.config.snakes[position]) {
            return { newPos: this.config.snakes[position], message: "Masuk Mulut Ular" };
        } else if (position > this.config.boardSize) {//Bounce back when the score is more than BOARD_SIZE
            const i = position - this.config.boardSize;
            return { newPos: this.config.boardSize - i, message: "Gagal Masuk" };
        } else {
            return { newPos: position, message: "" };
        }
    }

    resetGame() {
        this.turnCount = 0;
        this.currentPlayerName = "";
        this.recordCount = 0;
        this.game = false;
        this.indexPlayerTurn = 1;
        Object.values(this.config.players).forEach(p => {
            p.score = 0;
            p.record = 0;
            p.status = false;
            p.turn = 0;
        });
    }

    updateIndexPlayerTurn() {
        let totalPlayer = 0;
        Object.values(this.config.players).forEach(p => {
            if (p.status === true && p.score < this.config.boardSize) {
                totalPlayer++;
                p.turn = totalPlayer;
            } else {
                p.turn = 0;
            }
        });
        if (this.indexPlayerTurn >= totalPlayer) {
            this.indexPlayerTurn = 0;
        }
        this.indexPlayerTurn++;
    }

    nextTurn(dice) {
        this.consecutiveSixes++;
        this.updateIndexPlayerTurn();
        const filterCurrentPlayer = Object.keys(this.config.players).find(
            key => this.config.players[key].name === this.currentPlayerName
        );
        if (filterCurrentPlayer) {
            //Jika Pemain saat ini mendapatkan angka enam, maka dia berhak mendapatkan jatah gerak pada giliran berikutnya
            if (dice === 6 && this.config.players[filterCurrentPlayer].score < this.config.boardSize && this.consecutiveSixes < this.config.maxExecutiveSixes) {
                this.indexPlayerTurn = this.config.players[filterCurrentPlayer].turn;
                this.currentPlayerName = this.config.players[filterCurrentPlayer].name;
            } else {
                this.consecutiveSixes = 0;
                const nextPlayer = Object.keys(this.config.players).find(key => this.config.players[key].turn === this.indexPlayerTurn);
                //Jika Pemain yang tercatat pada data setelah pemain yang bergerak mengikuti permainan dan masih belum menang
                //Maka dia berhak mendapatkan jatah gerak pada giliran berikutnya
                if (nextPlayer) {
                    this.currentPlayerName = this.config.players[nextPlayer].name;
                }
            }
        }
    }

    setWinners() {
        Object.values(this.config.players).forEach(p => {
            if (p.score === this.config.boardSize && p.record === 0) {
                this.recordCount++;
                p.record = this.recordCount;
                this.indexPlayerTurn = (p.turn - 1);
            }
        });
    }

    getPlayerStat() {
        return this.config.players;
    }
}