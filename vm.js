var vm = (function(undefined) {
    var vm = {
        stack: [],
        localVariables : []
    };

    vm.start = function() {
        vm.stack = [];
        vm.localVariables = [];
    };

    vm.interpreter = {};
    vm.interpreter.loadInstruction = function(localVariableIndex) {
        vm.stack.push(vm.localVariables[localVariableIndex])
    };

    vm.interpreter.storeInstruction = function(localVariableIndex) {
        vm.localVariables[localVariableIndex] = vm.stack.pop();
    };

    return vm;
})();

if (typeof module !== "undefined") {
    module.exports = vm;
}