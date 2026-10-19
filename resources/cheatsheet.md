# Processing Cheat Sheet (print this!)

## Program shape
```java
int x = 0;                  // 1. variables at the top

void setup() {              // 2. runs once
  size(400, 400);
}

void draw() {               // 3. runs ~60 times a second
  background(255);
  ellipse(x, 200, 50, 50);
  x = x + 2;
}
```

## Shapes (the canvas starts at (0, 0) in the TOP-LEFT; y goes DOWN)
| Code | Meaning |
|---|---|
| `ellipse(x, y, w, h)` | oval, (x, y) = centre |
| `rect(x, y, w, h)` | rectangle, (x, y) = top-left |
| `line(x1, y1, x2, y2)` | line |
| `triangle(x1,y1, x2,y2, x3,y3)` | triangle |
| `point(x, y)` | one dot |
| `arc(x, y, w, h, start, stop)` | piece of an oval (angles in radians; `PI` = half-turn) |

## Colour
| Code | Meaning |
|---|---|
| `background(r, g, b)` | paint the whole canvas |
| `fill(r, g, b)` / `fill(grey)` | colour inside shapes |
| `fill(r, g, b, alpha)` | with transparency (0-255) |
| `stroke(r, g, b)` / `strokeWeight(n)` | outline colour / thickness |
| `noFill()` / `noStroke()` | turn them off |
| `colorMode(HSB, 360, 100, 100)` | pick colours by hue (rainbow) |

## Variables
```java
int score = 0;          // whole numbers
float speed = 2.5;      // decimals
boolean on = true;      // true / false
color c = color(255, 0, 0);
```

## Built-in variables
`width`, `height`, `mouseX`, `mouseY`, `frameCount`

## Decisions
```java
if (x > 200) { ... } else if (x > 100) { ... } else { ... }
// comparisons:  <  >  <=  >=  ==  !=
// and: &&     or: ||     not: !
```

## Loops
```java
for (int i = 0; i < 10; i++) {   // 0,1,2,...,9
  ...
}
```

## Functions
```java
void drawHouse(float x, float y) { ... }   // define
drawHouse(100, 200);                        // call

boolean isBig(float n) { return n > 100; }  // returns an answer
```

## Arrays and lists
```java
float[] x = new float[10];      // 10 boxes: x[0] ... x[9]
x[3] = 42;
x.length                        // how many boxes
ArrayList<Ball> balls = new ArrayList<Ball>();
balls.add(new Ball());  balls.get(0);  balls.remove(0);  balls.size();
```

## Events
`void mousePressed() { }` · `void keyPressed() { if (key == 'a') { } }` · `keyCode == LEFT`

## Useful functions
`random(a, b)` · `dist(x1, y1, x2, y2)` · `map(v, a, b, c, d)` · `abs(n)` · `sin(a)` · `cos(a)` · `int(n)` · `println(x)` · `saveFrame("pic-####.png")` · `noLoop()` · `redraw()`
