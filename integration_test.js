


var assert = require("assert");
var vm = require('./vm.js');


describe('vm', function(){
    describe('bytecode interpreter', function(){

        it('should work with knapsack program!', function(){
            vm.load("./compiler/fixture/knapsack.json");
//
//            assert.equal(vm._output[0], 88);
//            assert.equal(vm._output[1], 888);
        });
    });
});

