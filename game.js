const gameArea = document.getElementById('gameArea');
const spaceship = document.querySelector('.spaceship');
const scoreBoard = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const retryButton = document.getElementById('retryButton');

let positionX = window.innerWidth / 2;
let positionY = window.innerHeight * 0.8;
const speed = 40;
let score = 0;
let gameInterval;
let gameOver = false;

// Atualiza a posição da nave
function updatePosition() {
  spaceship.style.left = `${positionX}px`;
  spaceship.style.top = `${positionY}px`;
}

// Controla a nave com as setas do teclado
document.addEventListener('keydown', (event) => {
  if (gameOver) return; // Não permite movimento após o Game Over

  switch (event.key) {
    case 'ArrowUp':
      positionY = Math.max(0, positionY - speed);
      break;
    case 'ArrowDown':
      positionY = Math.min(window.innerHeight - 50, positionY + speed);
      break;
    case 'ArrowLeft':
      positionX = Math.max(0, positionX - speed);
      break;
    case 'ArrowRight':
      positionX = Math.min(window.innerWidth - 50, positionX + speed);
      break;
    case ' ':
      fireBullet(); // Dispara ao pressionar a barra de espaço
      break;
  }
  updatePosition();
});


gameArea.addEventListener('mousemove', (event) => {
  positionX = event.clientX - 25; // Centraliza a nave no mouse
  positionY = event.clientY - 25;
  updatePosition();
});


// Adiciona inimigos em posições aleatórias que se movem em direção à nave
function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');

  const randomX = Math.random() * (window.innerWidth - 50);
  const startY = -50; // Começa fora da tela (acima)

  enemy.style.left = `${randomX}px`;
  enemy.style.top = `${startY}px`;

  gameArea.appendChild(enemy);

  const moveInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(moveInterval);
      return;
    }

    const enemyRect = enemy.getBoundingClientRect();
    const spaceshipRect = spaceship.getBoundingClientRect();

    // Verifica colisão com a nave
    if (
      enemyRect.left < spaceshipRect.right &&
      enemyRect.right > spaceshipRect.left &&
      enemyRect.top < spaceshipRect.bottom &&
      enemyRect.bottom > spaceshipRect.top
    ) {
      clearInterval(moveInterval);
      endGame();
    }

    // Move o inimigo para baixo
    const enemyTop = parseInt(enemy.style.top);
    enemy.style.top = `${enemyTop + 5}px`;

    // Remove o inimigo se sair da tela
    if (enemyTop > window.innerHeight) {
      clearInterval(moveInterval);
      enemy.remove();
    }
  }, 50);
}

// Dispara projéteis
function fireBullet() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');

  bullet.style.left = `${positionX - 3}px`; // Centraliza o tiro na nave
  bullet.style.top = `${positionY - 30}px`;

  gameArea.appendChild(bullet);

  const interval = setInterval(() => {
    const bulletTop = parseInt(bullet.style.top);
    bullet.style.top = `${bulletTop - 10}px`;

    if (bulletTop < 0) {
      clearInterval(interval);
      bullet.remove();
    } else {
      checkCollision(bullet, interval);
    }
  }, 20);

}

// Verifica colisão entre projéteis e inimigos
function checkCollision(bullet, interval) {
  const enemies = document.querySelectorAll('.enemy');

  enemies.forEach((enemy) => {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top
    ) {
      // Colisão detectada
      enemy.remove();
      bullet.remove();
      clearInterval(interval);
      updateScore();
    }
  });
}

// Atualiza a pontuação
function updateScore() {
  score += 10;
  scoreBoard.innerText = `Score: ${score}`;
}

// Finaliza o jogo
function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  gameOverScreen.style.display = 'flex';
}

// Reinicia o jogo
retryButton.addEventListener('click', () => {
  location.reload(); // Recarrega a página
});

// Inicia o jogo
function startGame() {
  gameInterval = setInterval(spawnEnemy, 2000);
}

startGame();
