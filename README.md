# MI-RUN 2012/2013/2014/2015

## Compiler & VM for JavaScript subset called 'Domino'

[![Build Status](https://travis-ci.org/tenerd/mi-run.svg?branch=master)](https://travis-ci.org/tenerd/mi-run)

## How to start

Prerequisites: nodejs (http://nodejs.org/), npm (https://npmjs.org/)

* First run `npm install` inside source directory to install all dependencies.
* Optionally `npm test` to run all (unit) tests.
* Create program in with Domino!

Sample file: <a href="knapsack.js">knapsack.js</a>

Example of input: <a href="compiler/fixture/knapsack.in.10.dat">knapsack.in.10.dat</a>

* utf8 file with line endings "\n" 
    
Example of output: <a href="compiler/fixture/knapsack.out.10.dat">knapsack.out.10.dat</a>

* utf8 file with line endings "\n"

## Running programs in my language:

Compile:  `node domino.js compile <filename>`
 
* generate bytecode to file: {filename}.json

Compile & run: `node domino.js run <filename>`

* also generate bytecode to file: {filename}.json    

Example knapsack program: `node domino.js run knapsack.js`

## Language design:

* JavaScript syntax with minimal features:
 
### Variables
 
~~~~ JavaScript
    var number = 123   // integer only, no doubles
    var string = "abc" // strings
    var array  = [1, 2, 3] // array
    var object = {field:"value", field2:2}
~~~~
 
### Functions

Integers and strings passed by value
Object, arrays are passed by reference  

#### Simple function & call

~~~~ JavaScript
function add1(a){     
    return a + 1;
}
add1(2)
~~~~

#### Inner functions
 
~~~~ JavaScript
function main(){
    var a = 1; 
    function foo() {
        return a + 1
    } 
    print(test())    // outputs 2
}
~~~~

#### Anonymous functions

~~~~ JavaScript
function main(){
    var a = 1; 
    print((function(x) {return x + a})(10) // outputs 11     
}
~~~~

#### Closures

~~~~ JavaScript
function main() {
    var add5 = makeAdder(5);
    var add10 = makeAdder(10);
    print (add5(2)); // outputs 7
    print (add10(2)); // outputs 12

}

function makeAdder(x) {
    return function(y) {
        return x + y;
    };
}
~~~~

* with exception: this does not work: 
(when closure variable is defined after function which uses it) 

~~~~ JavaScript
function main() {
    var sayAlert = function() { print(num); };
    var num = 666;
    sayAlert();
}
~~~~

### Arrays

~~~~ JavaScript
var arr  = [1, 2, 3]        // ok
var arr2 = ["a", 1]         // heterogeneous array
var arr3 = [{ a : 66, b : 77 }]  // arrays with object inside 
~~~~

* **Not implemented**
~~~~ JavaScript
var arr = [1, 2, 3]
arr[0] // array access with index
var arr = [[1], [2]] // multi-dimensional arrays, e.g. array with array inside
~~~~

#### Array.length

~~~~ JavaScript
var arr = [1, 2, 3, 4, 8]
var length = arr.length       // return length of array
print(length)                 // output 5 
~~~~

#### Array.pop

~~~~ JavaScript
var arr = [1, 2, 3]
var last = arr.pop()        // return last element and remove it from array
print(last)                 // output 3
~~~~

#### Array.push

~~~~ JavaScript
var arr = [1, 2, 3]
pushed = arr.push(4)        // array is now [1, 2, 3, 4]
print(pushed)               // output 4
~~~~

#### Array.shift

~~~~ JavaScript
var arr = [1, 2, 3]
var first = arr.shift()      // return first element and remove it from array
print(first)                 // output 1
~~~~

#### Array.slice

~~~~ JavaScript
var arr = [1, 2, 3]
var newarray = arr.slice()      // copy array (allocate new array with same data), e.g. it has different reference to same data
arr.pop()                       // arr is now [1, 2]
newarray.push(3)                // newarray is now [1, 2, 3, 4]
~~~~


### Objects

~~~~ JavaScript
var object = {test:"123", test2:123}; // define object
print(object.test)                    // access object property, output "123"
object.test3 = 666                    // add new property
print(object.test3)                   // output 666
~~~~

* **Not implemented**
~~~~ JavaScript
var object = {fn: function(){return 1}}; // function as object value
var object2 = {test:"123", test2:123}; 
print(object2['test'])                   // access object property by bracket notation
~~~~

### Special functions

#### print

~~~~ JavaScript 
print(123)                   // output 123 
~~~~

#### parseInt
~~~~ JavaScript
var str = "123"
var num = parseInt("123")
print(num + 4)              // output 127                  
print(str + 4)              // output rubbish (in JS it will output 1234)                  
~~~~

#### fs_open_file

file.txt
~~~~
first\n
second\n
third\n
~~~~

~~~~ JavaScript
var handle = fs_open_file('/path/to/file.txt') // creates handle to filename
var firstLine = handle.read_line() // it contains 'first', reads whole file (not optimal)                   
var secondLine = handle.read_line() // it contains 'second'                   
var thirdLine = handle.read_line() // it contains 'third'
print(handle.length())                // output number of lines                   
~~~~
 


VM
--
* stack-vm
* instructions - see vm_instructions.txt
* semi-implemented heap - "basic slots" but not for array/object data + etc..
* simple mark & sweep GC


