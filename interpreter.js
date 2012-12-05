var interpreter = (function(undefined) {
var interpreter = {
   evaluate: function(program) {
    if (program.type === 'Program') {
        interpreter.globalEnvironment = interpreter.createEnvironment(null);
        return this.evaluateProgramElements(program.elements);
    } else {
        throw new Error('ast has not type Program');
    }
   }
};


interpreter.createEnvironment = function(parentEnvironment){
    return {
        parent: parentEnvironment,
        objects: {}
    }
};

interpreter.addToEnvironment = function(environment, name, body) {
    environment.objects[name] = body;
};

interpreter.retrieveFromEnvironment = function(environment, name) {
    var value = environment.objects[name];
    if (value !== undefined) {
        return value;
    } else if (environment.parent !== null){
        return interpreter.retrieveFromEnvironment(environment.parent, name);
    }
    return value;
};

interpreter.globalEnvironment = {};

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
    return interpreter.retrieveFromEnvironment(environment, variableName);
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
                //store whole function ast
                //create function environment in time when function was defined
                expression.right.environment = this.createEnvironment(environment);
                interpreter.addToEnvironment(environment, variableName, expression.right);
                return null;
            } else {
                var evaluatedRight = this.evaluateStatement(expression.right, environment);
                //save variable to environment
                interpreter.addToEnvironment(environment, variableName, evaluatedRight);
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
    var functionBody = this.evaluateVariable(name, environment);
    if (functionBody && functionBody.type === 'Function') {
        var functionEnvironment, i = 0, length, argument, result = [];
        // function environment was created when function was stored in environment
        functionEnvironment = functionBody.environment;
        length = functionBody.params.length;
        //adding params to environment
        for(; i < length; i++) {
            argument = this.evaluateStatement(expression.arguments[i], environment);
            this.addToEnvironment(functionEnvironment, functionBody.params[i].name, argument);
        }
        //evaluate all elements inside function
        length = functionBody.elements.length;
        for(i = 0; i < length; i++) {
            result.push(this.evaluateStatement(functionBody.elements[i], functionEnvironment));
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