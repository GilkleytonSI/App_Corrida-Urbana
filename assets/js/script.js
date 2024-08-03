document.addEventListener('DOMContentLoaded', () => {
    const playerCar = document.querySelector('.player-car');
    let road = document.querySelector('.road');
    const obstaclesContainer = document.querySelector('.obstacles');
    const scoreDisplay = document.querySelector('.score');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');

    let player = {
        speed: 5,
        positionX: road.offsetWidth / 2 - playerCar.offsetWidth / 2,
        positionY: road.offsetHeight - playerCar.offsetHeight - 20,
        moveLeft: false,
        moveRight: false
    };

    let score = 0;
    let obstacleSpeed = 5;
    let obstacleInterval = 2000;
    let gameRunning = false;
    let obstacleCreationInterval;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') player.moveLeft = true;
        if (e.key === 'ArrowRight') player.moveRight = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') player.moveLeft = false;
        if (e.key === 'ArrowRight') player.moveRight = false;
    });

    playButton.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            gameLoop();
            obstacleCreationInterval = setInterval(createObstacle, obstacleInterval);
        }
    });

    pauseButton.addEventListener('click', () => {
        if (gameRunning) {
            gameRunning = false;
            clearInterval(obstacleCreationInterval);
        }
    });

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.floor(Math.random() * (road.offsetWidth - 50)) + 'px';
        obstacle.style.top = '-100px';
        obstaclesContainer.appendChild(obstacle);
    }

    function moveObstacles() {
        let obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            let obstacleY = parseInt(obstacle.style.top);
            if (obstacleY > road.offsetHeight) {
                obstacle.remove();
                score++;
                scoreDisplay.textContent = 'Pontuação: ' + score;
                adjustDifficulty();
            } else {
                obstacle.style.top = (obstacleY + player.speed) + 'px';
            }
        });
    }

    function adjustDifficulty() {
        if (score % 10 === 0) { // Aumenta a dificuldade a cada 10 pontos
            obstacleSpeed++;
            if (obstacleInterval > 500) {
                obstacleInterval -= 200;
                clearInterval(obstacleCreationInterval);
                obstacleCreationInterval = setInterval(createObstacle, obstacleInterval);
            }
        }
    }

    function checkCollision() {
        let playerRect = playerCar.getBoundingClientRect();
        let obstacles = document.querySelectorAll('.obstacle');
        for (let obstacle of obstacles) {
            let obstacleRect = obstacle.getBoundingClientRect();
            if (
                playerRect.left < obstacleRect.right &&
                playerRect.right > obstacleRect.left &&
                playerRect.top < obstacleRect.bottom &&
                playerRect.bottom > obstacleRect.top
            ) {
                alert('Game Over! Pontuação: ' + score);
                window.location.reload();
            }
        }
    }

    function gameLoop() {
        if (!gameRunning) return;

        if (player.moveLeft && player.positionX > 0) {
            player.positionX -= player.speed;
        }
        if (player.moveRight && player.positionX < road.offsetWidth - playerCar.offsetWidth) {
            player.positionX += player.speed;
        }

        playerCar.style.left = player.positionX + 'px';

        moveObstacles();
        
        checkCollision();

        requestAnimationFrame(gameLoop);
    }
});
