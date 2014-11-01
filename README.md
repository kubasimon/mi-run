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
 

## Under the hood

### Compiler

Written in JavaScript. Main source <a href="compiler/compiler.js">compiler.js</a>, tests: <a href="compiler/compiler_test.js">compiler_test.js</a>  

#### Parsing

<a href="http://pegjs.majda.cz/">PEGjs</a> and its example grammar 
<a href="https://github.com/dmajda/pegjs/blob/master/examples/javascript.pegjs">javascript.pegjs</a> is used to generate parser and output AST

#### Generate code

 Top-down generating for stack vm with some semantic analysis:
 
######  Not defined variables:
 
~~~~ JavaScript
    function main() {
        var b = 1;
        print(a)
    } 
~~~~

~~~~
Error: Variable 'a' not defined! Defined variables: b
~~~~

###### Variable definition without value

~~~~ JavaScript
    function main() {
        var b = 1;
        print(a)
    } 
~~~~

~~~~
Error: Variable 'a' not defined! Defined variables: b
~~~~

### Bytecode
* Compiler generates bytecode as JSON - see example <a href="compiler/fixture/knapsack.json">knapsack.json</a>
* Instructions - see <a href="vm_instructions.md">vm_instructions.md</a>

#### Structure

Byte code is in fact JSON. It contains array of objects - for each defined function.
This "function" object contains properties:

 * **name** - name of function
    * For *inner functions* is used notation *{parentName}#{innerName}*
    * For *anonymous function* is used *{parentName}#anonymous_{counter}*
 * **arguments** - number of function arguments
 * **localVariables** - number of local variables used in function
 * **anonymousFunctionCounter** - counter for anonymous functions to generate & call them correctly
 * **instructions** - list of instructions   

~~~~ JavaScript
[
    {
        "name": "main",
        "arguments": 0,
 		"localVariables": 10,
 		"anonymousFunctionCounter": 0,
        "instructions": [
            "return"
        ]
    } 
]    
~~~~

###  VM

* Stack based virtual machine, "inspired" by JVM
* Written in JavaScript Main source <a href="vm/vm.js">vm.js</a>, tests: <a href="vm/vm_test.js">vm_test.js</a>

#### VM data structures:

* **Instruction list** (IL) index -> instruction   
 
    | #address | instruction  |
    |----------|--------------|
    |    0     | load  0      |
    |    1     | push 1       |
    |    2     | add          |
    |    3     | return_value |
        
* **Function look up table** (FT) unique function name -> function structure with properties
    * **startAddress** - index form IL of first instruction
    * **arguments** - number of function arguments
    * **localVariables** - number of local variables
    * **constantPool** - constant pool of function - not really implemented
    * **name** - name of function 
           
     
* Load bytecode in memory - process all "function" objects
    1. Load all instructions function by function to IL
    2. For each function mark first instruction add record to FT
    3. Insert 2 instruction to the end:
        * `invoke main` - invokes entry point, function main()
        * `terminate`   - terminates program when main function is finished
            
                 
#### StackFrame

* VM holds information about all active stack frames
* For each invoked function is created new stack frame with its own stack and these properties:
    * **returnAddress** - index in IL to continue after end of called function
    * **localVariable** - local variables for current function
    * **constantPool** - contanct pool for current function - *not really used*
    * **name** - name of called function

#### Look up function

1. When instruction `invoke functionName` is invoked, VM tries to look up first inner functions (prepend with `'actual function name' + #`)
2. Otherwise it lookup in global space
3. Anonymous functions are generated to global space

#### Heap      
* Naive heap - "basic slots" but not for array/object data

    | heap slot | data  |
    |-----------|-------|
    |    0      | p1    |   --> p1 = "string"
    |    1      | p4    |   --> p4 = 123
    |    2      | p2    |   --> p2 = { a:123, b:"str"}
    |    3      | null  |
    |    4      | null  |
    |    5      | null  |
    |    6      | null  |
    |    7      | null  |
    |    8      | null  |
    |    9      | null  |
    |    10     | null  |
     
     

#### Garbage collection
 
* Simple mark & sweep GC - goes through heap and mark all referenced pointers, then sweep everything else  
* Run with 50% chance when heap is half full or when heap is full
    



