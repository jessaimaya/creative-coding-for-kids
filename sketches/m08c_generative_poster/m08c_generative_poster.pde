// MODULE 8 - Generative poster: loops + random + if
// Click = new poster.   Press S = save a PNG in this sketch's folder.
void setup() {
  size(500, 500);
  noLoop();
}

void draw() {
  background(250, 245, 230);
  noStroke();
  int cell = 50;                                    // CHANGE ME: 25, 50, 100
  for (int gx = 0; gx < width; gx += cell) {
    for (int gy = 0; gy < height; gy += cell) {
      float pick = random(1);
      if (pick < 0.4) {
        fill(230, 70, 60);
        ellipse(gx + cell/2, gy + cell/2, cell * 0.8, cell * 0.8);
      } else if (pick < 0.7) {
        fill(40, 90, 170);
        rect(gx + 5, gy + 5, cell - 10, cell - 10);
      } else if (pick < 0.85) {
        fill(250, 190, 40);
        triangle(gx + 5, gy + cell - 5, gx + cell/2, gy + 5, gx + cell - 5, gy + cell - 5);
      }                                              // otherwise: leave empty
    }
  }
}

void mousePressed() {
  redraw();
}

void keyPressed() {
  if (key == 's') {
    saveFrame("poster-####.png");
  }
}
