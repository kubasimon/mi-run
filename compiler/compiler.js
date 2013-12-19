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

    compiler.compileFile = function(fileName) {
        var program = fs.readFileSync(fileName, "UTF-8");
        return compiler.compile(program);
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
            compiler.generateExpression(localVariables, element, fnc);
//            switch (element.type) {
//
//                default:
//                    throw new Error ("Type '" + element.type + "' not implemented in function context!")
//            }
        }

        if (fnc.instructions.length == 0 || fnc.instructions[fnc.instructions.length - 1].indexOf("return") == -1) {
            fnc.instructions.push("return");
        }
        fnc.localVariables = localVariables.length;
    };

    compiler.generateVariableDeclaration = function(element, fnc, localVariables) {
        if (element.declarations.length == 1) {
            var declaration = element.declarations[0];
            var index = localVariables.push(declaration.name) - 1;
            if (declaration.value) {
                switch (declaration.value.type) {
                    case "ArrayLiteral":
                        compiler.generateExpression(localVariables, declaration.value, fnc);
                        fnc.instructions.push("store " + index);
                        compiler.generateArrayDeclarationElements(localVariables, declaration.value.elements, fnc, index);
                        break;
                    case "ObjectLiteral":
                        compiler.generateExpression(localVariables, declaration.value, fnc);
                        fnc.instructions.push("store " + index);
                        compiler.generateObjectDeclarationElements(localVariables, declaration.value.properties, fnc, index);
                        break;
                    default:
                        compiler.generateExpression(localVariables, declaration.value, fnc);
                        fnc.instructions.push("store " + index);
                        //throw new Error ("Value Type '" + declaration.value.type + "' not implemented in variable context!")
                }
            } else {
                throw new Error ("Empty declaration value! '" + declaration)
            }
        } else {
            throw new Error ("Only one declaration allowed! '" + element)
        }
    };

    compiler.generateObjectDeclarationElements = function(localVariables, declaration, fnc, index) {
        // initialize
        for (var i=0; i<declaration.length; i++) {
            var elem = declaration[i];
            switch (elem.type) {
                case "PropertyAssignment":
                    compiler.generateExpression(localVariables, elem.value, fnc);
                    fnc.instructions.push("load " + index); // load array
                    fnc.instructions.push("object_store " + elem.name);
                    break;
                default:
                    throw new Error ("Value Type '" +elem.type + "' not implemented in object variable initialization context!")
            }

        }
    };

    compiler.generateArrayDeclarationElements = function(localVariables, declaration, fnc, index) {
        // initialize
        for (var i=0; i<declaration.length; i++) {
            var elem = declaration[i];
            compiler.generateExpression(localVariables, elem, fnc);
            fnc.instructions.push("load " + index); // load array
            fnc.instructions.push("invoke_native push");
        }
    };

    compiler.generateFunctionCall = function(element, fnc, localVariables) {
        //push arguments reverse order
        for (var i = 0; i < element.arguments.length; i++) {
            var arg = element.arguments[i];
            compiler.generateExpression(localVariables, arg, fnc);
        }
        switch (element.name.type) {
            case "Variable":
                //invoke <name>
                fnc.instructions.push("invoke " + element.name.name);
                break;
            case "PropertyAccess":
                compiler.generateExpression(localVariables, element.name.base, fnc);
                fnc.instructions.push("invoke_native " + element.name.name);
                break;
            default:
                throw new Error ("Function name type '" + element.name.type + "' not implemented, only 'Variable', 'PropertyAccess' allowed !")

        }
    };

    compiler.loadVariable = function(localVariables, name, fnc) {
        var found = false;
        for (var j = 0; j < localVariables.length; j++) {
            if (localVariables[j] == name) {
                fnc.instructions.push("load " + j);
                found = true;
                break;
            }
        }
        if (! found ) {
            throw new Error ("Variable '" + name + "' not defined! Defined variables: " + localVariables);
        }
    };

    compiler.storeVariable = function(localVariables, name, fnc) {
        var found = false;
        for (var j = 0; j < localVariables.length; j++) {
            if (localVariables[j] == name) {
                fnc.instructions.push("store " + j);
                found = true;
                break;
            }
        }
        if (! found ) {
            throw new Error ("Variable '" + name + "' not defined! Defined variables: " + localVariables);
        }
    };

    compiler.generateForStatement = function(element, fnc, localVariables) {
        //initializer
        var initializer = element.initializer;
        if (initializer != null) {
            compiler.generateExpression(localVariables, initializer, fnc);
        }

        var testInstructionStart = fnc.instructions.length;
        var test = element.test;
        var testJump = null;
        if (test != null) {
            switch (test.type) {
                case "BinaryExpression":
                    //generate binary expression
                    // left first then right
                    compiler.generateExpression(localVariables, test.left, fnc);
                    compiler.generateExpression(localVariables, test.right, fnc);

                    // todo - make it 2 instruction? compare and conditional jump so we can extract it to compiler.generateExpression
                    switch (test.operator) {
                        case "<":
                            fnc.instructions.push("less_jump #");
                            break;
                        case "<=":
                            fnc.instructions.push("less_or_equal_jump #");
                            break;
                        case ">=":
                            fnc.instructions.push("greater_or_equal_jump #");
                            break;
                        case ">":
                            fnc.instructions.push("greater_jump #");
                            break;
                    }
                    testJump = fnc.instructions.length - 1;
                    break;
                default:
                    throw new Error ("ForStatement test type '" + test.type + "' not implemented, only 'BinaryExpression' allowed !")
            }
        }
        // generate body

        compiler.generateExpression(localVariables, element.statement, fnc);

        // counter
        if (element.counter) {
            compiler.generateExpression(localVariables, element.counter, fnc);
        }


        // jump back to test
        fnc.instructions.push("jump " + (testInstructionStart - fnc.instructions.length));
        // replace # in test condition to jump after this "jump loop"
        fnc.instructions[testJump] = fnc.instructions[testJump].replace("#",  fnc.instructions.length - testJump - 1);

    };

    compiler.generateExpression = function(localVariables, expression, fnc) {
        switch(expression.type) {
            case "Variable":
                compiler.loadVariable(localVariables, expression.name, fnc);
                break;
            case "NumericLiteral":
                fnc.instructions.push("push " + expression.value);
                break;
            case "ArrayLiteral":
                fnc.instructions.push("new_array");
                break;
            case "ObjectLiteral":
                fnc.instructions.push("new_object");
                break;
            case "BinaryExpression":
                //generate binary expression
                // left first then right
                compiler.generateExpression(localVariables, expression.left, fnc);
                compiler.generateExpression(localVariables, expression.right, fnc);

                switch (expression.operator) {
                    case "+":
                        fnc.instructions.push("add");
                        break;
                    case "-":
                        fnc.instructions.push("subtract");
                        break;
                    case "*":
                    case "/":
                    default:
                    throw new Error ("BinaryExpression operator '" + expression.operator + "' not implemented, only '+', '-' allowed !")
                }
                break;
            case "AssignmentExpression":
                if (expression.left.type == "Variable") {
                    //generate right
                    compiler.generateExpression(localVariables, expression.right, fnc);
                    // assign result to left variable
                    compiler.storeVariable(localVariables, expression.left.name, fnc);

                } else {
                    throw new Error ("AssignmentExpression left type'" +expression.left.type + "' not implemented, only 'Variable' allowed !")
                }
                break;
            case "VariableStatement":
                compiler.generateVariableDeclaration(expression, fnc, localVariables);
                break;
            case "FunctionCall":
                compiler.generateFunctionCall(expression, fnc, localVariables);
                break;
            case "ForStatement":
                compiler.generateForStatement(expression, fnc, localVariables);
                break;
            case "EmptyStatement":
                //ignore
                break;
            case "ReturnStatement":
                //ignore
                if (expression.value == null) {
                    fnc.instructions.push("return");
                } else {
                    compiler.generateExpression(localVariables, expression.value, fnc);
                    fnc.instructions.push("return_value");
                }
                break;
            case "Block":
                for (var i = 0; i < expression.statements.length; i++) {
                    compiler.generateExpression(localVariables, expression.statements[i], fnc);
                }
                break;
            case "UnaryExpression":
            case "PostfixExpression":
                fnc.instructions.push("push 1");
                if (expression.expression.type == "Variable") {
                    compiler.loadVariable(localVariables, expression.expression.name, fnc);

                } else {
                    throw new Error ("ForStatement counter expression type '" + expression.expression.type + "' not implemented, only 'Variable' allowed !")
                }
                switch(expression.operator) {
                    case "++":
                        fnc.instructions.push("add");
                        break;
                    case "--":
                        fnc.instructions.push("subtract");
                        break;
                    default:
                        throw new Error ("ForStatement counter operator '" + expression.operator + "' not implemented, only '++' or '--' allowed !")
                }
                compiler.storeVariable(localVariables, expression.expression.name, fnc); // store to i
                break;
            default:
                throw new Error ("Expression type'" + expression.type + "' not implemented!")
        }

    };

    return compiler;
})(PEG, fs);

if (typeof module !== "undefined") {
    module.exports = compiler;
}
