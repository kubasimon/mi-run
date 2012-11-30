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
            case 'IfExpression':
                return this.evaluateIfExpression(statement, environment);
            case 'Function':
                // no effect, only anonymous function declaration
                return null;
            case 'FunctionCall':
                return this.evaluateFunctionCallExpression(statement, environment);
                return null;
            default:
                throw new Error('Not supported statement type: ' + statement.type);
        }
    } else {
      throw new Error('Unknown statement ' + statement);
    }
};

interpreter.evaluateVariable = function(variableName, environment) {
//    if (environment.variableName) {
//        if (environment.variableName.type === 'Function') {
//            // todo return Function??
//            return null;
//        }
//    }
    return environment[variableName];
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
        var variableName = expression.left.name;
        if (expression.operator === '=') {
            if (expression.right.type === 'Function') {
                //store whole function and do do anything
                // todo assign current envirnoment?
                environment[variableName] = expression.right;
                return null;
            } else {
                var evaluatedRight = this.evaluateStatement(expression.right, environment);
                //save variable to environment
                environment[variableName] = evaluatedRight;
                return evaluatedRight;
            }
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

interpreter.evaluateIfExpression = function(expression, environment) {
    var condition = this.evaluateStatement(expression.condition, environment);
    if (condition) {
        return this.evaluateStatement(expression.ifExpression, environment);
    } else {
        if (expression.elseExpression) {
            if (expression.elseExpression === null) {
                return null;
            } else {
                return this.evaluateStatement(expression.elseExpression, environment);
            }
        }
        throw new Error('Else part is missing: ' + expression);
    }
};

interpreter.evaluateFunctionCallExpression = function(expression, environment) {
    //todo evaluate name??
    var name = expression.name.name;
    var functionBody = environment[name];
    if (functionBody && functionBody.type === 'Function') {

        //todo create function environment
        //todo add params to enviroment
        //evaluate all elements inside function
        var i = 0, length = functionBody.elements.length, result = [];
        for(; i < length; i++) {
            result.push(this.evaluateStatement(functionBody.elements[i], environment));
        }
        return result;
    } else {
        throw new Error('"variable ' + name + '" is not a function: %j', functionBody);
    }

};


return interpreter;
})();

if (typeof module !== "undefined") {
    module.exports = interpreter;
}