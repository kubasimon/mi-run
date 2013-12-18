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
                        throw new Error ("Type '" + elem.type + "' not allow in top context!")
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
        bytecode.push(fnc);
    };


    return compiler;
})(PEG, fs);

if (typeof module !== "undefined") {
    module.exports = compiler;
}
