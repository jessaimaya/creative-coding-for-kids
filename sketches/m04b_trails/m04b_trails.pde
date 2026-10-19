// MODULE 4 - Trails: don't fully erase the page
// A see-through background (the 2nd number is transparency) leaves ghosts behind.
void setup() {
  size(400, 400);
  background(0);
}

void draw() {
  noStroke();
  fill(0, 25);                   // CHANGE ME: 255 = no trail, 5 = long trail
  rect(0, 0, width, height);

  float y = height/2 + sin(frameCount * 0.05) * 120;   // wave up and down
  float x = (frameCount * 3) % width;                  // wrap around the edge
  fill(0, 255, 200);
  ellipse(x, y, 30, 30);
}
