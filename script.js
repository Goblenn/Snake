document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const scoreElement = document.getElementById('score');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [
        { x: 10, y: 10 }
    ];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval;
    let gameSpeed = 100;
    let gameRunning = false;

    function drawGame() {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        checkFoodCollision();
    }

    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = '#2ecc71';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function drawFood() {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (!checkFoodCollision()) {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
    }

    function checkFoodCollision() {
        const head = snake[0];
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            generateFood();
            return true;
        }
        return false;
    }

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        food = newFood;
    }

    function gameOver() {
        clearInterval(gameInterval);
        gameRunning = false;
        startButton.textContent = 'Start Game';
        alert(`Game Over! Score: ${score}`);
    }

    function startGame() {
        if (gameRunning) {
            clearInterval(gameInterval);
            gameRunning = false;
            startButton.textContent = 'Start Game';
        } else {
            snake = [{ x: 10, y: 10 }];
            dx = 0;
            dy = 0;
            score = 0;
            scoreElement.textContent = score;
            generateFood();
            gameRunning = true;
            startButton.textContent = 'Stop Game';
            gameInterval = setInterval(drawGame, gameSpeed);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (!gameRunning) return;

        switch (event.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });

    startButton.addEventListener('click', startGame);
});