# Vecalc

Vecalc (Vector Calculator) is a little web-based helper for basic vector math.

Release: https://marianpekar.github.io/vecalc/

It takes two vectors on the input (via dat-gui on the top right corner) and computes their **addition, subtraction, dot product, cross product, magnitudes of all vectors, the angles among them and also between each axis for each of them as well**. The Angles are presented in form of a pair-wise cross table, via dat-gui you can switch between **degrees and radians**.

All the other outputs are presented in the top left corner. Precision could be set in range from 1 to 3 decimals.

All vectors are visualized in 3D space with axes thanks to THREE.js. In case you want to see normalized versions of these vectors, in dat-gui tick **Show Normalized**. You can also hide axis by unticking **Show Axes**

## Orbit Controlls

You can **rotate and move around** using mouse and keys:

- Scroll up/down: zoom in/out
- LMB + Move: rotate
- RMB + Move or arrow keys: traverse

