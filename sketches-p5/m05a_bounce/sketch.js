// Module 5 in p5.js - compare with ../../sketches/m05a_bounce/m05a_bounce.pde
let x = 200;
let y = 100;
let xSpeed = 3;      // CHANGE ME
let ySpeed = 2;      // CHANGE ME
let r = 25;          // radius

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  x = x + xSpeed;
  y = y + ySpeed;

  if (x > width - r || x < r) {
    xSpeed = -xSpeed;
  }
  if (y > height - r || y < r) {
    ySpeed = -ySpeed;
  }

  fill(80, 160, 255);
  ellipse(x, y, r * 2, r * 2);
}
