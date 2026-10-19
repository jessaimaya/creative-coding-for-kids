// MODULE 6 - A loop inside a loop makes a GRID
// Outer loop = rows. Inner loop = columns.
size(400, 400);
background(255);

for (int row = 0; row < 8; row++) {          // CHANGE ME
  for (int col = 0; col < 8; col++) {        // CHANGE ME
    fill(row * 30, col * 30, 150);
    rect(col * 50, row * 50, 50, 50);
  }
}
