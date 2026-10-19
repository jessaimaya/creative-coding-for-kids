// MODULE 6 - Loop + if together: alternating target
size(400, 400);
background(255);
noStroke();

int ring = 0;
for (int d = 400; d > 0; d -= 40) {          // CHANGE ME: try d -= 20
  if (ring % 2 == 0) {                       // % gives the remainder: 0, 1, 0, 1 ...
    fill(220, 40, 40);
  } else {
    fill(255);
  }
  ellipse(200, 200, d, d);
  ring++;                                    // ring = ring + 1
}
