


var assert = require("assert");

var PEG, grammar, parser, interpreter;


PEG = require("pegjs");
fs = require('fs');
grammar = fs.readFileSync('grammar.peg', "utf-8");
interpreter = require('./interpreter.js');

parser = PEG.buildParser (grammar);

//describe('Array', function(){
//    describe('#indexOf()', function(){
//        it('should return -1 when the value is not present', function(){
//            assert.equal(-1, [1,2,3].indexOf(5));
//            assert.equal(-1, [1,2,3].indexOf(0));
//        })
//    })
//})

describe('PEG', function () {
    describe('parse', function() {
        it('should parse empty program', function(){
            var program = ';';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one empty statement
            assert.equal(1, output.elements.length);
            assert.equal('EmptyStatement', output.elements[0].type);
        });
        it('should parse integer literals', function(){
            var program = '10';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('NumericLiteral', output.elements[0].type);
            assert.equal(10, output.elements[0].value);
        });
        it('should parse integer literals', function(){
            var program = '100';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('NumericLiteral', output.elements[0].type);
            assert.equal(100, output.elements[0].value);
        });
        it('should parse integer literals', function(){
            var program = '128';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('NumericLiteral', output.elements[0].type);
            assert.equal(128, output.elements[0].value);
        });
        it('should parse null literal', function(){
            var program = 'null';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('NullLiteral', output.elements[0].type);
        });
        it('should parse bool true literal', function(){
            var program = 'true';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('BooleanLiteral', output.elements[0].type);
            assert.equal(true, output.elements[0].value);
        });
        it('should parse bool true literal alias yes', function(){
            var program = 'yes';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('BooleanLiteral', output.elements[0].type);
            assert.equal(true, output.elements[0].value);
        });
        it('should parse bool true literal alias on', function(){
            var program = 'on';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('BooleanLiteral', output.elements[0].type);
            assert.equal(true, output.elements[0].value);
        });
        it('should parse bool false literal', function(){
            var program = 'false';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('BooleanLiteral', output.elements[0].type);
            assert.equal(false, output.elements[0].value);
        });
        it('should parse bool false literal alias no', function(){
            var program = 'no';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('BooleanLiteral', output.elements[0].type);
            assert.equal(false, output.elements[0].value);
        });
        it('should parse bool false literal alias off', function(){
            var program = 'off';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('BooleanLiteral', output.elements[0].type);
            assert.equal(false, output.elements[0].value);
        });
        it('should parse empty string literal', function(){
            var program = '""';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('StringLiteral', output.elements[0].type);
            assert.equal('', output.elements[0].value);
        });
        it('should parse string literal', function(){
            var program = '"ahoj"';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('StringLiteral', output.elements[0].type);
            assert.equal("ahoj", output.elements[0].value);
        });
        it('should parse string literal with space', function(){
            var program = '"hello world"';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('StringLiteral', output.elements[0].type);
            assert.equal("hello world", output.elements[0].value);
        });
        it('should parse indentifier literal', function(){
            var program = 'variable';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('Variable', output.elements[0].type);
            assert.equal("variable", output.elements[0].name);
        });
        it('should parse indentifier literal starting with $', function(){
            var program = '$variable';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('Variable', output.elements[0].type);
            assert.equal("$variable", output.elements[0].name);
        });
        it('should parse indentifier literal starting with _', function(){
            var program = '_variable';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('Variable', output.elements[0].type);
            assert.equal("_variable", output.elements[0].name);
        });
        it('should parse indentifier literal with numbers and special chars($_-)', function(){
            var program = 'vari4b_l-3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal

            assert.equal(1, output.elements.length);
            assert.equal('Variable', output.elements[0].type);
            assert.equal("vari4b_l-3", output.elements[0].name);
        });
        it('should parse empty array literal', function(){
            var program = '[]';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('ArrayLiteral', output.elements[0].type);
            assert.equal(0, output.elements[0].elements.length);
        });
        it('should parse array literal with one element', function(){
            var program = '[5]';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('ArrayLiteral', output.elements[0].type);
            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(5, output.elements[0].elements[0].value);
        });
        it('should parse array literal with two elements', function(){
            var program = '[ 5, 6 ]';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('ArrayLiteral', output.elements[0].type);
            assert.equal(2, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(5, output.elements[0].elements[0].value);
            assert.equal('NumericLiteral', output.elements[0].elements[1].type);
            assert.equal(6, output.elements[0].elements[1].value);
        });
        it('should parse multi array literal', function(){
            var program = '[ [5, 8], 6 ]';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('ArrayLiteral', output.elements[0].type);
            assert.equal(2, output.elements[0].elements.length);
            assert.equal('ArrayLiteral', output.elements[0].elements[0].type);
            assert.equal(2, output.elements[0].elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].elements[0].type);
            assert.equal(5, output.elements[0].elements[0].elements[0].value);
            assert.equal('NumericLiteral', output.elements[0].elements[0].elements[1].type);
            assert.equal(8, output.elements[0].elements[0].elements[1].value);
            assert.equal('NumericLiteral', output.elements[0].elements[1].type);
            assert.equal(6, output.elements[0].elements[1].value);
        });
        it('should parse array literal with two different elements', function(){
            var program = '[ 5, "a" ]';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('ArrayLiteral', output.elements[0].type);
            assert.equal(2, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(5, output.elements[0].elements[0].value);
            assert.equal('StringLiteral', output.elements[0].elements[1].type);
            assert.equal("a", output.elements[0].elements[1].value);
        });
        it('should parse assignment variable and integer', function(){
            var program = 'a = 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('AssignmentExpression', output.elements[0].type);
            assert.equal('=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(8, output.elements[0].right.value);
        });
        it('should parse assignment variable and string', function(){
            var program = 'a = "8"';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('AssignmentExpression', output.elements[0].type);
            assert.equal('=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('StringLiteral', output.elements[0].right.type);
            assert.equal("8", output.elements[0].right.value);
        });
        it('should parse assignment variable and string terminated with semicolon', function(){
            var program = 'a = "8";';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('AssignmentExpression', output.elements[0].type);
            assert.equal('=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('StringLiteral', output.elements[0].right.type);
            assert.equal("8", output.elements[0].right.value);
        });
        it('should parse assignment variable and another variable', function(){
            var program = 'a = b';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('AssignmentExpression', output.elements[0].type);
            assert.equal('=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('Variable', output.elements[0].right.type);
            assert.equal("b", output.elements[0].right.name);
        });
        it('should parse assignment empty array', function(){
            var program = 'a = []';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('AssignmentExpression', output.elements[0].type);
            assert.equal('=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('ArrayLiteral', output.elements[0].right.type);
            assert.equal(0, output.elements[0].right.elements.length);
        });
        it('should parse assignment non empty array', function(){
            var program = 'a = [1, 2]';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('AssignmentExpression', output.elements[0].type);
            assert.equal('=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('ArrayLiteral', output.elements[0].right.type);
            assert.equal(2, output.elements[0].right.elements.length);
        });
        it('should parse unary expression with operator !', function(){
            var program = '!a';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('UnaryExpression', output.elements[0].type);
            assert.equal('!', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].expression.type);
            assert.equal('a', output.elements[0].expression.name);
        });
        it('should parse unary expression with operator ! alias not', function(){
            var program = 'not a';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('UnaryExpression', output.elements[0].type);
            assert.equal('!', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].expression.type);
            assert.equal('a', output.elements[0].expression.name);
        });
        it('should parse unary expression with operator ~', function(){
            var program = '~a';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('UnaryExpression', output.elements[0].type);
            assert.equal('-', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].expression.type);
            assert.equal('a', output.elements[0].expression.name);
        });
        it('should parse unary expression with operator ~', function(){
            var program = '~1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('UnaryExpression', output.elements[0].type);
            assert.equal('-', output.elements[0].operator);
            assert.equal('NumericLiteral', output.elements[0].expression.type);
            assert.equal('1', output.elements[0].expression.value);
        });
        it('should parse binary expression with operator !=', function(){
            var program = '1 == 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('==', output.elements[0].operator);
            assert.equal('NumericLiteral', output.elements[0].left.type);
            assert.equal(1, output.elements[0].left.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it('should parse binary expression with operator "is"', function(){
            var program = '1 is 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('==', output.elements[0].operator);
            assert.equal('NumericLiteral', output.elements[0].left.type);
            assert.equal(1, output.elements[0].left.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it('should parse binary expression with operator !=', function(){
            var program = '1 != 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('!=', output.elements[0].operator);
            assert.equal('NumericLiteral', output.elements[0].left.type);
            assert.equal(1, output.elements[0].left.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it('should parse binary expression with operator "isnt"', function(){
            var program = '1 isnt 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('!=', output.elements[0].operator);
            assert.equal('NumericLiteral', output.elements[0].left.type);
            assert.equal(1, output.elements[0].left.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it('should parse binary expression with operator == with string literal and variable operands', function(){
            var program = '"a" == x';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('==', output.elements[0].operator);
            assert.equal('StringLiteral', output.elements[0].left.type);
            assert.equal("a", output.elements[0].left.value);
            assert.equal('Variable', output.elements[0].right.type);
            assert.equal("x", output.elements[0].right.name);
        });
        it('should parse binary expression with operator == with string literal and variable operands', function(){
            var program = '"a" == x';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('==', output.elements[0].operator);
            assert.equal('StringLiteral', output.elements[0].left.type);
            assert.equal("a", output.elements[0].left.value);
            assert.equal('Variable', output.elements[0].right.type);
            assert.equal("x", output.elements[0].right.name);
        });
        it('should parse binary expression with operator > ', function(){
            var program = 'x > 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('>', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it('should parse binary expression with operator < ', function(){
            var program = 'x < 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('<', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it('should parse binary expression with operator <= ', function(){
            var program = 'x <= 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('<=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator >= ", function(){
            var program = 'x >= 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('>=', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator + ", function(){
            var program = 'x + 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('+', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator - ", function(){
            var program = 'x - 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('-', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator * ", function(){
            var program = 'x * 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('*', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator / ", function(){
            var program = 'x / 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('/', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator && ", function(){
            var program = 'x && 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('&&', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator and ", function(){
            var program = 'x and 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('&&', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator || ", function(){
            var program = 'x || 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('||', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with operator or ", function(){
            var program = 'x or 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('||', output.elements[0].operator);
            assert.equal('Variable', output.elements[0].left.type);
            assert.equal("x", output.elements[0].left.name);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(1, output.elements[0].right.value);
        });
        it("should parse binary expression with multiple operator + + ", function(){
            var program = '1 + 2 + 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('+', output.elements[0].operator);

            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('+', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);

            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);

        });
        it("should parse binary expression with multiple operator * * ", function(){
            var program = '1 * 2 * 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('*', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('*', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        it("should parse binary expression with multiple operator - - ", function(){
            var program = '1 - 2 - 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('-', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('-', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        it("should parse binary expression with multiple operator / / ", function(){
            var program = '1 / 2 / 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('/', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('/', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        it("should parse binary expression with multiple operator * / ", function(){
            var program = '1 * 2 / 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('/', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('*', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        it("should parse binary expression with multiple operator / * ", function(){
            var program = '1 / 2 * 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('*', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('/', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        it("should parse binary expression with operator priority + * ", function(){
            var program = '1 + 2 * 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('+', output.elements[0].operator);
            assert.equal('NumericLiteral', output.elements[0].left.type);
            assert.equal(1, output.elements[0].left.value);
            assert.equal('BinaryExpression', output.elements[0].right.type);
            assert.equal('*', output.elements[0].right.operator);
            assert.equal('NumericLiteral', output.elements[0].right.left.type);
            assert.equal(2, output.elements[0].right.left.value);
            assert.equal('NumericLiteral', output.elements[0].right.right.type);
            assert.equal(3, output.elements[0].right.right.value);
        });
        it("should parse binary expression with operator priority * + ", function(){
            var program = '1 * 2 + 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('+', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('*', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        it("should parse binary expression with operator priority / + ", function(){
            var program = '1 / 2 + 3';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('BinaryExpression', output.elements[0].type);
            assert.equal('+', output.elements[0].operator);
            assert.equal('BinaryExpression', output.elements[0].left.type);
            assert.equal('/', output.elements[0].left.operator);
            assert.equal('NumericLiteral', output.elements[0].left.left.type);
            assert.equal(1, output.elements[0].left.left.value);
            assert.equal('NumericLiteral', output.elements[0].left.right.type);
            assert.equal(2, output.elements[0].left.right.value);
            assert.equal('NumericLiteral', output.elements[0].right.type);
            assert.equal(3, output.elements[0].right.value);
        });
        //todo priority of equality operators and rational operators
        it("should parse if expression", function(){
            var program = 'if a then b';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('Variable', output.elements[0].condition.type);
            assert.equal('a', output.elements[0].condition.name);
            assert.equal('Variable', output.elements[0].ifExpression.type);
            assert.equal('b', output.elements[0].ifExpression.name);
            assert.equal(null, output.elements[0].elseExpression);
        });
        it("should parse if expression", function(){
            var program = 'if a == b then c';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('BinaryExpression', output.elements[0].condition.type);
            assert.equal('==', output.elements[0].condition.operator);
            assert.equal('Variable', output.elements[0].condition.left.type);
            assert.equal('a', output.elements[0].condition.left.name);
            assert.equal('Variable', output.elements[0].condition.right.type);
            assert.equal('b', output.elements[0].condition.right.name);

            assert.equal('Variable', output.elements[0].ifExpression.type);
            assert.equal('c', output.elements[0].ifExpression.name);
            assert.equal(null, output.elements[0].elseExpression);
        });
        it("should parse if expression", function(){
            var program = 'if a == b then c + d';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('BinaryExpression', output.elements[0].condition.type);
            assert.equal('==', output.elements[0].condition.operator);
            assert.equal('Variable', output.elements[0].condition.left.type);
            assert.equal('a', output.elements[0].condition.left.name);
            assert.equal('Variable', output.elements[0].condition.right.type);
            assert.equal('b', output.elements[0].condition.right.name);

            assert.equal('BinaryExpression', output.elements[0].ifExpression.type);
            assert.equal('+', output.elements[0].ifExpression.operator);
            assert.equal('Variable', output.elements[0].ifExpression.left.type);
            assert.equal('c', output.elements[0].ifExpression.left.name);
            assert.equal('Variable', output.elements[0].ifExpression.right.type);
            assert.equal('d', output.elements[0].ifExpression.right.name);
            assert.equal(null, output.elements[0].elseExpression);
        });
        it("should parse if expression", function(){
            var program = 'if a == b then c';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('BinaryExpression', output.elements[0].condition.type);
            assert.equal('==', output.elements[0].condition.operator);
            assert.equal('Variable', output.elements[0].condition.left.type);
            assert.equal('a', output.elements[0].condition.left.name);
            assert.equal('Variable', output.elements[0].condition.right.type);
            assert.equal('b', output.elements[0].condition.right.name);

            assert.equal('Variable', output.elements[0].ifExpression.type);
            assert.equal('c', output.elements[0].ifExpression.name);
            assert.equal(null, output.elements[0].elseExpression);
        });
        it("should parse if expression with else part", function(){
            var program = 'if a then b else c';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            // containing one literal
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('Variable', output.elements[0].condition.type);
            assert.equal('a', output.elements[0].condition.name);
            assert.equal('Variable', output.elements[0].ifExpression.type);
            assert.equal('b', output.elements[0].ifExpression.name);
            assert.equal('Variable', output.elements[0].elseExpression.type);
            assert.equal('c', output.elements[0].elseExpression.name);
        });
        //todo conditional assignment(posfix) - mood = singing if true
        //todo unless - negated if
        //todo if with indentation
        //todo if with multiple statements(expressions !)
        it("should parse if expression with multiple if expressions", function(){
            var program = "if a {b; c;}  \n";
            var output = parser.parse(program);
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('Variable', output.elements[0].condition.type);
            assert.equal('a', output.elements[0].condition.name);
            assert.equal('Block', output.elements[0].ifExpression.type);
            assert.equal(2, output.elements[0].ifExpression.elements.length);
            assert.equal('Variable', output.elements[0].ifExpression.elements[0].type);
            assert.equal('b', output.elements[0].ifExpression.elements[0].name);
            assert.equal('Variable', output.elements[0].ifExpression.elements[1].type);
            assert.equal('c', output.elements[0].ifExpression.elements[1].name);
            assert.equal(null, output.elements[0].elseExpression);
        });
        it("should parse if expression with multiple if expressions", function(){
            var program = "if a {b; c}";
            var output = parser.parse(program);
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('Variable', output.elements[0].condition.type);
            assert.equal('a', output.elements[0].condition.name);
            assert.equal('Block', output.elements[0].ifExpression.type);
            assert.equal(2, output.elements[0].ifExpression.elements.length);
            assert.equal('Variable', output.elements[0].ifExpression.elements[0].type);
            assert.equal('b', output.elements[0].ifExpression.elements[0].name);
            assert.equal('Variable', output.elements[0].ifExpression.elements[1].type);
            assert.equal('c', output.elements[0].ifExpression.elements[1].name);
            assert.equal(null, output.elements[0].elseExpression);
        });
        it("should parse if expression with multiple if expressions and multiple else", function(){
            var program = "if a {b; c} else {e;f}";
            var output = parser.parse(program);
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('IfExpression', output.elements[0].type);
            assert.equal('Variable', output.elements[0].condition.type);
            assert.equal('a', output.elements[0].condition.name);
            assert.equal('Block', output.elements[0].ifExpression.type);
            assert.equal(2, output.elements[0].ifExpression.elements.length);
            assert.equal('Variable', output.elements[0].ifExpression.elements[0].type);
            assert.equal('b', output.elements[0].ifExpression.elements[0].name);
            assert.equal('Variable', output.elements[0].ifExpression.elements[1].type);
            assert.equal('c', output.elements[0].ifExpression.elements[1].name);
            assert.equal('Block', output.elements[0].elseExpression.type);
            assert.equal(2, output.elements[0].elseExpression.elements.length);
            assert.equal('Variable', output.elements[0].elseExpression.elements[0].type);
            assert.equal('e', output.elements[0].elseExpression.elements[0].name);
            assert.equal('Variable', output.elements[0].elseExpression.elements[1].type);
            assert.equal('f', output.elements[0].elseExpression.elements[1].name);
        });
        it("should parse anonymous function declaration without params", function(){
            var program = '-> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // no params
            assert.equal(0, output.elements[0].params.length);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration with param", function(){
            var program = '(x) -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(1, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal(null, output.elements[0].params[0].default);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration with 2 params", function(){
            var program = '(x, y) -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(2, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal(null, output.elements[0].params[0].default);
            assert.equal('y', output.elements[0].params[1].name);
            assert.equal(null, output.elements[0].params[1].default);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration with param with default value", function(){
            var program = '(x, y = 1) -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(2, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal(null, output.elements[0].params[0].default);
            assert.equal('y', output.elements[0].params[1].name);
            assert.equal('NumericLiteral', output.elements[0].params[1].default.type);
            assert.equal(1, output.elements[0].params[1].default.value);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration with param and body", function(){
            var program = '(x, y) -> x y';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(2, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal('y', output.elements[0].params[1].name);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('FunctionCall', output.elements[0].elements[0].type);
        });
        it("should parse anonymous function declaration with param with default value", function(){
            var program = '(x = 2, y = 1) -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(2, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal('NumericLiteral', output.elements[0].params[0].default.type);
            assert.equal(2, output.elements[0].params[0].default.value);
            assert.equal('y', output.elements[0].params[1].name);
            assert.equal('NumericLiteral', output.elements[0].params[1].default.type);
            assert.equal(1, output.elements[0].params[1].default.value);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration with param with default value array", function(){
            var program = '(x = []) -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(1, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal('ArrayLiteral', output.elements[0].params[0].default.type);
            assert.equal(0, output.elements[0].params[0].default.elements.length);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration with param with default value string", function(){
            var program = '(x = "ahoj") -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // params
            assert.equal(1, output.elements[0].params.length);
            assert.equal('x', output.elements[0].params[0].name);
            assert.equal('StringLiteral', output.elements[0].params[0].default.type);
            assert.equal("ahoj", output.elements[0].params[0].default.value);

            assert.equal(1, output.elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].value);
        });
        it("should parse anonymous function declaration without params and multiple body", function(){
            var program = '-> {8; 10}';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);
            assert.equal('Function', output.elements[0].type);
            // no name
            assert.equal(null, output.elements[0].name);
            // no params
            assert.equal(0, output.elements[0].params.length);
            assert.equal(1, output.elements[0].elements.length);

            assert.equal('Block', output.elements[0].elements[0].type);
            assert.equal(2, output.elements[0].elements[0].elements.length);
            assert.equal('NumericLiteral', output.elements[0].elements[0].elements[0].type);
            assert.equal(8, output.elements[0].elements[0].elements[0].value);
            assert.equal('NumericLiteral', output.elements[0].elements[0].elements[1].type);
            assert.equal(10, output.elements[0].elements[0].elements[1].value);
        });
        it("should parse assigning function to variable", function(){
            var program = 'a = (x = "ahoj") -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('AssignmentExpression', output.elements[0].type);

            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('Function', output.elements[0].right.type);
            // no name
            assert.equal(null, output.elements[0].right.name);
            // params
            assert.equal(1, output.elements[0].right.params.length);
            assert.equal('x', output.elements[0].right.params[0].name);
            assert.equal('StringLiteral', output.elements[0].right.params[0].default.type);
            assert.equal("ahoj", output.elements[0].right.params[0].default.value);

            assert.equal(1, output.elements[0].right.elements.length);
            assert.equal('NumericLiteral', output.elements[0].right.elements[0].type);
            assert.equal(8, output.elements[0].right.elements[0].value);
        });
        it("should parse assigning function without params to variable", function(){
            var program = 'a = -> 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('AssignmentExpression', output.elements[0].type);

            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('Function', output.elements[0].right.type);
            // no name
            assert.equal(null, output.elements[0].right.name);
            // params
            assert.equal(0, output.elements[0].right.params.length);

            assert.equal(1, output.elements[0].right.elements.length);
            assert.equal('NumericLiteral', output.elements[0].right.elements[0].type);
            assert.equal(8, output.elements[0].right.elements[0].value);
        });
        it("should parse function call without params", function(){
            var program = 'a()';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(0, output.elements[0].arguments.length);
        });
        it("should parse assigning function without params to variable and function call", function(){
            var program = 'a = -> 8; a()';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(2, output.elements.length);

            assert.equal('AssignmentExpression', output.elements[0].type);

            assert.equal('Variable', output.elements[0].left.type);
            assert.equal('a', output.elements[0].left.name);
            assert.equal('Function', output.elements[0].right.type);
            // no name
            assert.equal(null, output.elements[0].right.name);
            // params
            assert.equal(0, output.elements[0].right.params.length);

            assert.equal(1, output.elements[0].right.elements.length);
            assert.equal('NumericLiteral', output.elements[0].right.elements[0].type);
            assert.equal(8, output.elements[0].right.elements[0].value);
        });
        it("should parse function call without params, whitespace before and inside parenthesis", function(){
            var program = 'a (  )';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(0, output.elements[0].arguments.length);
        });
        it("should parse function call with one param", function(){
            var program = 'a 8';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(1, output.elements[0].arguments.length);
            assert.equal('NumericLiteral', output.elements[0].arguments[0].type);
            assert.equal(8, output.elements[0].arguments[0].value);

        });
        it("should parse function call with two params - numeric and string", function(){
            var program = 'a 8, "a"';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(2, output.elements[0].arguments.length);
            assert.equal('NumericLiteral', output.elements[0].arguments[0].type);
            assert.equal(8, output.elements[0].arguments[0].value);
            assert.equal('StringLiteral', output.elements[0].arguments[1].type);
            assert.equal("a", output.elements[0].arguments[1].value);
        });
        it("should parse function call with param - array", function(){
            var program = 'a []';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(1, output.elements[0].arguments.length);
            assert.equal('ArrayLiteral', output.elements[0].arguments[0].type);
            assert.equal(0, output.elements[0].arguments[0].elements.length);
        });
        it("should parse function call with param function without params", function(){
            var program = 'a b()';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(1, output.elements[0].arguments.length);
            assert.equal('FunctionCall', output.elements[0].arguments[0].type);
            assert.equal('Variable', output.elements[0].arguments[0].name.type);
            assert.equal('b', output.elements[0].arguments[0].name.name);
            assert.equal(0, output.elements[0].arguments[0].arguments.length);
        });
        it("should parse function call with param function without params and with whitespace", function(){
            var program = 'a b ()';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(1, output.elements[0].arguments.length);
            assert.equal('FunctionCall', output.elements[0].arguments[0].type);
            assert.equal('Variable', output.elements[0].arguments[0].name.type);
            assert.equal('b', output.elements[0].arguments[0].name.name);
            assert.equal(0, output.elements[0].arguments[0].arguments.length);
        });
        it("should parse function call with param function with param function ", function(){
            var program = 'a b c()';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(1, output.elements[0].arguments.length);
            assert.equal('FunctionCall', output.elements[0].arguments[0].type);
            assert.equal('Variable', output.elements[0].arguments[0].name.type);
            assert.equal('b', output.elements[0].arguments[0].name.name);
            assert.equal(1, output.elements[0].arguments[0].arguments.length);
            assert.equal('FunctionCall', output.elements[0].arguments[0].arguments[0].type);
            assert.equal('Variable', output.elements[0].arguments[0].arguments[0].name.type);
            assert.equal('c', output.elements[0].arguments[0].arguments[0].name.name);
            assert.equal(0, output.elements[0].arguments[0].arguments[0].arguments.length);
        });
        it("should parse function call with params - int and callback function", function(){
            var program = 'a 1,->2';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(2, output.elements[0].arguments.length);
            assert.equal('NumericLiteral', output.elements[0].arguments[0].type);
            assert.equal('Function', output.elements[0].arguments[1].type);
            assert.equal(0, output.elements[0].arguments[1].params.length);
        });
        it("should parse function call with params - int and callback function", function(){
            var program = 'a 1,(x)->2';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('FunctionCall', output.elements[0].type);
            assert.equal('Variable', output.elements[0].name.type);
            assert.equal('a', output.elements[0].name.name);
            assert.equal(2, output.elements[0].arguments.length);
            assert.equal('NumericLiteral', output.elements[0].arguments[0].type);
            assert.equal('Function', output.elements[0].arguments[1].type);
            assert.equal(1, output.elements[0].arguments[1].params.length);
        });
        // todo function param function (callback style)
        it("should parse array access", function(){
            var program = 'a<1>';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('PropertyAccess', output.elements[0].type);
            assert.equal('Variable', output.elements[0].base.type);
            assert.equal('a', output.elements[0].base.name);
            assert.equal('NumericLiteral', output.elements[0].name.type);
            assert.equal('1', output.elements[0].name.value);
        });
        it("should parse array access with spaces", function(){
            var program = 'a <1> ';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('PropertyAccess', output.elements[0].type);
            assert.equal('Variable', output.elements[0].base.type);
            assert.equal('a', output.elements[0].base.name);
            assert.equal('NumericLiteral', output.elements[0].name.type);
            assert.equal('1', output.elements[0].name.value);
        });
        it("should parse array access with expression", function(){
            var program = 'a<1 + 1>';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('PropertyAccess', output.elements[0].type);
            assert.equal('Variable', output.elements[0].base.type);
            assert.equal('a', output.elements[0].base.name);
            assert.equal('BinaryExpression', output.elements[0].name.type);
        });
        it("should parse array access on function call", function(){
            var program = 'a()<1>';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);
            assert.equal(1, output.elements.length);

            assert.equal('PropertyAccess', output.elements[0].type);
            assert.equal('FunctionCall', output.elements[0].base.type);
            assert.equal('NumericLiteral', output.elements[0].name.type);
            assert.equal('1', output.elements[0].name.value);
        });
        it('should parse map build-in function', function(){
            var program = '[1, 3, 4].map : -> 1';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);

            assert.equal(1, output.elements.length);
            assert.equal('PropertyAccess', output.elements[0].type);
            assert.equal('ArrayLiteral', output.elements[0].base.type);
            assert.equal('map', output.elements[0].name);
            assert.equal('Function', output.elements[0].argument.type);
            assert.equal(0, output.elements[0].argument.params.length);
        });
        it('should parse map build-in function', function(){
            var program = '[1, 3, 4].map : (x) -> x';
            var output = parser.parse(program);
            //output is program
            assert.equal('Program', output.type);

            assert.equal(1, output.elements.length);
            assert.equal('PropertyAccess', output.elements[0].type);
            assert.equal('ArrayLiteral', output.elements[0].base.type);
            assert.equal('map', output.elements[0].name);
            assert.equal('Function', output.elements[0].argument.type);
            assert.equal(1, output.elements[0].argument.params.length);
        });
        // todo foreach etc
    })
});


describe('interpreter', function(){
    describe('evaluate', function(){
        it('should interpret empty', function(){
            var program = ';';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal('', output[0]);
        });
        it('should interpret integer literal', function(){
            var program = '10';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(10, output[0]);
        });
        it('should interpret null literal', function(){
            var program = 'null';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(null, output[0]);
        });
        it('should interpret bool literals', function(){
            var program = 'true;yes;on;false;no;off';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(6, output.length);
            assert.equal(true, output[0]);
            assert.equal(true, output[1]);
            assert.equal(true, output[2]);
            assert.equal(false, output[3]);
            assert.equal(false, output[4]);
            assert.equal(false, output[5]);
        });
        it('should interpret string literals', function(){
            var program = '""; "ahoj"';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal("", output[0]);
            assert.equal("ahoj", output[1]);
        });
        it('should interpret undefined variable', function(){
            var program = 'a';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(undefined, output[0]);
        });
        it('should interpret empty array', function(){
            var program = '[]';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(0, output[0].length);
        });
        it('should interpret not empty array', function(){
            var program = '[8];[a,"b",9]';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(1, output[0].length);
            assert.equal(8, output[0][0]);
            assert.equal(3, output[1].length);
            assert.equal(undefined, output[1][0]);
            assert.equal("b", output[1][1]);
            assert.equal(9, output[1][2]);
        });
        it('should interpret multi array', function(){
            var program = '[ [5, 8], 6 ]';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(2, output[0].length);
            assert.equal(2, output[0][0].length);
            assert.equal(5, output[0][0][0]);
            assert.equal(8, output[0][0][1]);
            assert.equal(6, output[0][1]);
        });
        it('should interpret assignment numeric literal and retrieving variable', function(){
            var program = 'a = 8; a';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(8, output[0]);
            assert.equal(8, output[1]);
        });
        it('should interpret assignment string, array literal and retrieving variable', function(){
            var program = 'a = "x"; a; b = []; b';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(4, output.length);
            assert.equal("x", output[0]);
            assert.equal("x", output[1]);
            assert.equal(0, output[2].length);
            assert.equal(0, output[3].length);
        });
        it('should interpret assignment string and another variable', function(){
            var program = 'a = "x"; b = a; b';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal("x", output[0]);
            assert.equal("x", output[1]);
            assert.equal("x", output[2]);
        });
        it('should interpret unary expression !', function(){
            var program = '!true; !false; !!false;not true';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(4, output.length);
            assert.equal(false, output[0]);
            assert.equal(true, output[1]);
            assert.equal(false, output[2]);
            assert.equal(false, output[3]);
        });
        it('should interpret unary expression ~', function(){
            var program = '~1; a = 5; ~a';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(-1, output[0]);
            assert.equal(5, output[1]);
            assert.equal(-5, output[2]);
        });
        it('should interpret binary expression ==', function(){
            var program = 'true == true; "1" == "1"; [] == []; a = []; a == a; true == false; false == false; false == true; 1 == 1; 1 == 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(10, output.length);
            assert.equal(true, output[0]);
            assert.equal(true, output[1]);
            assert.equal(false, output[2]);
            assert.equal(0, output[3].length);
            assert.equal(true, output[4]); //output of the assignment
            assert.equal(false, output[5]);
            assert.equal(true, output[6]);
            assert.equal(false, output[7]);
            assert.equal(true, output[8]);
            assert.equal(false, output[9]);
        });
        it('should interpret binary expression == alias is', function(){
            var program = 'true is true; "1" is "1"; [] is []; a = []; a is a; true is false; false is false; false is true; 1 is 1; 1 is 2;';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(10, output.length);
            assert.equal(true, output[0]);
            assert.equal(true, output[1]);
            assert.equal(false, output[2]);
            assert.equal(0, output[3].length); //output of the assignment
            assert.equal(true, output[4]);
            assert.equal(false, output[5]);
            assert.equal(true, output[6]);
            assert.equal(false, output[7]);
            assert.equal(true, output[8]);
            assert.equal(false, output[9]);
        });
        it('should interpret binary expression !=', function(){
            var program = 'true != true; "1" != "1"; [] != []; a = []; a != a; true != false; false != false; false != true; 1 != 1; 1 != 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(10, output.length);
            assert.equal(false, output[0]);
            assert.equal(false, output[1]);
            assert.equal(true, output[2]);
            assert.equal(0, output[3].length); //output of the assignment
            assert.equal(false, output[4]);
            assert.equal(true, output[5]);
            assert.equal(false, output[6]);
            assert.equal(true, output[7]);
            assert.equal(false, output[8]);
            assert.equal(true, output[9]);
        });
        it('should interpret binary expression != alias isnt', function(){
            var program = 'true isnt true; "1" isnt "1"; [] isnt []; a = []; a isnt a; true isnt false; false isnt false; false isnt true; 1 isnt 1; 1 isnt 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(10, output.length);
            assert.equal(false, output[0]);
            assert.equal(false, output[1]);
            assert.equal(true, output[2]);
            assert.equal(0, output[3].length); //output of the assignment
            assert.equal(false, output[4]);
            assert.equal(true, output[5]);
            assert.equal(false, output[6]);
            assert.equal(true, output[7]);
            assert.equal(false, output[8]);
            assert.equal(true, output[9]);
        });
        it('should interpret binary expression >', function(){
            var program = 'true > true; "1" > "1"; [] > []; 1 > 1; 1 > 2; 2 > 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(6, output.length);
            assert.equal(false, output[0]);
            assert.equal(false, output[1]);
            assert.equal(false, output[2]);
            assert.equal(false, output[3]);
            assert.equal(false, output[4]);
            assert.equal(true, output[5]);
        });
        it('should interpret binary expression <', function(){
            var program = 'true < true; "1" < "1"; [] < []; 1 < 1; 1 < 2; 2 < 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(6, output.length);
            assert.equal(false, output[0]);
            assert.equal(false, output[1]);
            assert.equal(false, output[2]);
            assert.equal(false, output[3]);
            assert.equal(true, output[4]);
            assert.equal(false, output[5]);
        });
        it('should interpret binary expression <=', function(){
            var program = 'true <= true; "1" <= "1"; [] <= []; 1 <= 1; 1 <= 2; 2 <= 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(6, output.length);
            assert.equal(true, output[0]);
            assert.equal(true, output[1]);
            assert.equal(true, output[2]);
            assert.equal(true, output[3]);
            assert.equal(true, output[4]);
            assert.equal(false, output[5]);
        });
        it('should interpret binary expression >=', function(){
            var program = 'true >= true; "1" >= "1"; [] >= []; 1 >= 1; 1 >= 2; 2 >= 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(6, output.length);
            assert.equal(true, output[0]);
            assert.equal(true, output[1]);
            assert.equal(true, output[2]);
            assert.equal(true, output[3]);
            assert.equal(false, output[4]);
            assert.equal(true, output[5]);
        });
        it('should interpret binary expression +', function(){
            var program = '1+1; 2+2; "a" + "b";';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(2, output[0]);
            assert.equal(4, output[1]);
            assert.equal("ab", output[2]);
        });
        it('should interpret binary expression +', function(){
            var program = 'a = 1; a + 2;';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(1, output[0]);
            assert.equal(3, output[1]);
        });
        it('should interpret binary expression -', function(){
            var program = '1-1; 2-2; 3-4';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(0, output[0]);
            assert.equal(0, output[1]);
            assert.equal(-1, output[2]);
        });
        it('should interpret binary expression -', function(){
            var program = '1-1; 2-2; 3-4';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(0, output[0]);
            assert.equal(0, output[1]);
            assert.equal(-1, output[2]);
        });
        it('should interpret binary expression *', function(){
            var program = '1*1; 2*2; 3*4';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(1, output[0]);
            assert.equal(4, output[1]);
            assert.equal(12, output[2]);
        });
        it('should interpret binary expression /', function(){
            var program = '10/1; 4/2; 6/3';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(10, output[0]);
            assert.equal(2, output[1]);
            assert.equal(2, output[2]);
        });
        it('should interpret binary expression / with float', function(){
            var program = '10/3; 4/3; 6/3';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal((10/3), output[0]);
            assert.equal((4/3), output[1]);
            assert.equal((6/3), output[2]);
        });
        it('should interpret binary expression &&', function(){
            var program = 'true && true; true && false; false && false; false && true;true and true; true and false; false and false; false and true;';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(8, output.length);
            assert.equal(true, output[0]);
            assert.equal(false, output[1]);
            assert.equal(false, output[2]);
            assert.equal(false, output[3]);
            assert.equal(true, output[4]);
            assert.equal(false, output[5]);
            assert.equal(false, output[6]);
            assert.equal(false, output[7]);
        });
        it('should interpret binary expression &&', function(){
            var program = 'true || true; true || false; false || false; false || true;true or true; true or false; false or false; false or true;';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(8, output.length);
            assert.equal(true, output[0]);
            assert.equal(true, output[1]);
            assert.equal(false, output[2]);
            assert.equal(true, output[3]);
            assert.equal(true, output[4]);
            assert.equal(true, output[5]);
            assert.equal(false, output[6]);
            assert.equal(true, output[7]);
        });
        it('should interpret if expression', function(){
            var program = 'if true then 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(1, output[0]);
        });
        it('should interpret if expression', function(){
            var program = 'if true then 1 + 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(2, output[0]);
        });
        it('should interpret if expression', function(){
            var program = 'if 1 == 1 then 1 + 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(2, output[0]);
        });
        it('should interpret if expression with multiple expressions', function(){
            var program = 'if 1 == 1 {1 + 1; 2+2}';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(4, output[0]);
        });
        it('should interpret if expression with multiple expressions and else', function(){
            var program = 'if 1 != 1 {1 + 1; 2+2} else {1 - 1; 2 * 3}';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(6, output[0]);
        });
        it('should interpret if expression with multiple expressions and else', function(){
            var program = 'if 1 != 1 then c else {1 - 1; 2 * 3}';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(6, output[0]);
        });
        it('should interpret if expression with else ', function(){
            var program = 'if 1 == 1 then 1 + 1 else 8';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(2, output[0]);
        });
        it('should interpret if expression with else ', function(){
            var program = 'if false then 1 + 1 else 8';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(8, output[0]);
        });
        it('should interpret if expression with else ', function(){
            var program = 'if false then 1 + 1 else 8*5';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(40, output[0]);
        });
        it('should interpret if expression with else with multiple expressions', function(){
            var program = 'if false then 1 + 1 else {8*5; 20}';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(20, output[0]);
        });
        it('should interpret assignment of if expression with else ', function(){
            var program = 'a = if false then 1 + 1 else 8*5; a';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(40, output[0]);
            assert.equal(40, output[1]);
        });
        it('should interpret assignment of if expression with else ', function(){
            var program = 'a = if true then 1 + 1 else 8*5; a';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(2, output[0]);
            assert.equal(2, output[1]);
        });
        it('should interpret assignment of function and call ', function(){
            var program = 'a = -> 8; a()';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(8, output[1]);
        });
        it('should interpret assignment of function with global variable and call ', function(){
            var program = 'b = 7;a = -> b; a()';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(7, output[0]);
            assert.equal(null, output[1]);
            assert.equal(7, output[2]);
        });
        it('should interpret assignment of function with global variable and call ', function(){
            var program = 'b = 7;a = -> b + 1; a()';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(7, output[0]);
            assert.equal(null, output[1]);
            assert.equal(8, output[2]);
        });
        it('should interpret assignment of function with parameter and call ', function(){
            var program = 'a = (b) -> b; a 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(2, output[1]);
        });
        it('should interpret assignment of function with parameter and multiple expressions and call ', function(){
            var program = 'a = (b) -> {1; b + 1}; a 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(3, output[1]);
        });
        it('should interpret assignment of function with parameter and multiple expressions and call ', function(){
            var program = 'a = (b) -> {1; b + 1}; x = a 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(3, output[1]);
        });
        it('should interpret assignment of function with parameter and call ', function(){
            var program = 'a = (a) -> a; a 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(2, output[1]);
        });
        it('should interpret assignment of function with parameter and call ', function(){
            var program = 'a = (a) -> a + 1; a 2';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(3, output[1]);
        });
        it('should interpret assignment of function with parameter expression and call ', function(){
            var program = 'a = (a) -> a + 1; a 2 + 1';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(null, output[0]);
            assert.equal(4, output[1]);
        });
        it('should interpret assignment of function with parameter variable and call ', function(){
            var program = 'a = (a) -> a + 1;b = 66; a b';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(null, output[0]);
            assert.equal(66, output[1]);
            assert.equal(67, output[2]);
        });
        it('should interpret assignment of function with parameter function call and call ', function(){
            var program = 'a = (a) -> a + 1;b = -> 88; a b()';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(null, output[0]);
            assert.equal(null, output[1]);
            assert.equal(89, output[2]);
        });
        it('should interpret assignment of function with parameter function call and call ', function(){
            var program = 'a = (a) -> a + 1;b = (b) -> b * 2; c = -> 8; a b c()';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(4, output.length);
            assert.equal(null, output[0]);
            assert.equal(null, output[1]);
            assert.equal(null, output[2]);
            assert.equal(17, output[3]);
        });
        it('should interpret recursive function ', function(){
            var program = 'fact = (x) -> if x == 0 then 1 else x * fact x - 1; fact 2; fact 3; fact 4';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(4, output.length);
            assert.equal(2, output[1]);
            assert.equal(6, output[2]);
            assert.equal(24, output[3]);
        });
        it('should interpret assignment of function with parameter variable and function and call ', function(){
            var program = 'a = (a, b) -> b a;b = -> 66; a 1,b';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(null, output[0]);
            assert.equal(null, output[1]);
            assert.equal(66, output[2]);
        });
        it('should interpret assignment of function with parameter variable and function and call ', function(){
            var program =
                'a = (a, b) -> b a;' +
                'b = (x)-> x + 66;' +
                'a 1,b';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(3, output.length);
            assert.equal(null, output[0]);
            assert.equal(null, output[1]);
            assert.equal(67, output[2]);
        });
        it('should interpret array access', function(){
            var program = 'x = [8]; x<0>';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(1, output[0].length);
            assert.equal(8, output[0][0]);
            assert.equal(8, output[1]);
        });
        it('should interpret array access with expression', function(){
            var program = 'x = [8, 9, 10]; x<0 + 1>';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(3, output[0].length);
            assert.equal(8, output[0][0]);
            assert.equal(9, output[1]);
        });
        it('should interpret array access with direct call', function(){
            var program = '[8, 9, 10]<1>';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(9, output[0]);
        });
        it('should interpret array access with direct call on function return value', function(){
            var program = 'a = -> [8, 9, 10]; a()<1>';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(2, output.length);
            assert.equal(9, output[1]);
        });
        it('should interpret array length build-in function', function(){
            var program = '[1, 3, 4].length';
            var ast = parser.parse(program);
            var output = interpreter.evaluate(ast);
            assert.equal(1, output.length);
            assert.equal(3, output[0]);
        });
//        it('should interpret map build-in function', function(){
//            var program = '[1, 3, 4].map: -> 1';
//            var ast = parser.parse(program);
//            var output = interpreter.evaluate(ast);
//            assert.equal(1, output.length);
//            assert.equal(3, output[0]);
//        });
        //TODO build-in functions? - array length, loadFromDisk?
    });
});

describe('knapsack', function() {
//    it('ut itemsPrice function', function(){
//        var program =
//            'items = [[1, 3], [2, 1]];' +
//            // [price, weight]
//            'itemsPrice = (items) -> (item.map (x) -> x[1]).reduce (x, y) -> x + y';
//        var ast = parser.parse(program);
//        var output = interpreter.evaluate(ast);
//        console.log(output);
//    });
//    it('ut checkBestSollution function', function(){
//        var program =
//            'bestSolution = [];' +
//            'checkBestSolution = (items) -> ';
//        var ast = parser.parse(program);
//        var output = interpreter.evaluate(ast);
//        console.log(output);
//    });
//    it('start', function(){
//        var program =
//            'size = 5;\n' +
//            'items = [[1, 2], [3, 2], [1, 4]];\n' +
//            'bestPrice = 0;' +
//            'bestSolution = [];' +
//            'i = 0;' //+
//            //'addToKnapsack = () -> if '
//            ;
//        // [price, weight]
//        var ast = parser.parse(program);
//        var output = interpreter.evaluate(ast);
//    });
});
