


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
            vm.interpreter.compareInstruction();

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
            vm.interpreter.compareInstruction();

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

        it('should (not) do conditional jump', function(){
            //set up
            vm.start();
            vm.addInstruction("push 4");
            vm.addInstruction("push 0");
            vm.addInstruction("conditional_jump");
            vm.addInstruction("push 88");
            vm.addInstruction("push 66");


            vm.interpreter.process();

            assert.equal(vm.currentFrame().stack.size, 2);
            assert.equal(vm.currentFrame().stack._data[0], 88);
            assert.equal(vm.currentFrame().stack._data[1], 66);
        });

        it('should  do conditional jump', function(){
            //set up
            vm.start();
            vm.addInstruction("push 4");
            vm.addInstruction("push 1");
            vm.addInstruction("conditional_jump");
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
            var beforeWhileStart = vm.addInstruction("store 0");  // x = 1

            vm.addInstruction("push " + (beforeWhileStart + 11)); // jump to end of while
            vm.addInstruction("load 0"); // while x != 5
            vm.addInstruction("push_c #1"); // while x != 5
            vm.addInstruction("compare"); // while x != 5
            vm.addInstruction("conditional_jump"); // while x != 5

            vm.addInstruction("load 0"); // x = x + 1
            vm.addInstruction("push_c #0"); // x = x + 1
            vm.addInstruction("add"); // x = x + 1
            vm.addInstruction("store 0"); // x = x + 1

            vm.addInstruction("jump " + (beforeWhileStart + 1));

            vm.addInstruction("load 0");
            vm.interpreter.process();
            assert.equal(vm.currentFrame().stack.size, 1);
            assert.equal(vm.currentFrame().stack._data[0], 5);
        });

        it('should do stackoverflow error', function(){
            vm.start();

            vm.addInstruction("push 1");
            vm.addInstruction("jump 0");


            assert.throws(
                function() {
                    vm.interpreter.process();
                },
                /StackOverflow/
            );
        });

//        it('should create new array', function(){
//            vm.start();
//
//            vm.addInstruction("new_array");
//
//            assert.equal(vm.currentFrame().stack.size, 1);
//        });

    });
});

