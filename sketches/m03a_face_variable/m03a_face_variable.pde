// MODULE 3 - One variable, whole face
// DECLARE it, USE it, then CHANGE it.
size(400, 400);
background(255);

int faceSize = 200;        // 1. DECLARE.  CHANGE ME: try 100, 300, 380
int cx = 200;              // centre x
int cy = 200;              // centre y

fill(255, 220, 100);
ellipse(cx, cy, faceSize, faceSize);                                  // 2. USE: head

fill(0);
ellipse(cx - faceSize/4, cy - faceSize/8, faceSize/8, faceSize/8);    // left eye
ellipse(cx + faceSize/4, cy - faceSize/8, faceSize/8, faceSize/8);    // right eye

noFill();
arc(cx, cy + faceSize/8, faceSize/2, faceSize/3, 0, PI);              // smile
