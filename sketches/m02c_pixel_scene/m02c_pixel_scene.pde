// MODULE 2 - Build a scene (sky, sun, hills)
// Order matters: sky first, then things in front of it.
size(500, 300);
background(135, 206, 250);           // sky

noStroke();                          // no outlines from here on
fill(255, 220, 0);
ellipse(420, 70, 80, 80);            // sun

fill(60, 160, 80);
ellipse(120, 300, 400, 200);         // back hill
fill(40, 130, 60);
ellipse(380, 320, 450, 200);         // front hill

fill(255);
ellipse(100, 60, 80, 40);            // cloud made of 3 ovals
ellipse(130, 50, 70, 45);
ellipse(155, 62, 70, 38);

// CHALLENGE: make it sunset (change the sky + sun colours)
