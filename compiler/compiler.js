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

    compiler.compileFile = function(fileName, outputFile) {
        var program = fs.readFileSync(fileName, "UTF-8");
        var out = compiler.compile(program);
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(out,null,'\t'));
        }
        return out;
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
                        fnc.instructions.push("new_object");
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
            compiler.generateExpression(localVariables, test , fnc);
            fnc.instructions.push("negate");
            testJump = fnc.instructions.push("conditional_jump #") - 1;
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
        fnc.instructions[testJump] = fnc.instructions[testJump].replace("#",  fnc.instructions.length - testJump);

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
                // generate properties
                if (expression.properties.length) {
                    //create temporary variable for object initialization
                    var tmpIndex = localVariables.indexOf("$_temporary");
                    if (tmpIndex == -1 ) {
                        tmpIndex = localVariables.push("$_temporary") - 1;
                    }
                    fnc.instructions.push("store " + tmpIndex);
                    compiler.generateObjectDeclarationElements(localVariables, expression.properties, fnc, tmpIndex);
                    fnc.instructions.push("load " + tmpIndex);
                }
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
                    case "<":
                        fnc.instructions.push("less");
                        break;
                    case "<=":
                        fnc.instructions.push("less_or_equal");
                        break;
                    case ">=":
                        fnc.instructions.push("greater_or_equal");
                        break;
                    case ">":
                        fnc.instructions.push("greater");
                        break;
                    case "*":
                    case "/":
                    default:
                    throw new Error ("BinaryExpression operator '" + expression.operator + "' not implemented, only '+', '-' allowed !")
                }
                break;
            case "PropertyAccess":
                compiler.generateExpression(localVariables, expression.base, fnc);
                fnc.instructions.push("object_load " + expression.name);
                break;
            case "AssignmentExpression":
                switch(expression.left.type) {
                    case "Variable":
                        //generate right
                        compiler.generateExpression(localVariables, expression.right, fnc);
                        // assign result to left variable
                        compiler.storeVariable(localVariables, expression.left.name, fnc);
                        break;
                    case "PropertyAccess":
                        //generate right
                        compiler.generateExpression(localVariables, expression.right, fnc);
                        // assign result to left

                        // load base
                        compiler.generateExpression(localVariables, expression.left.base, fnc);
                        // store to object
                        fnc.instructions.push("object_store " + expression.left.name);
                        break;
                    default:
                        throw new Error ("AssignmentExpression left type'" +expression.left.type + "' not implemented, only 'Variable', 'PropertyExpression' allowed !")
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
            case "IfStatement":
                compiler.generateExpression(localVariables, expression.condition, fnc);
                // if condition not fulfilled, jump to else branch or to end
                fnc.instructions.push("negate");
                var startInstruction = fnc.instructions.push("conditional_jump #") - 1;
                // generate if statement
                compiler.generateExpression(localVariables, expression.ifStatement, fnc);

                if (expression.elseStatement) {
                    // jump from if statement to end, e.g skipping else
                    var endOfIf = fnc.instructions.push("jump #") - 1;
                    fnc.instructions[startInstruction] = fnc.instructions[startInstruction].replace("#",  fnc.instructions.length - startInstruction);
                    //generate else
                    compiler.generateExpression(localVariables, expression.elseStatement, fnc);
                    fnc.instructions[endOfIf] = fnc.instructions[endOfIf].replace("#",  fnc.instructions.length - endOfIf);
                } else {
                    // no additional jump after if branch
                    fnc.instructions[startInstruction] = fnc.instructions[startInstruction].replace("#",  fnc.instructions.length - startInstruction);
                }

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
