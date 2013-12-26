


var assert = require("assert");
var vm = require('./vm.js');


describe('vm', function(){
    describe('bytecode interpreter', function(){
        it('should load from local variable ', function(){
            //set up
            vm.start();
            vm.currentFrame().localVariables = [1];

            // do work
            vm.interpreter.loadInstruction(0);


            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 1);
        });

        it('should store from stack to local variable ', function(){
            //set up
            vm.start();
            vm.currentFrame().localVariables = [1];
            assert.equal(vm.currentFrame().stack.size, 0);
            vm.interpreter.loadInstruction(0);

            // do work
            vm.interpreter.storeInstruction(1);

            assert.equal(vm.currentFrame().stack.size, 0);
            assert.equal(vm.currentFrame().localVariables[1], 1);
        });

        it('should store push int value to stack ', function(){
            //set up
            vm.start();

            // do work
            vm.interpreter.pushIntInstruction(8);

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 8);
        });

        it('should add to numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(1);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.currentFrame().stack.size, 2);

            // do work
            vm.interpreter.addInstruction();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 6);
        });

        it('should subtract to numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(1);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.currentFrame().stack.size, 2);

            // do work
            vm.interpreter.subtractInstruction();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 4);
        });

        it('should compare numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(1);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.currentFrame().stack.size, 2);

            // do work
            vm.interpreter.equalInstruction();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 0);
        });

        it('should compare numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(5);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.currentFrame().stack.size, 2);

            // do work
            vm.interpreter.equalInstruction();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 1);
        });

        it('should work with negate instruction', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("negate");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 0);
        });

        it('should work with negate instruction', function(){
            //set up
            vm.start();
            vm.addInstruction("push 0");
            vm.addInstruction("negate");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 1);
        });

        it('should add instruction manually and call add', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("push 2");
            vm.addInstruction("add");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 3);
        });

        it('should add instruction manually and call add', function(){
            //set up
            vm.start();
            vm.addInstruction("push 4");
            vm.addInstruction("push 2");
            vm.addInstruction("times");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 8);
        });

        it('should (not) do conditional jump', function(){
            //set up
            vm.start();
            vm.addInstruction("push 0");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], 88);
            assert.equal(vm.currentFrame().stack._data[1], 66);
        });

        it('should do (not) conditional jump with greater comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 0");
            vm.addInstruction("push 1");
            vm.addInstruction("greater");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], 88);
            assert.equal(vm.currentFrame().stack._data[1], 66);
        });

        it('should do  conditional jump with greater comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("push 0");
            vm.addInstruction("greater");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 66);
        });

        it('should do (not) conditional jump with greater comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 0");
            vm.addInstruction("push 1");
            vm.addInstruction("greater_or_equal");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], 88);
            assert.equal(vm.currentFrame().stack._data[1], 66);
        });

        it('should do  conditional jump with greater or equal comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("push 1");
            vm.addInstruction("greater_or_equal");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 66);
        });

        //===
        it('should do (not) conditional jump with less comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("push 0");
            vm.addInstruction("less");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], 88);
            assert.equal(vm.currentFrame().stack._data[1], 66);
        });

        it('should do conditional jump with less comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 0");
            vm.addInstruction("push 1");
            vm.addInstruction("less");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 66);
        });

        it('should do (not) conditional jump with less comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("push 0");
            vm.addInstruction("less_or_equal");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], 88);
            assert.equal(vm.currentFrame().stack._data[1], 66);
        });

        it('should do  conditional jump with less or equal comparism', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("push 1");
            vm.addInstruction("less_or_equal");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 66);
        });





        it('should  do conditional jump', function(){
            //set up
            vm.start();
            vm.addInstruction("push 1");
            vm.addInstruction("conditional_jump 2");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 66);
        });

        it('should push constant to stack', function(){
            //set up
            vm.start();
            vm.setConstantPool(["Hello World", 5]);
            vm.addInstruction("push_c #0");
            vm.addInstruction("push_c #1");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], "Hello World");
            assert.equal(vm.currentFrame().stack._data[1], 5);
        });

        it('should do while statement', function(){
            //set up
            vm.start();
            vm.setConstantPool([1, 5]);
            vm.addInstruction("push_c #0"); // x = 1
            vm.addInstruction("store 0");  // x = 1

            vm.addInstruction("load 0"); // while x != 5
            vm.addInstruction("push_c #1"); // while x != 5
            vm.addInstruction("compare"); // while x != 5
            vm.addInstruction("conditional_jump 6"); // while x != 5

            vm.addInstruction("load 0"); // x = x + 1
            vm.addInstruction("push_c #0"); // x = x + 1
            vm.addInstruction("add"); // x = x + 1
            vm.addInstruction("store 0"); // x = x + 1

            vm.addInstruction("jump -8");

            vm.addInstruction("load 0");
            vm.interpreter.process();
            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 5);
        });

        it('should do stackoverflow error', function(){
            vm.start();

            vm.addInstruction("push 1");
            vm.addInstruction("jump -1");

            assert.throws(
                function() {
                    vm.interpreter.process();
                },
                /StackOverflow/
            );
        });

        it('should do stackoverflow error with infinite recursion', function(){
            vm.start();

            vm.addFunction({ name:"recursion",  instructions: [
                'invoke recursion',
                'return'
            ]});
            vm.addInstruction("push 1");
            vm.addInstruction("invoke recursion");

            assert.throws(
                function() {
                    vm.interpreter.process();
                },
                /StackOverflow/
            );
        });

        it('should do throw away void function results', function(){
            vm.start();

            vm.addInstruction("push 8");
            vm.addInstruction("invoke void");
            vm.addInstruction("push 8");
            vm.addInstruction("add");
            vm.addInstruction("terminate");
            vm.addFunction({name:"void", instructions: [
                'push 1',
                'push 1',
                'add 1',
                'return'
            ], arguments: 0, localVariables:2});

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], 16);
        });

        it('should work with function returning int', function(){
            vm.start();

            vm.addInstruction("invoke three");
            vm.addInstruction("push 8");
            vm.addInstruction("add");
            vm.addInstruction("terminate");
            vm.addFunction({name:"three", instructions: [
                'push 3',
                'return_value'
            ], arguments: 0, localVariables:2});

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], 11);
        });

        it('should work with function returning int', function(){
            vm.start();

            vm.addInstruction("invoke three");
            vm.addInstruction("push 8");
            vm.addInstruction("add");
            vm.addInstruction("terminate");
            vm.addFunction({ name:"three", instructions: [
                'push 3',
                'push 3',
                'add',
                'push 3',
                'add',
                'return_value'
            ], arguments: 0, localVariables:2});

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], 17);
        });

        it('should work with function with one argument ', function(){
            vm.start();

            vm.addInstruction("push 8");
            vm.addInstruction("invoke oneargument");
            vm.addInstruction("terminate");
            vm.addFunction({ name: "oneargument", instructions: [
                'load 0',
                'load 0',
                'add',
                'return_value'
            ], arguments: 1, localVariables:2 });

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], 16);
        });

        it('should work with function with two arguments ', function(){
            vm.start();

            vm.addInstruction("push 6");
            vm.addInstruction("push 8");
            vm.addInstruction("invoke twoargument");
            vm.addInstruction("terminate");
            vm.addFunction({ name: "twoargument", instructions: [
                'load 0',
                'load 1',
                'subtract',
                'return_value'
            ], arguments: 2, localVariables:2 });

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], 2);
        });

        it('should work with function with two arguments ', function(){
            vm.start();

            vm.addInstruction("push 8");
            vm.addInstruction("push 6");
            vm.addInstruction("invoke twoargument");
            vm.addInstruction("terminate");
            vm.addFunction({ name: "twoargument", instructions: [
                'load 0',
                'load 1',
                'subtract',
                'return_value'
            ], arguments: 2, localVariables:2 });

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], -2);
        });

        it('should work with recursion', function(){
            vm.start();

            vm.addInstruction("push 1");
            vm.addInstruction("invoke recursion");
            vm.addInstruction("terminate");
            vm.addFunction({ name: "recursion", instructions: [
                'load 0',
                'push 1',
                'add',
                'duplicate',
                'push 5',
                'compare',
                'conditional_jump 2',
                'invoke recursion',
                'return_value'
            ], arguments: 1, localVariables:1 });

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack._data[0], 5);
        });

        it('should create new array', function(){
            vm.start();

            vm.addInstruction("new_array 5");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
        });

        it('should create store a retrieve something to/from array', function(){
            vm.start();

            vm.addInstruction("new_array 5");
            vm.addInstruction("store 0");

            vm.addInstruction("load 0"); // array
            vm.addInstruction("push 0"); // index
            vm.addInstruction("push 88"); // value
            vm.addInstruction("array_store");

            vm.addInstruction("load 0"); // array
            vm.addInstruction("push 0"); // index
            vm.addInstruction("array_load");

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data, 88);
        });

        it('should pass array to function', function(){
            vm.start();

            vm.addInstruction("new_array 5");
            vm.addInstruction("store 0");

            vm.addInstruction("load 0"); // array
            vm.addInstruction("push 0"); // index
            vm.addInstruction("push 5"); // value
            vm.addInstruction("array_store");

            vm.addInstruction("load 0"); // array
            vm.addInstruction("push 1"); // index
            vm.addInstruction("push 4"); // value
            vm.addInstruction("array_store");

            vm.addInstruction("load 0"); // array
            vm.addInstruction("push 2"); // index
            vm.addInstruction("push 1"); // value
            vm.addInstruction("array_store");

            vm.addInstruction("load 0"); // array

            vm.addInstruction("invoke sum");
            vm.addInstruction("terminate");

            vm.addFunction({ name: "sum", instructions: [
                'load 0', //array ref

                'push 0', //tmp = 0
                'store 1', //tmp = 0

                'push 0', //i = 0
                'store 2', //i = 0


                'load 0', // array.length
                'array_length',  // array.length

                'load 2', // i !=  array.len
                'compare', // i != array.len
                'conditional_jump 12', // i != array.len

                'load 0', // array[i]
                'load 2', // array[i]
                'array_load', // array[i]

                'load 1', // tmp = array[i] + tmp
                'add', // tmp = array[i] + tmp
                'store 1', // tmp = array[i] + tmp

                'load 2', // i++
                'push 1', // i++
                'add', // i++
                'store 2', // i++

                'jump -15',

                'load 1',
                'return_value'
            ], arguments: 1, localVariables:3 });

            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data, 10);
        });

        it('should call built-in print function', function(){
            vm.start();

            vm.addInstruction("push 88"); // value
            vm.addInstruction("built_in 0");

            vm.interpreter.process();

            assert.equal(vm._output[0], 88);
        });

        it('should load bytecode and run hello world', function(){
            vm.load("./fixtures/bytecode/hello_world.json");

            assert.equal(vm._output[0], "Hello World");
        });

        it('should load bytecode and run array sum', function(){
            vm.load("./fixtures/bytecode/array_sum.json");

            assert.equal(vm._output[0], 10);
        });

        it('should load bytecode and run array native functions', function(){
            vm.load("./fixtures/bytecode/array_functions.json");

            assert.equal(vm._output[0], 2);
            assert.equal(vm._output[1], 4);
            assert.equal(vm._output[2], 3);
            assert.equal(vm._output[3], 74);
        });

        it('should load bytecode and run array native slice', function(){
            vm.load("./fixtures/bytecode/array_slice.json");

            assert.equal(vm._output[0], 99);
            assert.equal(vm._output[1], 66);
        });
        it('should load bytecode and run array native length', function(){
            vm.load("./fixtures/bytecode/array_length.json");

            assert.equal(vm._output[0], 3);
            assert.equal(vm._output[1], 4);
        });

        it('should load bytecode and run hello object', function(){
            vm.load("./fixtures/bytecode/hello_object.json");

            assert.equal(vm._output[0], 88);
        });

        it('should work with more field', function(){
            vm.load("./fixtures/bytecode/object_more_fields.json");

            assert.equal(vm._output[0], 88);
            assert.equal(vm._output[1], 89);
            assert.equal(vm._output[2], 87);
        });

        it('should work with passing object to functions', function(){
            vm.load("./fixtures/bytecode/knapsack_change_best_solution.json");

            assert.equal(vm._output[0], 66);
            assert.equal(vm._output[1], 99);
        });

        it('should work with object in array', function(){
            vm.load("./fixtures/bytecode/object_in_array.json");

            assert.equal(vm._output[0], 88);
            assert.equal(vm._output[1], 888);
        });

        it('should work with knapsack program!', function(){
            vm.load("./compiler/fixture/knapsack.json");
//
//            assert.equal(vm._output[0], 88);
//            assert.equal(vm._output[1], 888);
        });
    });
});

