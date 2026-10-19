// MODULE 10 - Catch the stars! (a complete tiny game)
// States: 0 = title, 1 = playing, 2 = game over
int state = 0;
int score = 0;
int lives = 3;

float starX, starY;
float starSpeed = 3;          // CHANGE ME: difficulty
float paddleW = 100;          // CHANGE ME: easier = wider

void setup() {
  size(400, 500);
  newStar();
}

void draw() {
  background(20, 20, 60);

  if (state == 0) {
    fill(255);
    textAlign(CENTER);
    text("CATCH THE STARS\nmove with the mouse\nclick to start", width/2, 200);
  } else if (state == 1) {
    playGame();
  } else {
    fill(255, 100, 100);
    textAlign(CENTER);
    text("GAME OVER\nscore: " + score + "\nclick to play again", width/2, 200);
  }
}

void playGame() {
  // move the star
  starY = starY + starSpeed;

  // draw the star and the paddle
  fill(255, 230, 0);
  ellipse(starX, starY, 24, 24);
  fill(100, 220, 255);
  rect(mouseX - paddleW/2, height - 40, paddleW, 15);

  // caught?
  if (starY > height - 40 && starY < height - 20 && abs(starX - mouseX) < paddleW/2) {
    score++;
    starSpeed = starSpeed + 0.1;        // gets faster
    newStar();
  }
  // missed?
  if (starY > height) {
    lives--;
    newStar();
    if (lives == 0) {
      state = 2;
    }
  }

  // scoreboard
  fill(255);
  textAlign(LEFT);
  text("score: " + score + "   lives: " + lives, 10, 20);
}

void newStar() {
  starX = random(20, width - 20);
  starY = -10;
}

void mousePressed() {
  if (state != 1) {
    state = 1;
    score = 0;
    lives = 3;
    starSpeed = 3;
    newStar();
  }
}
