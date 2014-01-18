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

    it('should compile function call with int arguments', function(){
        var out = compiler.compile("function main(){test(66,67)}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 0,
            "instructions": [
                "push 66",
                "push 67",
                "invoke test",
                "return"
            ]}])
    });

    it('should compile initialization of array with objects inside', function(){
        var out = compiler.compile("function main(){var t = [{a:66, b:77}]}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "new_array",
                "store 0",

                "new_object",
                "store 1",

                "push 66",
                "load 1",
                "object_store a",

                "push 77",
                "load 1",
                "object_store b",

                "load 1",
                "load 0",
                "invoke_native push",
                "return"
            ]}])
    });

    it('should compile initialization of array with objects inside', function(){
        var out = compiler.compile("function main(){var t = [{a:66, b:77}, {a:55, b:44}]}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "new_array",
                "store 0",

                "new_object",
                "store 1",

                "push 66",
                "load 1",
                "object_store a",

                "push 77",
                "load 1",
                "object_store b",

                "load 1",
                "load 0",
                "invoke_native push",

                "new_object",
                "store 1",

                "push 55",
                "load 1",
                "object_store a",

                "push 44",
                "load 1",
                "object_store b",

                "load 1",
                "load 0",
                "invoke_native push",

                "return"
            ]}])
    });

    it('should compile function call with variable arguments', function(){
        var out = compiler.compile("function main(){var test = []; test(test,67)}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_array",
                "store 0",
                "load 0",
                "push 67",
                "invoke test",
                "return"
            ]}])
    });

    it('should compile function with 1 argument call with variable arguments', function(){
        var out = compiler.compile("function main(a){var test = []; x(test,67)}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 1,
            "localVariables": 2,
            "instructions": [
                "new_array",
                "store 1",
                "load 1",
                "push 67",
                "invoke x",
                "return"
            ]}])
    });

    it('should NOT compile function call with undefined variable arguments', function(){
        assert.throws(
            function() {
                compiler.compile("function main(){test(test,67)}");
            },
            /Variable 'test' not defined/
        );
    });

    it('should compile nested function', function(){
        var out = compiler.compile("function main(){var a = 1; function test() {return a+1}; print(test()) }");
        assert.deepEqual(out,
            [
                {"name": "main#test",
                    "arguments": 0,
                    "localVariables": 1,
                    "instructions": [
                        "load 0",
                        "push 1",
                        "add",
                        "return_value"
                    ]
                },
                {"name": "main",
                    "arguments": 0,
                    "localVariables": 1,
                    "instructions": [
                        "push 1",
                        "store 0",
                        "invoke test",
                        "built_in 0",
                        "return"
                    ]
                }
            ]
        );
    });

    it('should compile nested function with 1 argument', function(){
        var out = compiler.compile("function main(){var a = 60; function test(x) {return a-x}; print(test(10)) }");
        assert.deepEqual(out,
            [
                {"name": "main#test",
                    "arguments": 1,
                    "localVariables": 2,
                    "instructions": [
                        "load 1",
                        "load 0",
                        "subtract",
                        "return_value"
                    ]
                },
                {"name": "main",
                    "arguments": 0,
                    "localVariables": 1,
                    "instructions": [
                        "push 60",
                        "store 0",
                        "push 10",
                        "invoke test",
                        "built_in 0",
                        "return"
                    ]
                }
            ]
        );
    });

    it('should compile for statement', function(){
        var out = compiler.compile("function main(){for(var i=1; i<10;i++){}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                // init i
                "push 1",
                "store 0",

                // check condition
                "load 0",
                "push 10",
                "less",
                "negate",
                "conditional_jump 6", //jump to end

                // empty body

                // increment
                "push 1",
                "load 0",
                "add",
                "store 0",
                "jump -9", //jump to condition

                "return"
            ]}])
    });

    it('should compile for statement 2', function(){
        var out = compiler.compile("function main(){var j = 0; for(var i=1; i<=10;i++){j = j + 1}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "push 0",
                "store 0",

                // init i
                "push 1",
                "store 1",

                // check condition
                "load 1",
                "push 10",
                "less_or_equal", //jump to end
                "negate",
                "conditional_jump 10", //jump to end

                // body
                "load 0",
                "push 1",
                "add",
                "store 0",

                // increment
                "push 1",
                "load 1",
                "add",
                "store 1",
                "jump -13", //jump to condition

                "return"
            ]}])
    });

    it('should compile return statement', function(){
        var out = compiler.compile("function main(){return 1}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 0,
            "instructions": [
                "push 1",
                "return_value"
            ]}])
    });
    it('should compile return statement', function(){
        var out = compiler.compile("function main(){var a = 1; return a}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "push 1",
                "store 0",
                "load 0",
                "return_value"
            ]}])
    });
    it('should compile return statement', function(){
        var out = compiler.compile("function main(){return}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 0,
            "instructions": [
                "return"
            ]}])
    });

    it('should compile return array statement', function(){
        var out = compiler.compile("function main(){var a = []; return a}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_array",
                "store 0",
                "load 0",
                "return_value"
            ]}])
    });

    it('should compile return object statement', function(){
        var out = compiler.compile("function main(){var a = {}; return a}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_object",
                "store 0",
                "load 0",
                "return_value"
            ]}])
    });

    it('should compile variable with function', function(){
        var out = compiler.compile("function main(){var m = []; var a = m.shift();}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "new_array",
                "store 0",

                "load 0",
                "invoke_native shift",
                "store 1",

                "return"
            ]}])
    });

    it('should compile object retrieve ', function(){
        var out = compiler.compile("function main(){var m = {a:1}; var b = m.a;}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "new_object",
                "store 0",

                "push 1",
                "load 0",
                "object_store a",

                "load 0",
                "object_load a",

                "store 1",

                "return"
            ]}])
    });

    it('should compile if statement', function(){
        var out = compiler.compile("function main(){if (1) {var a = 5}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "push 1",
                "negate",
                "conditional_jump 3",

                "push 5",
                "store 0",

                "return"
            ]}])
    });

    it('should compile if else statement', function(){
        var out = compiler.compile("function main(){if (1) {var a = 5} else {var b = 5}}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 2,
            "instructions": [
                "push 1",
                "negate",
                "conditional_jump 4",

                "push 5",
                "store 0",
                "jump 3",

                "push 5",
                "store 1",

                "return"
            ]}])
    });

    it('should compile assignment statement', function(){
        var out = compiler.compile("function main(){var a = 5; a = 6}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "push 5",
                "store 0",

                "push 6",
                "store 0",

                "return"
            ]}])
    });

    it('should compile assignment to object property', function(){
        var out = compiler.compile("function main(){var a = {}; a.test = 6}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_object",
                "store 0",


                "push 6",
                "load 0",
                "object_store test",

                "return"
            ]}])
    });

    it('should compile string literal', function(){
        var out = compiler.compile("function main(){'x'}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 0,
            "instructions": [
                "new_string 'x'",
                "return"
            ]}])
    });

    it('should compile read from file', function(){
        var out = compiler.compile("function main(){var f = fs_open_file('path'); f.close()}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_string 'path'",
                "built_in 1",
                "store 0",
                "load 0",
                "invoke_native close",
                "return"
            ]}])
    });

    it('should compile write to file', function(){
        var out = compiler.compile("function main(){var f = fs_open_file('path'); f.write('content'); f.close()}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 1,
            "instructions": [
                "new_string 'path'",
                "built_in 1",
                "store 0",
                "new_string 'content'",
                "load 0",
                "invoke_native write",
                "load 0",
                "invoke_native close",
                "return"
            ]}])
    });

    it('should compile write to file', function(){
        var out = compiler.compile("function main(){parseInt('10')}");
        assert.deepEqual(out, [{"name": "main",
            "arguments": 0,
            "localVariables": 0,
            "instructions": [
                "new_string '10'",
                "built_in 3",
                "return"
            ]}])
    });

    it('should compile knapsack source code', function(){
        var out = compiler.compileFile(__dirname + "/fixture/knapsack.js", __dirname + "/fixture/knapsack.json");
        console.log(out);
    });
});