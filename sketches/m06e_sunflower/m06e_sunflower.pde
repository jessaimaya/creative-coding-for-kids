// MODULE 6 - Coding Train Challenge #30: Phyllotaxis (a sunflower from one loop)
// Each seed turns a little further round than the one before, and sits a little further out.
// Real sunflowers use the "golden angle", 137.5 degrees. Change it by a tiny bit and watch!
int seeds = 600;          // CHANGE ME: how many seeds
float turn = 137.5;       // CHANGE ME: try 137.3, 137.6, 90, 100, 180
float spread = 7;         // CHANGE ME: how far apart the seeds sit

void setup() {
  size(500, 500);
  background(20);
  noStroke();
  colorMode(HSB, 360, 100, 100);       // one number (hue) sweeps the rainbow, like m06c

  for (int i = 0; i < seeds; i++) {
    float angle = radians(i * turn);   // how far round this seed is
    float distance = spread * sqrt(i); // how far out from the middle

    // cos() and sin() turn "an angle and a distance" into x and y.
    // Treat them as a helper for now: they always point round a circle.
    float x = width / 2 + cos(angle) * distance;
    float y = height / 2 + sin(angle) * distance;

    fill(i % 360, 80, 100);
    ellipse(x, y, 9, 9);
  }
}
