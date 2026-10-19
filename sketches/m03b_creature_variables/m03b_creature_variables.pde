// MODULE 3 - Design-a-creature with variables
// All the "dials" are at the top. Change them, run, and meet a new creature.
size(400, 400);
background(240, 250, 255);

int bodyW = 160;      // CHANGE ME
int bodyH = 200;      // CHANGE ME
int eyeSize = 40;     // CHANGE ME
int red = 120;        // CHANGE ME (0-255)
int green = 200;      // CHANGE ME
int blue = 140;       // CHANGE ME

fill(red, green, blue);
ellipse(200, 230, bodyW, bodyH);                   // body

fill(255);
ellipse(170, 190, eyeSize, eyeSize);               // eyes
ellipse(230, 190, eyeSize, eyeSize);
fill(0);
ellipse(170, 190, eyeSize/2, eyeSize/2);
ellipse(230, 190, eyeSize/2, eyeSize/2);

line(170, 330, 170, 370);                          // legs
line(230, 330, 230, 370);

// STRETCH: add a variable for the number of... (wait for Module 6!)
