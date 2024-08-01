const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 160, y: 160 }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.addEventListener('keydown', changeDirection);
let gameInterval = setInterval(updateGame, 150);  

function updateGame() {
    moveSnake();
    if (isGameOver()) return;
    clearCanvas();
    drawGrid();
    drawFood();
    drawSnake();
    displayScore();
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
    ctx.strokeStyle = '#333';
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'UP': head.y -= gridSize; break;
        case 'DOWN': head.y += gridSize; break;
        case 'LEFT': head.x -= gridSize; break;
        case 'RIGHT': head.x += gridSize; break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    return { x, y };
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 38 && direction !== 'DOWN') direction = 'UP';
    if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

function isGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
        return true;
    }
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return true;
        }
    }
    return false;
}

function endGame() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    alert(`Game Over! Your score: ${score}`);
    setTimeout(() => document.location.reload(), 500);  
}

function displayScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`High Score: ${highScore}`, 10, 40);
}
