var assert = require("assert");
var compiler = require('./compiler.js');
compiler.initialize();

describe('compiler', function() {
    it('should parse empty program', function(){
        var out = compiler.buildAst("");
        assert.deepEqual(out, {"type": "Program", "elements": []})
    });

    it('should compile empty function ', function(){
        var out = compiler.compile("function main(){}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 0,
            "instructions": ["return"]}])
    });

    it('should compile array definition', function(){
        var out = compiler.compile("function main(){var array = []}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_array",
                "store 0",
                "return"
            ]}])
    });

    it('should compile array initialization', function(){
        var out = compiler.compile("function main(){var array = [1]}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_array",
                "store 0",
                "push 1",
                "load 0",
                "invoke_native push",
                "return"
            ]}])
    });

    it('should compile array initialization 2 elems', function(){
        var out = compiler.compile("function main(){var array = [85, 88]}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_array",
                "store 0",
                "push 85",
                "load 0",
                "invoke_native push",
                "push 88",
                "load 0",
                "invoke_native push",
                "return"
            ]}])
    });

    it('should compile object definition', function(){
        var out = compiler.compile("function main(){var o = {}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_object",
                "store 0",
                "return"
            ]}])
    });

    it('should compile object initialization ', function(){
        var out = compiler.compile("function main(){var o = {test: 66}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_object",
                "store 0",
                "push 66",
                "load 0",
                "object_store test",
                "return"
            ]}])
    });

    it('should compile object initialization 2x', function(){
        var out = compiler.compile("function main(){var o = {test: 66, rest: 99}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_object",
                "store 0",
                "push 66",
                "load 0",
                "object_store test",
                "push 99",
                "load 0",
                "object_store rest",
                "return"
            ]}])
    });

    it('should compile object initialization and array initialization', function(){
        var out = compiler.compile("function main(){var o = {test: 66, rest: 99}; var j = [55, 56]}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "new_object",
                "store 0",
                "push 66",
                "load 0",
                "object_store test",
                "push 99",
                "load 0",
                "object_store rest",
                "new_array",
                "store 1",
                "push 55",
                "load 1",
                "invoke_native push",
                "push 56",
                "load 1",
                "invoke_native push",
                "return"
            ]}])
    });
});