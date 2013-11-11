


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
    });
});

