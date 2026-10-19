// MODULE 8 - Arrays: a numbered row of boxes (30 bubbles, not 30 variables!)
int n = 30;                      // CHANGE ME
float[] x = new float[n];
float[] y = new float[n];
float[] speed = new float[n];
float[] diam = new float[n];

void setup() {
  size(400, 500);
  for (int i = 0; i < n; i++) {
    x[i] = random(width);
    y[i] = random(height);
    speed[i] = random(0.5, 3);
    diam[i] = random(10, 50);
  }
  noFill();
  stroke(255);
}

void draw() {
  background(10, 40, 90);
  for (int i = 0; i < n; i++) {
    y[i] = y[i] - speed[i];                // float up
    if (y[i] < -diam[i]) {                 // off the top? restart at the bottom
      y[i] = height + diam[i];
    }
    ellipse(x[i], y[i], diam[i], diam[i]);
  }
}
