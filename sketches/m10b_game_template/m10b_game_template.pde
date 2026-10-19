// MODULE 10 - YOUR game. A skeleton with TODOs - fill them in!
// Keep it small. Get it working. THEN make it fancy.
int state = 0;          // 0 = title, 1 = playing, 2 = game over
int score = 0;

// TODO 1: variables for your player (x, y, size, speed)
// TODO 2: variables for your enemy / collectible

void setup() {
  size(500, 500);
}

void draw() {
  background(0);
  if (state == 0) {
    fill(255);
    text("TITLE - click to start", 150, 250);
  } else if (state == 1) {
    // TODO 3: move and draw the player (mouse? arrow keys?)
    // TODO 4: move and draw the enemy / collectible
    // TODO 5: collision: if dist(...) < something -> score++ or state = 2
    fill(255);
    text("score: " + score, 10, 20);
  } else {
    fill(255, 100, 100);
    text("GAME OVER - click to retry", 140, 250);
  }
}

void mousePressed() {
  if (state != 1) {
    state = 1;
    score = 0;
  }
}

// TODO 6 (stretch): keyPressed() for keyboard controls
// TODO 7 (stretch): use a class for enemies, an array for many of them
