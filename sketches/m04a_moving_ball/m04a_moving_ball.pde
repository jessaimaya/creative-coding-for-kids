// MODULE 4 - Animation: a variable that changes
// draw() runs about 60 times per second. Like a flip-book!
int x = 0;            // where the ball is
int speed = 3;        // CHANGE ME: try 1, 10, -3

void setup() {
  size(400, 400);
}

void draw() {
  background(30, 30, 60);        // erase the last page of the flip-book
  fill(255, 200, 0);
  ellipse(x, 200, 50, 50);       // draw the ball at its NEW place
  x = x + speed;                 // change x a little each frame
}
