MI-RUN 2012/2013/2014
==

Prerequisites: nodejs (http://nodejs.org/), npm (https://npmjs.org/)

* First run `npm install` to install all dependencies.
* Optionally `npm test` to run all (unit) tests.

Sample file:
knapsack.js

Running:
--
Compile:  `node run.js compile <filename>`

Compile & run: `node run.js run <filename>`

Example knapsack program: `node run.js run knapsack.js`

Language design:
--
* JavaScript syntax with minimal features: functions, array, object, string, int, object inside array
* special functions: fs_open_file (create file handle), print (print to out), parseInt (converting string to int)
* "native" functions on "objects":

 * array: push, pop, length, slice, shift
 * file: read_line, write

VM
--
* stack-vm
* instructions - see vm_instructions.txt
* semi-implemented heap - "basic slots" but not for array/object data + etc..
* simple mark & sweep GC


TODO closures, vnorene funkce, anonymni funkce





