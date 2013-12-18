PEG = require("pegjs");
fs = require("fs");

var compiler = (function(PEG, fs, undefined) {
    var compiler = {};
    compiler.compile = function(program) {
        var ast = compiler.buildAst(program);
        return compiler.createBytecode(ast);
    };

    compiler.buildAst = function(program) {
        var grammar = fs.readFileSync(__dirname + '/javascript.pegjs', "utf-8");
        return PEG.buildParser(grammar).parse(program);
    };

    compiler.createBytecode = function(ast) {
//        console.log("creating bytecode");
//        console.log(ast);
        var bytecode = [];
        if (ast.type == "Program") {
            for(var i = 0; i < ast.elements.length; i++) {
//                console.log(ast.elements[i]);
                var elem = ast.elements[i];
                switch(elem.type) {
                    case "Function":
                        compiler.generateFunction(elem, bytecode);
                        break;
                    default:
                        throw new Error ("Type '" + elem.type + "' not implemented in top context!")
                }
            }
        } else {
            throw new Error ("Unknown type '" + ast.type + "', should be Program!")
        }
        return bytecode;
    };

    compiler.generateFunction = function(elem, bytecode) {
        var fnc = {
            "name": elem.name,
            "arguments": elem.params.length,
            "localVariables": 0, // TODO
            "instructions": [] // TODO
        };
        compiler.generateFunctionBody(elem.elements, fnc);
        bytecode.push(fnc);
    };

    compiler.generateFunctionBody = function(elements, fnc) {
        var localVariables = [];
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            switch (element.type) {
                case "":
                    case "VariableStatement":
                        if (element.declarations.length == 1) {
                            var declaration = element.declarations[0];
                            var index = localVariables.push(declaration.name) - 1;
                            if (declaration.value) {
                                switch (declaration.value.type) {
                                    case "ArrayLiteral":
                                        // new_array
                                        // store 0
                                        fnc.instructions.push("new_array");
                                        fnc.instructions.push("store " + index);
                                        // TODO default values
                                        // initialize
                                        for (i=0; i<declaration.value.elements.length; i++) {
                                            var elem = declaration.value.elements[i];
                                            switch (elem.type) {
                                                case "NumericLiteral":
                                                    // push value
                                                    // load 0
                                                    // invokenative push
                                                    fnc.instructions.push("push " + elem.value);
                                                    fnc.instructions.push("load " + index);
                                                    fnc.instructions.push("invoke_native push");
                                                    break;
                                                default:
                                                    throw new Error ("Value Type '" +elem.type + "' not implemented in variable initialization context!")
                                            }
                                        }
                                        break;
                                    default:
                                        throw new Error ("Value Type '" + declaration.value.type + "' not implemented in variable context!")
                                }


                            } else {
                                throw new Error ("Empty declaration value! '" + declaration)
                            }


                        } else {
                            throw new Error ("Only one declaration allowed! '" + element)

                        }
                    break;
                default:
                    throw new Error ("Type '" + element.type + "' not implemented in function context!")
            }
        }

        fnc.instructions.push("return");
        fnc.localVariables = localVariables.length;
    };


    return compiler;
})(PEG, fs);

if (typeof module !== "undefined") {
    module.exports = compiler;
}
