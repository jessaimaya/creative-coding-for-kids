// MODULE 1 - Hello, shapes!
// Change a number, press Run (the play button), see what moves.
size(400, 400);               // canvas: 400 wide, 400 tall
background(255, 240, 200);    // CHANGE ME: red, green, blue (0-255)

fill(255, 100, 100);          // paint colour for the next shapes
ellipse(200, 200, 120, 120);  // x, y, width, height

fill(80, 160, 255);
rect(50, 50, 100, 60);        // x, y = top-left corner, then width, height

line(0, 400, 400, 0);         // x1, y1, x2, y2
triangle(300, 350, 350, 250, 380, 380);
