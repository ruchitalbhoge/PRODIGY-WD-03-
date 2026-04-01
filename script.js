const boardEl = document.getElementById("board");
const statusText = document.getElementById("status");
const modeText = document.getElementById("modeText");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

let scores = { X: 0, O: 0, D: 0 };

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

modeText.innerText = mode === "ai" ? "AI Mode 🤖" : "Two Player Mode 👥";

createBoard();

function createBoard() {
    boardEl.innerHTML = "";
    board.forEach((cell, i) => {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = cell;
        div.onclick = () => makeMove(i);
        boardEl.appendChild(div);
    });
}

function makeMove(i) {
    if (!gameActive || board[i]) return;

    clickSound.play();
    board[i] = currentPlayer;
    createBoard();

    if (checkWin(currentPlayer)) {
        winSound.play();
        statusText.innerText = `${currentPlayer} Wins 🎉`;
        scores[currentPlayer]++;
        updateScore();
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        drawSound.play();
        statusText.innerText = "Draw 🤝";
        scores.D++;
        updateScore();
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s turn`;

    if (mode === "ai" && currentPlayer === "O") {
        setTimeout(() => {
            const bestMove = minimax(board, "O").index;
            makeMove(bestMove);
        }, 300);
    }
}

/* ---------- MINIMAX ---------- */
function minimax(newBoard, player) {
    const empty = newBoard
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    if (checkWin("X", newBoard)) return { score: -10 };
    if (checkWin("O", newBoard)) return { score: 10 };
    if (empty.length === 0) return { score: 0 };

    let moves = [];

    empty.forEach(i => {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        let result = minimax(newBoard, player === "O" ? "X" : "O");
        move.score = result.score;

        newBoard[i] = "";
        moves.push(move);
    });

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach(m => {
            if (m.score > bestScore) {
                bestScore = m.score;
                bestMove = m;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(m => {
            if (m.score < bestScore) {
                bestScore = m.score;
                bestMove = m;
            }
        });
    }
    return bestMove;
}

function checkWin(player, b = board) {
    return winPatterns.some(p => p.every(i => b[i] === player));
}

function updateScore() {
    document.getElementById("xScore").innerText = scores.X;
    document.getElementById("oScore").innerText = scores.O;
    document.getElementById("drawScore").innerText = scores.D;
}

function resetGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = "Player X's turn";
    createBoard();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}