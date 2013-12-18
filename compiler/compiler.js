PEG = require("pegjs");
fs = require("fs");

var compiler = (function(PEG, fs, undefined) {
    var compiler = {};
    compiler.compile = function(program) {
        var grammar = fs.readFileSync(__dirname + '/javascript.pegjs', "utf-8");
        var ast = PEG.buildParser(grammar).parse(program);
        return ast;
    };
    return compiler;
})(PEG, fs);

if (typeof module !== "undefined") {
    module.exports = compiler;
}
