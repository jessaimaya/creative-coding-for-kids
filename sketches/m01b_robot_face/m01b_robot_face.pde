// MODULE 1 - Robot face
// Every shape is one line. Change the numbers marked CHANGE ME to build YOUR robot.
size(400, 400);
background(200, 220, 240);

fill(180);
rect(100, 80, 200, 220);          // head - CHANGE ME: make it wider or taller

fill(255);
ellipse(160, 160, 50, 50);        // left eye
ellipse(240, 160, 50, 50);        // right eye

fill(0);
ellipse(160, 160, 20, 20);        // left pupil
ellipse(240, 160, 20, 20);        // right pupil

fill(255, 80, 80);
rect(150, 240, 100, 20);          // mouth - CHANGE ME

line(200, 80, 200, 40);           // antenna
fill(255, 220, 0);
ellipse(200, 35, 20, 20);         // antenna light

// STRETCH: add ears, a nose, a body, buttons...
