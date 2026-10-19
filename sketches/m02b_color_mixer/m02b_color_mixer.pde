// MODULE 2 - Colour mixer
// Left-right changes RED, up-down changes GREEN, blue stays at 150.
// Watch the numbers. Colour = three dials from 0 to 255.
void setup() {
  size(400, 400);
}

void draw() {
  float r = map(mouseX, 0, width, 0, 255);
  float g = map(mouseY, 0, height, 0, 255);
  background(r, g, 150);             // CHANGE ME: try a different blue
  fill(255);
  text("R " + int(r) + "   G " + int(g) + "   B 150", 10, 20);
}
