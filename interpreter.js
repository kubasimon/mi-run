var interpreter = (function(undefined) {
var interpreter = {
   evaluate: function(program) {
    if (program.type === 'Program') {
        this._cleanUp();
        return this.evaluateProgramElements(program.elements);
    } else {
        throw new Error('ast has not type Program');
    }
   }
};

interpreter.dbg = [];

interpreter._cleanUp = function() {
    interpreter.globalEnvironment = interpreter.createEnvironment(null);
    interpreter.addToEnvironment(interpreter.globalEnvironment, 'dbg', {type: 'dbg'});
    interpreter.dbg = [];
};


interpreter.createEnvironment = function(parentEnvironment){
    return {
        parent: parentEnvironment,
        objects: {},
        anonymousCounter: 0
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

interpreter.saveAnonymousFunction = function(environment, expression) {
    var name = "anonymous_" + environment.anonymousCounter;
    environment.anonymousCounter ++;
    expression.name = {
        name: name
    };
    interpreter.saveFunctionToEnvironment(environment, name, expression)
};

interpreter.saveFunctionToEnvironment = function(environment, functionName, expression) {
    //store whole function ast
    //create function environment in time when function was defined
    expression.environment = this.createEnvironment(environment);
    interpreter.addToEnvironment(environment, functionName, expression);
};

interpreter.globalEnvironment = {};

interpreter.evaluateProgramElements = function(elements) {
    if (elements) {
        var i = 0, length = elements.length, output = [];
        for(; i < length; i++) {
            output.push(this.evaluateStatement(elements[i], this.globalEnvironment));
        }
        if (interpreter.dbg.length > 0) {
            output["_dbg"] = interpreter.dbg;
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
                this.saveAnonymousFunction(environment, statement);
                return null;
            case 'FunctionCall':
                return this.evaluateFunctionCallExpression(statement, environment);
            case 'PropertyAccess':
                return this.evaluatePropertyAccessExpression(statement, environment);
            case 'Block':
                return this.evaluateBlockExpression(statement, environment);
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
                interpreter.saveFunctionToEnvironment(environment, variableName, expression.right);
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
    var expr;
    if (expression.operator === '!') {
        expr = this.evaluateStatement(expression.expression, environment);
        //todo better converting??
        return !expr;
    } else if (expression.operator === '-') {
        expr = this.evaluateStatement(expression.expression, environment);
        return -expr;
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
    if (functionBody.type === 'dbg') {
        return interpreter.evaluateBuildInDbg(environment, expression.arguments)
    } else {
        if (functionBody && functionBody.type === 'Function') {
            var functionEnvironment, i = 0, length, argument, result = null;
            // function environment was created when function was stored in environment
            functionEnvironment = functionBody.environment;
            length = functionBody.params.length;
            //adding params to environment
            for(; i < length; i++) {
                argument = this.evaluateStatement(expression.arguments[i], environment);
                if (argument.length) {
                    //use last expression in possible function
                    argument = argument[argument.length - 1];
                }
                this.addToEnvironment(functionEnvironment, functionBody.params[i].name, argument);
            }
            //evaluate all elements inside function
            length = functionBody.elements.length;
            for(i = 0; i < length; i++) {
                result = this.evaluateStatement(functionBody.elements[i], functionEnvironment);
            }
            return result;
        } else {
            throw new Error('"variable ' + name + '" is not a function: %j', functionBody);
        }
    }

};

interpreter.evaluateBuildInDbg = function(environment, args) {
    var i = 0, val;
    for (;i < args.length; i++) {
        val = interpreter.evaluateStatement(args[i], environment);
        interpreter.dbg.push(val);
    }
    return null;
};

interpreter.evaluateAnonymousFunction = function(expression, arguments) {
    //todo refactor
    var functionBody = expression;
    if (functionBody && functionBody.type === 'Function') {
        var functionEnvironment, i = 0, length, argument, result = null;
        // function environment was created when function was stored in environment
        functionEnvironment = functionBody.environment;
        length = expression.params.length;

        if (length === 1) {
            this.addToEnvironment(functionEnvironment, functionBody.params[i].name, arguments);
        } else if (length > 1) {
            //adding params to environment
            for(; i < length; i++) {
//                argument = this.evaluateStatement(arguments[i], functionEnvironment);
//                if (argument.length) {
//                    //use last expression in possible function
//                    argument = argument[argument.length - 1];
//                }
                this.addToEnvironment(functionEnvironment, functionBody.params[i].name, arguments[i]);
            }
        }

        //evaluate all elements inside function
        length = functionBody.elements.length;
        for(i = 0; i < length; i++) {
            result = this.evaluateStatement(functionBody.elements[i], functionEnvironment);
        }
        return result;
    } else {
        throw new Error('"variable ' + name + '" is not a function: %j', functionBody);
    }
};

interpreter.evaluatePropertyAccessExpression = function(expression, environment) {
    var base = this.evaluateStatement(expression.base, environment);
    var name = expression.name;
    if (expression.name.type) {
        //right side is function or expression
        name = this.evaluateStatement(expression.name, environment);
    }
    //we can have property "argument", so we are calling property as a function
    if (expression.argument) {
        var arguments, functionEnvironment, expr;


        functionEnvironment = environment;
        if (expression.argument.type === 'Function') {
            interpreter.saveAnonymousFunction(environment, expression.argument);
        } else {
            arguments = this.evaluateStatement(expression.argument, environment);
        }
        if (expression.name === 'map') {
            return interpreter.Array.map(expression.argument, base, functionEnvironment);
        } else if (expression.name === 'reduce') {
            return interpreter.Array.reduce(expression.argument, base, functionEnvironment);
        } else {
            throw new Error('not implemented function ' + name);
        }
    }
    //otherwise right side is property - e.g. length
    return base[name];
};

interpreter.Array = {
    map: function(functionExpression, base) {
        var len = base.length;
        if (functionExpression.type !== "Function")
            throw new TypeError();

        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            res[i] = interpreter.evaluateAnonymousFunction(functionExpression, base[i]);
        }

        return res;
    },

    reduce: function(functionExpression, base) {
        var len = base.length;
        //todo initial value!?!
        if (functionExpression.type !== "Function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0)
            throw new TypeError();

        var rv = 0;
        if (functionExpression.params.length === 3) {
            rv = interpreter.evaluateStatement(functionExpression.params[2].default, functionExpression.environment);
        }

        var i = 0;
        for (; i < len; i++) {
            rv = interpreter.evaluateAnonymousFunction(functionExpression, [base[i], rv]);
        }

        return rv;
    }
};

interpreter.evaluateBlockExpression = function(expression, environment) {
    var i = 0, length = expression.elements.length, output = null;
    for(; i < length; i++) {
        output = this.evaluateStatement(expression.elements[i], environment);
    }
    return output;
};

return interpreter;
})();

if (typeof module !== "undefined") {
    module.exports = interpreter;
}