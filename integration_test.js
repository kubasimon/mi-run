


var assert = require("assert");
var vm = require('./vm/vm.js');
var compiler = require('./compiler/compiler.js');
compiler.initialize();


describe('vm', function(){
    describe('bytecode interpreter', function(){

        it('should work with knapsack program!', function(){
            compiler.compileFile("./compiler/fixture/knapsack.js", "./compiler/fixture/knapsack.json");
            vm.load("../compiler/fixture/knapsack.json");
            console.log(vm.heap.length)
        });

        it('should work with closure 1 example!', function(){
            compiler.compileFile("./fixture/closure1.js", "./fixture/closure1.js.json");
            vm.load("../fixture/closure1.js.json");
            assert.equal(vm._output[0], 7);
            assert.equal(vm._output[1], 12);
        });

        it('should work with closure 2 example!', function(){
            compiler.compileFile("./fixture/closure2.js", "./fixture/closure2.js.json");
            vm.load("../fixture/closure2.js.json");
            assert.equal(vm._output[0], 667);
        });

        it('should work with closure 3 example!', function(){
            compiler.compileFile("./fixture/closure3.js", "./fixture/closure3.js.json");
            vm.load("../fixture/closure3.js.json");
            assert.equal(vm._output[0], 666);
        });

        it('should work with add example!', function(){
            compiler.compileFile("./fixture/add.js", "./fixture/add.js.json");
            vm.load("../fixture/add.js.json");
            assert.equal(vm._output[0], 21);
        });

        it('should work with file lenght', function(){
            compiler.compileFile("./fixture/file-length.js", "./fixture/file-length.js.json");
            vm.load("../fixture/file-length.js.json");
            assert.equal(vm._output[0], 10);
        });
    });
});

