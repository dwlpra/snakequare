const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [{x: 9 * box, y: 10 * box}];
let food = randomFoodPosition();
let score = 0;
let d, game, speed = 120;

document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

function randomFoodPosition() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radius) {
  this.moveTo(x + radius, y);
  this.arcTo(x + w, y, x + w, y + h, radius);
  this.arcTo(x + w, y + h, x, y + h, radius);
  this.arcTo(x, y + h, x, y, radius);
  this.arcTo(x, y, x + w, y, radius);
};

function drawSnakeSegment(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, box, box, 6);
  ctx.fill();
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) return true;
  }
  return false;
}

function gameOverEffect() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  ctx.shadowBlur = 10;
  ctx.shadowColor = "gold";
  ctx.fillStyle = "gold";
  ctx.fillRect(food.x, food.y, box, box);
  ctx.shadowBlur = 0;

  for (let i = 0; i < snake.length; i++) {
    drawSnakeSegment(snake[i].x, snake[i].y, i == 0 ? "#34d399" : "#a7f3d0");
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = randomFoodPosition();
  } else {
    snake.pop();
  }

  let newHead = {x: snakeX, y: snakeY};

  if (snakeX < 0 || snakeY < 0 || snakeX >= 400 || snakeY >= 400 || collision(newHead, snake)) {
    clearInterval(game);
    gameOverEffect();
    return;
  }

  snake.unshift(newHead);
  document.getElementById('score').innerText = "Score: " + score;
}

game = setInterval(draw, speed);

document.getElementById("restartButton").onclick = () => {
  clearInterval(game);
  snake = [{x: 9 * box, y: 10 * box}];
  food = randomFoodPosition();
  score = 0;
  d = undefined;
  document.getElementById('score').innerText = "Score: " + score;
  game = setInterval(draw, speed);
};