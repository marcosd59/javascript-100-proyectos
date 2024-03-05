const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");

canvas.width = 448;
canvas.height = 400;

/* Variables del Juego */

/* VARIABLE DE LA PELOTA */

const ballRadius = 3;

// Posición de la pelota

let x = canvas.width / 2;
let y = canvas.height - 30;

// Velocidad de la pelota

let dx = 3;
let dy = -3;

/* VARIABLE DE LA PALETA */

const paddleHeight = 10;
const paddleWidth = 50;

let rightPressed = false;
let leftPressed = false;

const PADDLE_SENSITIVITY = 8;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

/* VARIABLES DE LOS LADRILLOS */

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 30;
const brickHeight = 14;
const brickPadding = 2;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACITVE: 1,
  DESTROYED: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

    const random = Math.floor(Math.random() * 8);

    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACITVE,
      color: random,
    };
  }
}

function drawBall() {
  ctx.beginPath(); // Iniciar el dibujo
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill(); // Rellenar el círculo
  ctx.closePath();
}

function drawPaddle() {
  ctx.drawImage(
    $sprite, // Imagen
    29, // Posición X en la imagen
    174, // Posición Y en la imagen
    paddleWidth, // Tamaño de recorte
    paddleHeight, // Tamaño de recorte
    paddleX, // Posición X en el dibujo
    paddleY, // Posición Y en el dibujo
    paddleWidth, // Ancho del dibujo
    paddleHeight // Alto del dibujo
  );
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32;

      ctx.drawImage(
        $bricks, // Imagen
        clipX, // Posición X en la imagen
        0, // Posición Y en la imagen
        31,
        14,
        currentBrick.x, // Posición X en el dibujo
        currentBrick.y, // Posición Y en el dibujo
        brickWidth, // Ancho del dibujo
        brickHeight // Alto del dibujo
      );
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick =
        x > currentBrick.x && x < currentBrick.x + brickWidth;

      const isBallSameYAsBrick =
        y > currentBrick.y && y < currentBrick.y + brickHeight;

      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy;
        currentBrick.status = BRICK_STATUS.DESTROYED;
      }
    }
  }
}

function ballMovement() {
  // Rebotar en las paredes
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // Rebotar en el techo
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  // Si la pelota toca la paleta
  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
  const isBallTouchingPaddle = y + dy > paddleY;

  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy;
  }

  // Si la pelota toca el suelo
  else if (y + dy > canvas.height - ballRadius) {
    console.log("Game Over");
    document.location.reload();
  }

  // Mover la pelota
  x += dx;
  y += dy;
}

function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key == "Right" || key == "ArrowRight") {
      rightPressed = true;
    } else if (key == "Left" || key == "ArrowLeft") {
      leftPressed = true;
    }
  }
}

function keyUpHandler(event) {
  const { key } = event;
  if (key == "Right" || key == "ArrowRight") {
    rightPressed = false;
  } else if (key == "Left" || key == "ArrowLeft") {
    leftPressed = false;
  }
}

function draw() {
  cleanCanvas();
  // Limpiar el canvas
  drawBall();
  drawPaddle();
  drawBricks();

  // Colisión de la pelota
  collisionDetection();
  ballMovement();
  paddleMovement();

  window.requestAnimationFrame(draw);
}

draw();
initEvents();
