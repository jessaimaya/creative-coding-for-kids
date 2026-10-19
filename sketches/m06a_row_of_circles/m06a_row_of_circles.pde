// MODULE 6 - Loops: repeat without copy-paste
// First count the circles. Then change 10 to 20 and run again.
size(400, 400);
background(255);

for (int i = 0; i < 10; i++) {        // CHANGE ME: 10 -> how many circles
  ellipse(30 + i * 35, 200, 30, 30);  // i takes the values 0, 1, 2, ... 9
}
