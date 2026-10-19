// MODULE 5 - A true/false variable (boolean) remembers on/off
boolean lightOn = false;

void setup() {
  size(400, 400);
}

void draw() {
  if (lightOn) {
    background(255, 240, 150);     // lights on
    fill(255, 255, 0);
  } else {
    background(20, 20, 50);        // lights off
    fill(80);
  }
  ellipse(200, 200, 150, 150);     // the lamp
  fill(255);
  text("click to toggle", 10, 20);
}

void mousePressed() {              // runs once each time you click
  lightOn = !lightOn;              // ! means "the opposite"
}
