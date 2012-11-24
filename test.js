


var assert = require("assert");

var PEG, grammar, parser;


PEG = require("pegjs");
fs = require('fs');
grammar = fs.readFileSync('grammar.peg', "utf-8");

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
        it('should parse binary expression with operator ==', function(){
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
        //todo conditional assignment - mood = singing if true
        //todo unless - negated if





    })
})