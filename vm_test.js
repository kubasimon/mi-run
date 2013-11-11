


var assert = require("assert");
var vm = require('./vm.js');


describe('vm', function(){
    describe('bytecode interpreter', function(){
        it('should load from local variable ', function(){
            //set up
            vm.start();
            vm.localVariables = [1];

            // do work
            vm.interpreter.loadInstruction(0);


            assert.equal(vm.stack.length, 1);
            assert.equal(vm.stack[0], 1);
        });

        it('should store from stack to local variable ', function(){
            //set up
            vm.start();
            vm.localVariables = [1];
            assert.equal(vm.stack.length, 0);
            vm.interpreter.loadInstruction(0);

            // do work
            vm.interpreter.storeInstruction(1);

            assert.equal(vm.stack.length, 0);
            assert.equal(vm.localVariables[1], 1);
        });

        it('should store push int value to stack ', function(){
            //set up
            vm.start();

            // do work
            vm.interpreter.pushIntInstruction(8);

            assert.equal(vm.stack.length, 1);
            assert.equal(vm.stack[0], 8);
        });

        it('should add to numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(1);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.stack.length, 2);

            // do work
            vm.interpreter.addInstruction();

            assert.equal(vm.stack.length, 1);
            assert.equal(vm.stack[0], 6);
        });

        it('should subtract to numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(1);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.stack.length, 2);

            // do work
            vm.interpreter.subtractInstruction();

            assert.equal(vm.stack.length, 1);
            assert.equal(vm.stack[0], 4);
        });

        it('should compare numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(1);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.stack.length, 2);

            // do work
            vm.interpreter.compareInstruction();

            assert.equal(vm.stack.length, 1);
            assert.equal(vm.stack[0], 0);
        });

        it('should compare numbers on stack and push result to stack', function(){
            //set up
            vm.start();

            vm.interpreter.pushIntInstruction(5);
            vm.interpreter.pushIntInstruction(5);
            assert.equal(vm.stack.length, 2);

            // do work
            vm.interpreter.compareInstruction();

            assert.equal(vm.stack.length, 1);
            assert.equal(vm.stack[0], 1);
        });
    });
});

