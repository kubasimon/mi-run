


var assert = require("assert");
var vm = require('./vm.js');
var compiler = require('./compiler/compiler.js');
compiler.initialize();


describe('vm', function(){
    describe('bytecode interpreter', function(){

        it('should work with knapsack program!', function(){
            compiler.compileFile("./compiler/fixture/knapsack.js", "./compiler/fixture/knapsack.json");
            vm.load("./compiler/fixture/knapsack.json");
//
//            assert.equal(vm._output[0], 88);
//            assert.equal(vm._output[1], 888);
        });
    });
});

