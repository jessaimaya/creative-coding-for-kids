// MODULE 2 - Coordinate finder (a TOOL: just copy it, you'll understand every line later)
// Move the mouse. The numbers show where you are. Use them in your own sketches!
void setup() {
  size(400, 400);
}

void draw() {
  background(255);

  stroke(220);                       // light grey grid lines every 50 pixels
  for (int i = 0; i <= width; i += 50) {
    line(i, 0, i, height);
    line(0, i, width, i);
  }

  stroke(0);
  fill(0);
  text("x: " + mouseX + "   y: " + mouseY, 10, 20);
  noFill();
  ellipse(mouseX, mouseY, 20, 20);
}
