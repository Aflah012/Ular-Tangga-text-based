# Ular Tangga (Text-Based)

[**Play Now!**](https://aflah012.github.io/Ular-Tangga-text-based/)

A simple text-based version of the classic **Ular Tangga** (Snakes and Ladders) game that can be played directly in the browser. This project was created for learning purposes and experimentation with JavaScript, HTML, and CSS.

---

## 📖 Description

Ular Tangga is a classic dice-based board game where each player takes turns rolling a dice and moving according to the number rolled. If a player lands on the head of a snake, they slide down to the tail. If they land on the bottom of a ladder, they climb up to the top. The first player to reach square 100 wins!

---

## 🎮 How to Play

1. **Open the game** in your browser: [https://aflah012.github.io/Ular-Tangga-text-based/](https://aflah012.github.io/Ular-Tangga-text-based/)
2. **Select the number of players** (2, 3, or 4 players) by clicking the radio buttons at the top.
3. **Click the "Roll" button** (dice icon) to roll the dice and move.
4. **Players take turns** automatically after each roll.
5. **Rolling a 6** gives you an extra turn.
6. **The first player to reach square 100 wins!**
7. **Click on your player box** to customize your player name.

---

## 📂 Project Structure

| File/Folder         | Description                                                                    |
|---------------------|--------------------------------------------------------------------------------|
| `index.html`        | Main HTML file that serves as the entry point for the game.                   |
| `style.css`         | CSS styling for the game interface and board.                                 |
| `ser.js`            | Express server file for local development (optional).                         |
| `js/`               | Directory containing modularized game logic modules.                          |
| `js/script.js`      | Main game entry point that imports and initializes game components.           |
| `js/Game.js`        | Core game class containing all game logic and rules.                         |
| `js/UI.js`          | UI module handling game board rendering and player display updates.           |
| `js/config.js`      | Game configuration including player setup, snakes, ladders, and board size.  |
| `js/AI.js`          | AI player module for automated player moves.                                  |
| `images.png`        | Dice icon image used for the roll button.                                     |
| `images_black.png`  | Alternative dice icon (not used by default).                                 |
| `README.md`         | Project documentation (this file).                                            |

---

## 🛠 Technologies Used

- **HTML5**: Page structure and semantic markup.
- **CSS3**: Styling, responsive design, and animations.
- **JavaScript (ES6+)**: Game logic using modular class-based architecture.
- **Express.js** (optional): Local server setup for development.

---

## 🎯 Game Rules

### Core Rules
- Players take turns rolling the dice and moving accordingly.
- **Landing on a ladder**: Climb up to the top of the ladder.
- **Landing on a snake**: Slide down to the tail of the snake.
- **Rolling a 6**: Automatically grants an extra turn (up to 3 consecutive sixes).
- **Rolling 3 sixes in a row**: Turn passes to the next player.
- **Overshooting square 100**: Your position bounces back (e.g., rolling 102 becomes 98).
- **First to reach square 100**: Wins the game!

### Snakes (Position → Destination)
- 8 → 3
- 39 → 1
- 55 → 37
- 68 → 50
- 93 → 75
- 99 → 83

### Ladders (Position → Destination)
- 5 → 26
- 9 → 31
- 28 → 47
- 43 → 80
- 73 → 91
- 77 → 96

---

## 🔧 Features

- **Multiplayer Support**: Play with 2, 3, or 4 players.
- **Customizable Names**: Click on your player box to set a custom name.
- **Game Logs**: View a detailed history of all moves and events.
- **Interactive Board**: 10x10 grid board with visual indicators for snakes and ladders.
- **AI Players**: Computer-controlled players that automatically roll and move.
- **Responsive Design**: Works on mobile, tablet, and desktop devices.
- **Reset Functionality**: Start a new game at any time.

---

## 🏗 Code Architecture

The game uses a modular architecture with clear separation of concerns:

- **Game.js**: Handles all game state and logic (player turns, score calculations, win conditions).
- **UI.js**: Manages the user interface (board rendering, player display, animations).
- **AI.js**: Implements AI player behavior.
- **config.js**: Centralized configuration for game rules, player setup, and board layout.
- **script.js**: Main orchestrator that ties all modules together and handles user interactions.

---

## 🚀 Running Locally

### Option 1: Direct Browser Access
Simply open the `index.html` file in your browser.

### Option 2: Using Express Server
If you have Node.js installed:

bash
npm install express
node ser.js

Then navigate to `http://localhost:3000` in your browser.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

Some ideas for future enhancements:
- Sound effects for dice rolls
- Multiplayer online support
- Undo/Redo functionality
- Dark mode theme
- Additional board animations

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

© 2026 [Aflah012](https://github.com/Aflah012)