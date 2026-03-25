const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreBoard");
const highElement = document.getElementById("highScoreBoard");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
let snake, food, direction, nextDirection, score, gameInterval;

// Load high score and name from your computer's memory
let highScore = localStorage.getItem("snakeHighScore") || 0;
let highScoreName = localStorage.getItem("snakeHighScoreName") || "None";
highElement.innerText = `High Score: ${highScore} (${highScoreName})`;

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box,
    };
    direction = null;
    nextDirection = null;
    score = 0;
    scoreElement.innerText = "Score: 0";
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, 100);
}

document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    else if (key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    else if (key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    else if (key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

restartBtn.addEventListener("click", initGame);

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
            snake.some((seg, index) => index !== 0 && seg.x === headX && seg.y === headY)) {
            
            clearInterval(gameInterval);
            checkHighScore();
            return;
        }
    }

    let newHead = { x: headX, y: headY };

    if (headX === food.x && headY === food.y) {
        score++;
        scoreElement.innerText = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box,
        };
    } else {
        if (direction) snake.pop();
    }

    if (direction) snake.unshift(newHead);

    // Draw Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw Snake
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
        
        // Save to computer memory
        localStorage.setItem("snakeHighScore", highScore);
        localStorage.setItem("snakeHighScoreName", highScoreName);
        
        highElement.innerText = `High Score: ${highScore} (${highScoreName})`;
        alert(`Congrats ${highScoreName}! You set a new record.`);
    } else {
        alert("Game Over! Score: " + score);
    }
}

initGame();
