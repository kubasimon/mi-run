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
            case '':
                return;
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
}

return interpreter;
})();

if (typeof module !== "undefined") {
    module.exports = interpreter;
}