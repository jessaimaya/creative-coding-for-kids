// MODULE 9 - Particle fireworks. Click to launch!
ArrayList<Spark> sparks = new ArrayList<Spark>();

class Spark {
  float x, y, vx, vy;
  int life = 60;
  color c;

  Spark(float x, float y, color c) {
    this.x = x;
    this.y = y;
    this.c = c;
    float angle = random(TWO_PI);
    float speed = random(1, 5);
    vx = cos(angle) * speed;
    vy = sin(angle) * speed;
  }

  void update() {
    x = x + vx;
    y = y + vy;
    vy = vy + 0.08;                    // gravity pulls down
    life--;
  }

  void show() {
    stroke(c, map(life, 0, 60, 0, 255));
    strokeWeight(3);
    point(x, y);
  }
}

void setup() {
  size(500, 400);
}

void draw() {
  background(10, 10, 30);
  for (int i = sparks.size() - 1; i >= 0; i--) {   // loop backwards when removing
    Spark s = sparks.get(i);
    s.update();
    s.show();
    if (s.life <= 0) {
      sparks.remove(i);
    }
  }
}

void mousePressed() {
  color c = color(random(100, 255), random(100, 255), random(100, 255));
  for (int i = 0; i < 80; i++) {                    // CHANGE ME: sparks per firework
    sparks.add(new Spark(mouseX, mouseY, c));
  }
}
