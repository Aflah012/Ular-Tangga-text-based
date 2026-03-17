/**
 * 🎲 Ular Tangga - Text Based Game
 * Refactored with Class-based Architecture & Best Practices
 * @author Aflah
 */

// ========================================
// CONSTANTS & CONFIGURATION
// ========================================
const CONFIG = {
  WIN_SCORE: 100,
  MAX_CONSECUTIVE_SIXES: 3,
  DICE_MIN: 1,
  DICE_MAX: 6,
  ANIMATION_INTERVAL: 500,
  DEFAULT_PLAYER_NAMES: ['A', 'B', 'C', 'D'],
};

const SNAKES = {
  39: 1,
  55: 37,
  68: 50,
  93: 75,
  99: 83,
};

const LADDERS = {
  5: 26,
  9: 31,
  28: 47,
  43: 80,
  73: 91,
  77: 96,
};

// ========================================
// GAME STATE CLASS
// ========================================
class GameState {
  constructor(playerCount = 2) {
    this.turn = 0;
    this.currentPlayerIndex = 0;
    this.consecutiveSixes = 0;
    this.isGameOver = false;
    this.playerCount = playerCount;
    this.players = this._initializePlayers();
    this.history = [];
  }

  _initializePlayers() {    return Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      name: CONFIG.DEFAULT_PLAYER_NAMES[index],
      score: 0,
      rank: null,
      isFinished: false,
    }));
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get activePlayers() {
    return this.players.slice(0, this.playerCount);
  }

  reset() {
    this.turn = 0;
    this.currentPlayerIndex = 0;
    this.consecutiveSixes = 0;
    this.isGameOver = false;
    this.players = this._initializePlayers();
    this.history = [];
  }
}

// ========================================
// GAME LOGIC CLASS
// ========================================
class GameLogic {
  constructor(state) {
    this.state = state;
  }

  rollDice() {
    return Math.floor(
      Math.random() * (CONFIG.DICE_MAX - CONFIG.DICE_MIN + 1)
    ) + CONFIG.DICE_MIN;
  }

  applyBoardRules(position) {
    if (SNAKES[position]) {
      return { newPosition: SNAKES[position], type: 'snake' };
    }
    if (LADDERS[position]) {
      return { newPosition: LADDERS[position], type: 'ladder' };
    }
    return { newPosition: position, type: 'normal' };
  }
  calculateNewPosition(currentScore, diceValue) {
    let tentativeScore = currentScore + diceValue;

    // Bounce back if exceeds win score
    if (tentativeScore > CONFIG.WIN_SCORE) {
      tentativeScore = CONFIG.WIN_SCORE - (tentativeScore - CONFIG.WIN_SCORE);
    }

    return this.applyBoardRules(tentativeScore);
  }

  shouldBonusTurn(diceValue, consecutiveSixes) {
    return diceValue === 6 && consecutiveSixes < CONFIG.MAX_CONSECUTIVE_SIXES;
  }

  nextPlayerIndex() {
    const activeCount = this.state.playerCount;
    let nextIndex = (this.state.currentPlayerIndex + 1) % activeCount;
    
    // Skip finished players
    let attempts = 0;
    while (this.state.players[nextIndex].isFinished && attempts < activeCount) {
      nextIndex = (nextIndex + 1) % activeCount;
      attempts++;
    }
    
    return nextIndex;
  }

  checkWinCondition(player) {
    return player.score === CONFIG.WIN_SCORE;
  }

  assignRanks() {
    const finishedPlayers = this.state.players
      .filter(p => p.rank !== null)
      .sort((a, b) => a.rank - b.rank);
    
    let nextRank = finishedPlayers.length + 1;
    
    this.state.players
      .filter(p => p.rank === null && p.isFinished)
      .forEach(player => {
        player.rank = nextRank++;
      });
  }
}

// ========================================// UI MANAGER CLASS
// ========================================
class UIManager {
  constructor(gameState, gameLogic) {
    this.state = gameState;
    this.logic = gameLogic;
    this.elements = this._cacheElements();
    this._bindEvents();
  }

