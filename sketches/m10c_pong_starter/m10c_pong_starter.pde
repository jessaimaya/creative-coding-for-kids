// MODULE 10 - Coding Train Challenge #67: Pong (starter)
// Two players, one keyboard. The LEFT paddle works (W and S keys).
// Your jobs are marked TODO. Do them in order and playtest after each one.
float ballX, ballY;
float ballXSpeed = 4;     // CHANGE ME
float ballYSpeed = 3;     // CHANGE ME
float ballSize = 16;

float paddleW = 12;
float paddleH = 80;       // CHANGE ME: taller = easier
float paddleSpeed = 6;
float leftY;              // top edge of each paddle
float rightY;

boolean wDown = false;    // is W held down right now?
boolean sDown = false;
// TODO 1: two more booleans for the UP and DOWN arrow keys

int leftScore = 0;
int rightScore = 0;

void setup() {
  size(600, 400);
  leftY = height / 2 - paddleH / 2;
  rightY = leftY;
  resetBall();
}

void draw() {
  background(0);

  // 1. move the paddles
  if (wDown) leftY = leftY - paddleSpeed;
  if (sDown) leftY = leftY + paddleSpeed;
  leftY = constrain(leftY, 0, height - paddleH);   // keep it on the screen
  // TODO 2: move the right paddle with your arrow-key booleans (copy the 3 lines above)

  // 2. move the ball, bounce off the top and bottom
  ballX = ballX + ballXSpeed;
  ballY = ballY + ballYSpeed;
  if (ballY < ballSize / 2 || ballY > height - ballSize / 2) ballYSpeed = -ballYSpeed;

  // 3. hit the left paddle? (ball is moving left AND level with the paddle)
  if (ballXSpeed < 0 && ballX - ballSize / 2 < 20 + paddleW
      && ballY > leftY && ballY < leftY + paddleH) {
    ballXSpeed = -ballXSpeed;
  }
  // TODO 3: the same for the right paddle (its front edge is at width - 20 - paddleW)

  // 4. missed? a point for the other player
  if (ballX < 0) {
    rightScore++;
    resetBall();
  }
  if (ballX > width) {
    leftScore++;
    resetBall();
  }

  // 5. draw everything
  fill(255);
  noStroke();
  rect(20, leftY, paddleW, paddleH);
  rect(width - 20 - paddleW, rightY, paddleW, paddleH);
  ellipse(ballX, ballY, ballSize, ballSize);
  textAlign(CENTER);
  textSize(32);
  text(leftScore + "   " + rightScore, width / 2, 40);
  // TODO 4: first to 5 wins. Add a state variable like m10a (playing / game over)
}

void resetBall() {
  ballX = width / 2;
  ballY = height / 2;
  ballXSpeed = -ballXSpeed;                // serve towards the player who just scored
}

void keyPressed() {
  if (key == 'w' || key == 'W') wDown = true;
  if (key == 's' || key == 'S') sDown = true;
  // TODO 1b: if (keyCode == UP) ... and if (keyCode == DOWN) ...
}

void keyReleased() {
  if (key == 'w' || key == 'W') wDown = false;
  if (key == 's' || key == 'S') sDown = false;
  // TODO 1c: set your arrow-key booleans back to false
}
