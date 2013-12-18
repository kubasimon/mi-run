PEG = require("pegjs");
fs = require("fs");

var compiler = (function(PEG, fs, undefined) {
    var compiler = {
        parser: {}
    };

    compiler.initialize = function() {
        var grammar = fs.readFileSync(__dirname + '/javascript.pegjs', "utf-8");
        compiler.parser = PEG.buildParser(grammar);
    };
    compiler.compile = function(program) {
        var ast = compiler.buildAst(program);
        return compiler.createBytecode(ast);
    };

    compiler.buildAst = function(program) {
       return compiler.parser.parse(program);
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
                    case "EmptyStatement":
                        //ignore
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
        var localVariables = [];
        // add arguments as local variables
        for(var i=0; i < elem.params.length; i++) {
            localVariables.push(elem.params[i]);
        }
        compiler.generateFunctionBody(elem.elements, fnc, localVariables);
        bytecode.push(fnc);
    };

    compiler.generateFunctionBody = function(elements, fnc, localVariables) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            switch (element.type) {
                case "VariableStatement":
                    compiler.generateVariableDeclaration(element, fnc, localVariables);
                    break;
                case "FunctionCall":
                    compiler.generateFunctionCall(element, fnc, localVariables);
                    break;
                default:
                    throw new Error ("Type '" + element.type + "' not implemented in function context!")
            }
        }

        fnc.instructions.push("return");
        fnc.localVariables = localVariables.length;
    };

    compiler.generateVariableDeclaration = function(element, fnc, localVariables) {
        if (element.declarations.length == 1) {
            var declaration = element.declarations[0];
            var index = localVariables.push(declaration.name) - 1;
            if (declaration.value) {
                switch (declaration.value.type) {
                    case "ArrayLiteral":
                        compiler.generateArrayDeclaration(declaration, fnc, index);
                        break;

                    case "ObjectLiteral":
                        compiler.generateObjectDeclaration(declaration, fnc, index);
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
    }

    compiler.generateObjectDeclaration = function(declaration, fnc, index) {
        // new_object
        // store 0
        fnc.instructions.push("new_object");
        fnc.instructions.push("store " + index);
        // initialize
        for (var i=0; i < declaration.value.properties.length; i++) {
            var elem = declaration.value.properties[i];
            switch (elem.type) {
                case "PropertyAssignment":
                    switch (elem.value.type) {
                        case "NumericLiteral":
                            // push value
                            // load 0
                            // invokenative push
                            fnc.instructions.push("push " + elem.value.value);
                            fnc.instructions.push("load " + index);
                            fnc.instructions.push("object_store " + elem.name);
                            break;
                        default:
                            throw new Error ("Value Type '" +elem.type + "' not implemented in object value variable initialization context!")
                    }
                    break;
                default:
                    throw new Error ("Value Type '" +elem.type + "' not implemented in object variable initialization context!")
            }
        }
    };

    compiler.generateArrayDeclaration = function(declaration, fnc, index) {
        // new_array
        // store 0
        fnc.instructions.push("new_array");
        fnc.instructions.push("store " + index);
        // initialize
        for (var i=0; i<declaration.value.elements.length; i++) {
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
                    throw new Error ("Value Type '" +elem.type + "' not implemented in array variable initialization context!")
            }
        }
    };

    compiler.generateFunctionCall = function(element, fnc, localVariables) {
        if (element.name.type == "Variable") {
            //push arguments reverse order
            for (var i = 0; i < element.arguments.length; i++) {
                var arg = element.arguments[i];
                switch (arg.type) {
                    case "NumericLiteral":
                        fnc.instructions.push("push " + arg.value);
                        break;
                    case "Variable":
                        // is variable defined?
                        var found = false;
                        for (var j = 0; j < localVariables.length; j++) {
                            if (localVariables[j] == arg.name) {
                                fnc.instructions.push("load " + j);
                                found = true;
                                break;
                            }
                        }
                        if (! found ) {
                            throw new Error ("Variable '" + arg.name + "' not defined! Defined variables: " + localVariables);
                        }
                        break;
                    default:
                        throw new Error ("Value Type '" + arg.type + "' not implemented in call function argument!")
                }
            }
            //invoke <name>
            fnc.instructions.push("invoke " + element.name.name);
        } else {
            throw new Error ("Function name type '" + element.name.type + "' not implemented, only 'Variable' allowed !")
        }
    }



    return compiler;
})(PEG, fs);

if (typeof module !== "undefined") {
    module.exports = compiler;
}
