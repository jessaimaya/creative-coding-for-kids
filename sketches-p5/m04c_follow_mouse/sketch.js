// Module 4 in p5.js - compare with ../../sketches/m04c_follow_mouse/m04c_follow_mouse.pde
let x = 200;
let y = 200;
let ease = 0.1;      // CHANGE ME

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  x = x + (mouseX - x) * ease;
  y = y + (mouseY - y) * ease;
  fill(255, 100, 150);
  ellipse(x, y, 50, 50);
}
