// MODULE 7 - Functions: write the recipe once, use it many times
void setup() {
  size(500, 300);
  background(135, 206, 250);
  noStroke();
  fill(80, 170, 80);
  rect(0, 220, 500, 80);          // grass

  drawHouse();                    // run the recipe
}

void drawHouse() {                // the recipe
  fill(230, 200, 150);
  rect(60, 150, 100, 80);         // walls
  fill(180, 60, 60);
  triangle(50, 150, 110, 100, 170, 150);   // roof
  fill(100, 60, 30);
  rect(100, 190, 20, 40);         // door
}
