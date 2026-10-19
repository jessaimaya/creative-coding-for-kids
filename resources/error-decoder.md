# Error decoder: red messages in kid language

Red text at the bottom of the Processing window is the computer saying "I got confused HERE". **Read the line number, then look at that line and the one above it.**

| Message (as Processing 4 prints it) | What it usually means | Try this |
|---|---|---|
| `Syntax Error ...` (often mentions a missing `;`, `)` or `}`) | A line is missing a closing piece | Look at the line reported **and the one above it** |
| `Syntax Error - Missing ')'?` | A parenthesis isn't closed, e.g. `ellipse(200,200,50,50;` | Count the `(` and `)` |
| `The method ellipse(float, float, float, float) in the type PApplet is not applicable for the arguments (int, int, int)` | Wrong number of arguments (here 3 instead of 4) | Check the cheat sheet for what that function needs |
| `D cannot be resolved to a variable` | Misspelled name (capital letters matter), never declared, or declared in a different function | Check spelling, and where it was declared |
| `Type mismatch: cannot convert from float to int` | Put a decimal into an `int` box | Make the variable a `float`, or use `int(...)` |
| `Duplicate local variable d` | Declared the same variable twice | Remove the second `int`; just write `d = 2;` |
| `NullPointerException` (at run time) | Used an object that was never created | Did you call `new`? |
| `ArrayIndexOutOfBoundsException` (at run time) | Asked for a mailbox that doesn't exist | Check the loop limit (`<` vs `<=`) |
| *Window freezes / won't stop* | An infinite loop | Press Stop; check the loop counter moves in the right direction |
| *No error, nothing appears* | Shapes drawn off-screen, covered, or the same colour as the background | Use the coordinate finder; check the order; check `fill` |
| *Shapes smear across the screen* | `background()` is missing or comes after the shapes | Put `background()` first in `draw()` |

The first five messages were checked against Processing 4.5 for this course; the last four are behaviours rather than messages.
