// MODULE 6 - Use the loop counter to make colours
size(400, 400);
background(255);
colorMode(HSB, 360, 100, 100);       // colours by hue (0-360) = the rainbow wheel
noStroke();

for (int i = 0; i < 36; i++) {
  fill(i * 10, 90, 100);             // hue changes with i
  rect(i * 11, 0, 11, 400);
}
