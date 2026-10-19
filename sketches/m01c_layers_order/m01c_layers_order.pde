// MODULE 1 - Order matters!
// The computer reads from top to bottom. Later shapes are painted ON TOP.
// PREDICT first: which square will be in front?  Then run it.
// THEN: swap the order of two lines and run again.
size(400, 400);
background(255);

fill(255, 0, 0);
rect(100, 100, 150, 150);   // red

fill(0, 200, 0);
rect(150, 150, 150, 150);   // green

fill(0, 0, 255);
rect(200, 200, 150, 150);   // blue
