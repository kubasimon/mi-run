var vm = require('./vm/vm.js');
var compiler = require('./compiler/compiler.js');
var path = require("path");
compiler.initialize();

var run = {};
run.compile = function(sourceFile) {
    var bytecodeFile = sourceFile + ".json";
    compiler.compileFile(sourceFile, bytecodeFile);
    console.log("Bytecode generated: " + path.resolve(bytecodeFile))
    return bytecodeFile;
};
run.run = function(bytecodeFile) {
    vm.load(path.resolve(bytecodeFile));
};

var args = process.argv.slice(2);
if (args < 2) {
    console.log("Usage: node run.js [compile|run] [filename]")
}

switch (args[0]) {
    case "compile":
        run.compile(args[1]);
        break;
    case "run":
        run.run(run.compile(args[1]));
        console.log("Run completed");
        break;
    default:
        console.log("Unknown mode '%s' Usage: node run.js [compile|run] [filename]", args[0]);

}




