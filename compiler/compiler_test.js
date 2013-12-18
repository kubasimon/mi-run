var assert = require("assert");
var compiler = require('./compiler.js');

describe('compiler', function() {
    it('should parse empty program', function(){
        var out = compiler.compile("");
        assert.deepEqual(out, {"type": "Program", "elements": []})
    });
});