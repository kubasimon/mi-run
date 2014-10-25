MI-RUN 2012/2013/2014/2015
==
Compiler & VM for JavaScript subset called 'Domino'

[![Build Status](https://travis-ci.org/tenerd/mi-run.svg?branch=master)](https://travis-ci.org/tenerd/mi-run)

How to start
---
Prerequisites: nodejs (http://nodejs.org/), npm (https://npmjs.org/)

* First run `npm install` inside source directory to install all dependencies.
* Optionally `npm test` to run all (unit) tests.
* Create program in with Domino!

Sample file: <a href="knapsack.js">knapsack.js</a>

Example of input: <a href="compiler/fixture/knapsack.in.10.dat">knapsack.in.10.dat</a>

    - plain text file with line endings "\n" 
    
Example of output: <a href="compiler/fixture/knapsack.out.10.dat">knapsack.out.10.dat</a>

    - plain text file with line endings "\n"

Running programs in my language:
--
Compile:  `node domino.js compile <filename>` 
    - to bytecode <filename>.json

Compile & run: `node domino.js run <filename>`
    - also generates bytecode <filename>.json

Example knapsack program: `node domino.js run knapsack.js`

Language design:
--
* JavaScript syntax with minimal features: 
* functions, array, object, string, int, object inside array
* special functions: fs_open_file (create file handle), print (print to out), parseInt (converting string to int)
* "native" functions on "objects":

 * array: push, pop, length, slice, shift
 * file: read_line, write
 
* inner functions
 
~~~~ JavaScript
function main(){
    var a = 1; 
    function foo() {
        return a + 1
    } 
    print(test())
}
~~~~

* anonymous functions

~~~~ JavaScript
function main(){
    var a = 1; 
    function foo() {
        return a + 1
    } 
    print(test())
}
~~~~

* closures

~~~~ JavaScript
function main() {
    var add5 = makeAdder(5);
    var add10 = makeAdder(10);
    print (add5(2)); //7
    print (add10(2)); // 12

}

function makeAdder(x) {
    return function(y) {
        return x + y;
    };
}
~~~~

* this does not currently work:

~~~~ JavaScript
function main() {
    var num = 666;
    var sayAlert = function() { print(num); };
    sayAlert();
}
~~~~ 

 

VM
--
* stack-vm
* instructions - see vm_instructions.txt
* semi-implemented heap - "basic slots" but not for array/object data + etc..
* simple mark & sweep GC


