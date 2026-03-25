const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreBoard");
const highElement = document.getElementById("highScoreBoard");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
let snake, food, direction, nextDirection, score, gameInterval;

// Load High Score
let highScore = localStorage.getItem("snakeHighScore") || 0;
let highScoreName = localStorage.getItem("snakeHighScoreName") || "None";
highElement.innerText = `High Score: ${highScore} (${highScoreName})`;

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    generateFood();
    direction = null;
    nextDirection = null;
    score = 0;
    scoreElement.innerText = "Score: 0";
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, 100);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
    };
}

// Key listeners
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

// Button listeners for mobile
document.getElementById("upBtn").onclick = () => { if(direction !== "DOWN") nextDirection = "UP"; };
document.getElementById("downBtn").onclick = () => { if(direction !== "UP") nextDirection = "DOWN"; };
document.getElementById("leftBtn").onclick = () => { if(direction !== "RIGHT") nextDirection = "LEFT"; };
document.getElementById("rightBtn").onclick = () => { if(direction !== "LEFT") nextDirection = "RIGHT"; };
restartBtn.onclick = initGame;

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    direction = nextDirection;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    if (direction) {
        if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || 
            snake.some((seg, i) => i !== 0 && seg.x === headX && seg.y === headY)) {
            clearInterval(gameInterval);
            checkHighScore();
            return;
        }
    }

    let newHead = { x: headX, y: headY };

    if (headX === food.x && headY === food.y) {
        score++;
        scoreElement.innerText = "Score: " + score;
        generateFood();
    } else {
        if (direction) snake.pop();
    }

    if (direction) snake.unshift(newHead);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    snake.forEach((segment) => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "white";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

function checkHighScore() {
    if (score > highScore) {
        const playerName = prompt("NEW HIGH SCORE! Enter your name:");
        highScore = score;
        highScoreName = playerName || "Anonymous";
        localStorage.setItem("snakeHighScore", highScore);
        localStorage.setItem("snakeHighScoreName", highScoreName);
        highElement.innerText = `High Score: ${highScore} (${highScoreName})`;
    } else {
        alert("Game Over! Score: " + score);
    }
}

initGame();
