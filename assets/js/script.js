document.addEventListener('DOMContentLoaded', () => {
    const playerCar = document.querySelector('.player-car');
    const road = document.querySelector('.road');
    const obstaclesContainer = document.querySelector('.obstacles');
    const scoreDisplay = document.querySelector('.score');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const gameOverModal = document.getElementById('game-over-modal');
    const closeButton = document.querySelector('.close-button');
    const finalScore = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const backgroundMusic = document.getElementById('background-music');
    const collisionSound = document.getElementById('collision-sound');

    let player = {
        speed: 5,
        positionX: road.offsetWidth / 2 - playerCar.offsetWidth / 2,
        positionY: road.offsetHeight - playerCar.offsetHeight - 20,
        moveLeft: false,
        moveRight: false
    };

    let score = 0;
    let coinScore = 0;
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
            backgroundMusic.play();
        }
    });

    pauseButton.addEventListener('click', () => {
        if (gameRunning) {
            gameRunning = false;
            clearInterval(obstacleCreationInterval);
            backgroundMusic.pause();
        }
    });

    closeButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
    });

    restartButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
        window.location.reload();
    });

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.floor(Math.random() * (road.offsetWidth - 50)) + 'px';
        obstacle.style.top = '-100px';
        obstaclesContainer.appendChild(obstacle);

        if (Math.random() > 0.5) {
            createCoin();
        }
    }

    function createCoin() {
        const coin = document.createElement('div');
        coin.classList.add('coin');
        let coinX, coinY;

        do {
            coinX = Math.floor(Math.random() * (road.offsetWidth - 30)) + 'px';
            coinY = '-100px';
        } while (checkCoinObstacleCollision(coinX, coinY));

        coin.style.left = coinX;
        coin.style.top = coinY;
        obstaclesContainer.appendChild(coin);
    }

    function checkCoinObstacleCollision(coinX, coinY) {
        let obstacles = document.querySelectorAll('.obstacle');
        for (let obstacle of obstacles) {
            let obstacleRect = obstacle.getBoundingClientRect();
            let coinRect = {
                left: parseInt(coinX),
                top: parseInt(coinY),
                right: parseInt(coinX) + 30,
                bottom: parseInt(coinY) + 30
            };

            if (
                coinRect.left < obstacleRect.right &&
                coinRect.right > obstacleRect.left &&
                coinRect.top < obstacleRect.bottom &&
                coinRect.bottom > obstacleRect.top
            ) {
                return true;
            }
        }
        return false;
    }

    function moveObstacles() {
        let obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            let obstacleY = parseInt(obstacle.style.top);
            if (obstacleY > road.offsetHeight) {
                obstacle.remove();
                score++;
                scoreDisplay.textContent = 'Pontuação: ' + score + ' Moedas: ' + coinScore;
                adjustDifficulty();
            } else {
                obstacle.style.top = (obstacleY + obstacleSpeed) + 'px';
            }
        });

        let coins = document.querySelectorAll('.coin');
        coins.forEach(coin => {
            let coinY = parseInt(coin.style.top);
            if (coinY > road.offsetHeight) {
                coin.remove();
            } else {
                coin.style.top = (coinY + obstacleSpeed) + 'px';
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
                collisionSound.play();
                gameOver();
                return; // Evita múltiplas chamadas de gameOver
            }
        }

        let coins = document.querySelectorAll('.coin');
        coins.forEach(coin => {
            let coinRect = coin.getBoundingClientRect();
            if (
                playerRect.left < coinRect.right &&
                playerRect.right > coinRect.left &&
                playerRect.top < coinRect.bottom &&
                playerRect.bottom > coinRect.top
            ) {
                coin.remove();
                coinScore++;
                scoreDisplay.textContent = 'Pontuação: ' + score + ' Moedas: ' + coinScore;
            }
        });
    }

    function gameOver() {
        gameRunning = false;
        clearInterval(obstacleCreationInterval);
        backgroundMusic.pause();
        finalScore.textContent = 'Pontuação final: ' + score + ' | Moedas: ' + coinScore;
        gameOverModal.style.display = 'block';
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