  _cacheElements() {
    return {
      btnRoll: document.getElementById('btn-roll'),
      btnReset: document.getElementById('btn-reset'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      playerMode: document.getElementById('player-mode'),
      turnNumber: document.getElementById('turn-number'),
      currentPlayerName: document.getElementById('current-player-name'),
      moveHistory: document.getElementById('move-history'),
      winModal: document.getElementById('win-modal'),
      winMessage: document.getElementById('win-message'),
      gameBoard: document.getElementById('game-board'),
      playerCards: document.querySelectorAll('.player-card'),
    };
  }

  _bindEvents() {
    this.elements.btnRoll.addEventListener('click', () => this.handleRoll());
    this.elements.btnReset.addEventListener('click', () => this.handleReset());
    this.elements.btnPlayAgain.addEventListener('click', () => this.handleReset());
    
    // Player name setup on click
    this.elements.playerCards.forEach(card => {
      card.addEventListener('click', (e) => this.handlePlayerSetup(e));
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handlePlayerSetup(e);
        }
      });
    });

    // Player count change
    document.querySelectorAll('input[name="playerCount"]').forEach(radio => {
      radio.addEventListener('change', (e) => this.handlePlayerCountChange(e));
    });
  }

  handlePlayerSetup(event) {
    if (this.state.turn > 0) return; // Game already started    
    const card = event.currentTarget;
    const playerId = parseInt(card.dataset.playerId);
    const player = this.state.players[playerId - 1];
    
    const newName = prompt(`Masukkan nama untuk ${player.name}:`, player.name);
    if (newName && newName.trim()) {
      player.name = newName.trim();
      this.updatePlayerDisplay(player);
    }
  }

  handlePlayerCountChange(event) {
    const newCount = parseInt(event.target.value);
    this.state.playerCount = newCount;
    
    // Show/hide player cards
    this.elements.playerCards.forEach((card, index) => {
      if (index >= newCount && index < 4) {
        card.classList.add('hidden');
      } else {
        card.classList.remove('hidden');
      }
    });
    
    // Reset game when changing player count before start
    if (this.state.turn === 0) {
      this.state.reset();
      this.renderAll();
    }
  }

  async handleRoll() {
    if (this.state.isGameOver) return;
    
    this.elements.btnRoll.disabled = true;
    
    const diceValue = this.logic.rollDice();
    const player = this.state.currentPlayer;
    const oldScore = player.score;
    
    // Calculate new position
    const { newPosition, type } = this.logic.calculateNewPosition(
      player.score, 
      diceValue
    );
    
    // Update player score
    player.score = newPosition;
    this.state.turn++;    
    // Update consecutive sixes counter
    if (diceValue === 6) {
      this.state.consecutiveSixes++;
    } else {
      this.state.consecutiveSixes = 0;
    }
    
    // Create history entry
    const historyEntry = this._createHistoryEntry(
      player, diceValue, oldScore, newPosition, type
    );
    this.state.history.push(historyEntry);
    
    // Check win condition
    if (this.logic.checkWinCondition(player)) {
      player.isFinished = true;
      if (player.rank === null) {
        const finishedCount = this.state.players.filter(p => p.rank !== null).length;
        player.rank = finishedCount + 1;
      }
      this.logic.assignRanks();
    }
    
    // Update UI
    this.updatePlayerDisplay(player);
    this.addHistoryItem(historyEntry);
    this.updateTurnDisplay();
    this.highlightBoardPosition(player.score, player.id);
    
    // Check if game is over
    const allFinished = this.state.activePlayers.every(p => p.isFinished);
    if (allFinished) {
      this.endGame();
      return;
    }
    
    // Determine next player
    if (this.logic.shouldBonusTurn(diceValue, this.state.consecutiveSixes)) {
      // Same player gets another turn
      this._showBonusTurnMessage(player.name);
    } else {
      this.state.currentPlayerIndex = this.logic.nextPlayerIndex();
    }
    
    this.updateCurrentPlayerDisplay();
    this.elements.btnRoll.disabled = false;
  }

  _createHistoryEntry(player, dice, oldScore, newScore, type) {    let message = `${player.name}: +${dice} = ${oldScore} → ${newScore}`;
    
    if (type === 'snake') {
      message += ' 🐍 Terjatuh ke ular!';
    } else if (type === 'ladder') {
      message += ' 🪜 Naik tangga!';
    } else if (newScore === CONFIG.WIN_SCORE) {
      message += ' 🎉 MENANG!';
    } else if (oldScore + dice > CONFIG.WIN_SCORE) {
      message += ' ↩️ Memantul!';
    }
    
    return {
      player: player.name,
      dice,
      oldScore,
      newScore,
      type,
      message,
      turn: this.state.turn,
    };
  }

  _showBonusTurnMessage(playerName) {
    const li = document.createElement('li');
    li.textContent = `✨ ${playerName} dapat bonus giliran (angka 6)!`;
    li.style.borderLeftColor = '#fbbf24';
    this.elements.moveHistory.appendChild(li);
    this.elements.moveHistory.scrollTop = this.elements.moveHistory.scrollHeight;
  }

  addHistoryItem(entry) {
    const li = document.createElement('li');
    li.textContent = `[${entry.turn}] ${entry.message}`;
    
    // Color coding based on event type
    if (entry.type === 'snake') {
      li.style.borderLeftColor = 'var(--color-snake)';
    } else if (entry.type === 'ladder') {
      li.style.borderLeftColor = 'var(--color-ladder)';
    } else if (entry.newScore === CONFIG.WIN_SCORE) {
      li.style.borderLeftColor = 'var(--color-primary)';
      li.style.fontWeight = 'bold';
    }
    
    this.elements.moveHistory.appendChild(li);
    this.elements.moveHistory.scrollTop = this.elements.moveHistory.scrollHeight;
  }

  updatePlayerDisplay(player) {    const card = document.getElementById(`player-${player.id}`);
    if (!card) return;
    
    card.querySelector('.player-name').textContent = player.name;
    card.querySelector('.score-value').textContent = player.score;
    card.querySelector('.rank-value').textContent = 
      player.rank ? `#${player.rank}` : '-';
    
    // Update visual states
    card.classList.toggle('winner', player.rank === 1);
    card.classList.toggle('active', 
      !this.state.isGameOver && player.id === this.state.currentPlayer.id);
  }

  updateTurnDisplay() {
    this.elements.turnNumber.textContent = this.state.turn;
  }

  updateCurrentPlayerDisplay() {
    const player = this.state.currentPlayer;
    this.elements.currentPlayerName.textContent = 
      this.state.isGameOver ? '-' : player.name;
    
    // Update active state on cards
    this.elements.playerCards.forEach(card => {
      const playerId = parseInt(card.dataset.playerId);
      card.classList.toggle('active', 
        !this.state.isGameOver && playerId === player.id);
    });
  }

  highlightBoardPosition(position, playerId) {
    // Remove previous highlights
    document.querySelectorAll('.grid-cell.highlighted').forEach(el => {
      el.classList.remove('highlighted');
    });
    
    // Add new highlight
    const cell = document.querySelector(
      `.grid-cell[data-position="${position}"]`
    );
    if (cell) {
      cell.classList.add('highlighted');
      cell.dataset.occupiedBy = playerId;
    }
  }

  endGame() {
    this.state.isGameOver = true;
    this.elements.btnRoll.disabled = true;    
    // Show winner modal
    const winner = this.state.players.find(p => p.rank === 1);
    if (winner) {
      this.elements.winMessage.textContent = 
        `🏆 ${winner.name} memenangkan permainan dengan skor ${winner.score}!`;
      this.elements.winModal.classList.remove('hidden');
    }
    
    // Final ranking display
    this.logic.assignRanks();
    this.state.players
      .slice(0, this.state.playerCount)
      .forEach(player => this.updatePlayerDisplay(player));
  }

  handleReset() {
    this.state.reset();
    this.elements.winModal.classList.add('hidden');
    this.elements.moveHistory.innerHTML = '';
    this.elements.gameBoard.innerHTML = '';
    
    // Clear board highlights
    document.querySelectorAll('.grid-cell').forEach(cell => {
      cell.classList.remove('highlighted');
      delete cell.dataset.occupiedBy;
    });
    
    this.renderAll();
    this.elements.btnRoll.disabled = false;
  }

  renderAll() {
    this.createGameBoard();
    this.state.activePlayers.forEach(player => this.updatePlayerDisplay(player));
    this.updateTurnDisplay();
    this.updateCurrentPlayerDisplay();
  }

  createGameBoard() {
    this.elements.gameBoard.innerHTML = '';
    
    // Create cells in snake order (bottom-left to top-right pattern)
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cellNumber = this._getCellNumber(row, col);
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.textContent = cellNumber;
        cell.dataset.position = cellNumber;        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Kotak ${cellNumber}`);
        
        if (SNAKES[cellNumber]) {
          cell.classList.add('snake');
          cell.setAttribute('aria-label', `Kotak ${cellNumber} - Awal ular`);
        } else if (LADDERS[cellNumber]) {
          cell.classList.add('ladder');
          cell.setAttribute('aria-label', `Kotak ${cellNumber} - Awal tangga`);
        }
        
        this.elements.gameBoard.appendChild(cell);
      }
    }
  }

  _getCellNumber(row, col) {
    // Snake pattern: alternating row directions
    const rowIndex = 9 - row; // Flip to start from bottom
    const base = rowIndex * 10;
    return rowIndex % 2 === 0 
      ? base + col + 1 
      : base + (10 - col);
  }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const gameState = new GameState(2);
  const gameLogic = new GameLogic(gameState);
  const uiManager = new UIManager(gameState, gameLogic);
  
  // Initial render
  uiManager.renderAll();
  
  // Enable roll button after player names are set (optional enhancement)
  // For now, players can roll immediately with default names
});