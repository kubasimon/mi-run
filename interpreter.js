var interpreter = (function(undefined) {
var interpreter = {
   evaluate: function(program) {
    if (program.type === 'Program') {
        return this.evaluateProgramElements(program.elements);
    } else {
        throw new Error('ast has not type Program');
    }
   }
};

interpreter.globalEnvironment = {
};

interpreter.evaluateProgramElements = function(elements) {
    if (elements) {
        var i = 0, length = elements.length, output = [];
        for(; i < length; i++) {
            output.push(this.evaluateStatement(elements[i], this.globalEnvironment));
        }
        return output;
    } else {
        throw new Error('No elements');
    }
};

interpreter.evaluateStatement = function(statement, environment) {
    if (statement) {
        switch (statement.type) {
            case 'EmptyStatement':
                return '';
            case 'NumericLiteral':
                return statement.value;
            case 'NullLiteral':
                return null;
            case 'BooleanLiteral':
                return statement.value;
            case 'StringLiteral':
                return statement.value;
            case 'Variable':
                return this.evaluateVariable(statement.name, environment);
            case 'ArrayLiteral':
                return this.evaluateArrayLiteral(statement.elements, environment);
            case 'AssignmentExpression':
                return this.evaluateAssignmentExpression(statement, environment);
            case 'UnaryExpression':
                return this.evaluateUnaryExpression(statement, environment);
            case 'BinaryExpression':
                return this.evaluateBinaryExpression(statement, environment);
            default:
                throw new Error('Not supported statement type: ' + statement.type);
        }
    } else {
      throw new Error('Unknown statement ' + statement);
    }
};

interpreter.evaluateVariable = function(variableName, environment) {
    return environment.variableName;
};

interpreter.evaluateArrayLiteral = function(elements, environment) {
    var len = elements.length, result = [], i = 0;
    for (; i < len; i++) {
        result.push(this.evaluateStatement(elements[i], environment));
    }
    return result;
};

interpreter.evaluateAssignmentExpression = function(expression, environment) {
    if (expression.left.type === 'Variable') {
        if (expression.operator === '=') {
            var variableName = expression.left.name;
            var evaluatedRight = this.evaluateStatement(expression.right, environment);
            //save variable to environment
            environment.variableName = evaluatedRight;
            return evaluatedRight;
        } else {
            throw new Error('Not supported operator: ' + expression.operator);
        }
    } else {
        throw new Error('Not supported left side: ' + expression.left);
    }
};

interpreter.evaluateUnaryExpression = function(expression, environment) {
    if (expression.operator === '!') {
        var expr = this.evaluateStatement(expression.expression, environment);
        //todo better converting??
        return !expr;
    } else {
        throw new Error('Not supported operator: ' + expression.operator);
    }
};

interpreter.evaluateBinaryExpression = function(expression, environment) {
    var left = this.evaluateStatement(expression.left, environment);
    var right = this.evaluateStatement(expression.right, environment);
    switch (expression.operator) {
        case '==':
            return left === right;
        case '!=':
            return left !== right;
        case '>':
            return left > right;
        case '<':
            return left < right;
        case '>=':
            return left >= right;
        case '<=':
            return left <= right;
        case '+':
            return left + right;
        case '-':
            return left - right;
        case '*':
            return left * right;
        case '/':
            return left / right;
        case '&&':
            return left && right;
        case '||':
            return left || right;
        default:
            throw new Error('Not supported operator: ' + expression.operator);
    }

};



return interpreter;
})();

if (typeof module !== "undefined") {
    module.exports = interpreter;
}