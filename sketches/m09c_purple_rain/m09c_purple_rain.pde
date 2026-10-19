// MODULE 9 - Coding Train Challenge #4: Purple Rain
// Every drop is an object with its own x, y, speed and "closeness" (z).
// Close drops (big z) are longer, thicker and faster. That fakes 3D depth!
class Drop {
  float x, y, z, len, speed;

  Drop() {                               // the constructor builds a new Drop
    x = random(width);
    y = random(-500, -50);               // start above the window
    z = random(0, 20);                   // 0 = far away, 20 = close
    len = map(z, 0, 20, 8, 22);          // map(): turn 0..20 into 8..22
    speed = map(z, 0, 20, 3, 12);
  }

  void fall() {
    y = y + speed;
    if (y > height) {                    // fell off the bottom? back to the top
      y = random(-200, -50);
    }
  }

  void show() {
    stroke(138, 43, 226);                // CHANGE ME: rain colour
    strokeWeight(map(z, 0, 20, 1, 3));
    line(x, y, x, y + len);
  }
}

Drop[] drops = new Drop[400];            // CHANGE ME: how many drops?

void setup() {
  size(500, 400);
  for (int i = 0; i < drops.length; i++) {
    drops[i] = new Drop();
  }
}

void draw() {
  background(230, 230, 250);             // CHANGE ME: sky colour
  for (int i = 0; i < drops.length; i++) {
    drops[i].fall();
    drops[i].show();
  }
}
