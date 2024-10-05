// app.js

// DOM elements
const cells = document.querySelectorAll('.cell');
const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-game');
const gameModeButtons = document.getElementById('game-mode');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAiButton = document.getElementById('player-vs-ai');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let gameActive = true;
let playAgainstAI = false; // Boolean to differentiate between modes

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Game Mode Selection
playerVsPlayerButton.addEventListener('click', () => startGame(false));
playerVsAiButton.addEventListener('click', () => startGame(true));

function startGame(aiMode) {
    playAgainstAI = aiMode;
    gameModeButtons.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    gameState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
}

// Handling clicks for both modes
function handleClick(event) {
    const index = event.target.getAttribute('data-index');

    if (gameState[index] !== null || !gameActive) return;

    gameState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
        alert(`${currentPlayer} wins!`);
        gameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== null)) {
        alert('It\'s a draw!');
        gameActive = false;
        return;
    }

    if (playAgainstAI && currentPlayer === 'X') {
        currentPlayer = 'O';
        aiMove();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// AI Move for Player vs AI mode
function aiMove() {
    const bestMove = findBestMove();
    gameState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWin()) {
        alert('O wins!');
        gameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== null)) {
        alert('It\'s a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
}

// Check if a player has won
function checkWin() {
    return winningConditions.some(condition => 
        condition.every(index => gameState[index] === currentPlayer)
    );
}

// Minimax function for AI
function minimax(newGameState, depth, isMaximizing) {
    const score = evaluate(newGameState);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!newGameState.includes(null)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newGameState[i] === null) {
                newGameState[i] = 'O';
                best = Math.max(best, minimax(newGameState, depth + 1, false));
                newGameState[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newGameState[i] === null) {
                newGameState[i] = 'X';
                best = Math.min(best, minimax(newGameState, depth + 1, true));
                newGameState[i] = null;
            }
        }
        return best;
    }
}

// Evaluate board to see if there is a win
function evaluate(newGameState) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (newGameState[a] === 'O' && newGameState[b] === 'O' && newGameState[c] === 'O') {
            return 10;
        }
        if (newGameState[a] === 'X' && newGameState[b] === 'X' && newGameState[c] === 'X') {
            return -10;
        }
    }
    return 0;
}

// Find the best move for AI using Minimax
function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === null) {
            gameState[i] = 'O';
            let moveVal = minimax(gameState, 0, false);
            gameState[i] = null;

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

// Reset game button
resetButton.addEventListener('click', resetGame);

function resetGame() {
    gameState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    gameBoard.classList.add('hidden');
    resetButton.classList.add('hidden');
    gameModeButtons.classList.remove('hidden');
}

// Add event listener for player moves
cells.forEach(cell => cell.addEventListener('click', handleClick));
