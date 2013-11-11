var vm = (function(undefined) {
    var vm = {
        stack: [],
        heap: [],
        localVariables : []
    };

    vm.start = function() {
        vm.stack = [];
        vm.heap = [];
        vm.localVariables = [];
    };

    vm.interpreter = {};
    vm.interpreter.pushIntInstruction = function(intValue) {
        vm.stack.push(intValue)
    };

    vm.interpreter.loadInstruction = function(localVariableIndex) {
        vm.stack.push(vm.localVariables[localVariableIndex])
    };

    vm.interpreter.storeInstruction = function(localVariableIndex) {
        vm.localVariables[localVariableIndex] = vm.stack.pop();
    };

    vm.interpreter.addInstruction = function() {
        var val1 = vm.stack.pop();
        var val2 = vm.stack.pop();
        vm.stack.push(val1 + val2)
    };

    vm.interpreter.subtractInstruction = function() {
        var val1 = vm.stack.pop();
        var val2 = vm.stack.pop();
        vm.stack.push(val1 - val2)
    };

    vm.interpreter.compareInstruction = function() {
        var val1 = vm.stack.pop();
        var val2 = vm.stack.pop();
        var res = 0; // FALSE
        if (val1 == val2) {
            res = 1; // TRUE
        }
        vm.stack.push(res)
    };

    return vm;
})();

if (typeof module !== "undefined") {
    module.exports = vm;
}