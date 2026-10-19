// MODULE 3 - Variables can do maths
// Change ONLY the first variable and watch everything else follow.
size(400, 400);
background(255);

int base = 40;                 // CHANGE ME
int double1 = base * 2;
int triple = base * 3;
int sum = base + double1 + triple;

println("base = " + base);     // println prints to the black console below
println("sum  = " + sum);

fill(255, 100, 100);
rect(20, 50, base, base);
fill(100, 200, 100);
rect(20, 120, double1, base);
fill(100, 100, 255);
rect(20, 190, triple, base);
