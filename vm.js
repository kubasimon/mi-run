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
        vm.instructions = [];
        vm.instructionPointer = 0;
    };

    vm.addInstruction = function(instruction) {
        return vm.instructions.push(instruction)
    };

    vm.interpreter = {};

    vm.interpreter.process = function() {
        while(vm.instructionPointer < vm.instructions.length) {
            var instruction = vm.instructions[vm.instructionPointer].split(" ");
            var jump = false;
            switch (instruction[0]) {
                case 'push':
                    vm.interpreter.pushIntInstruction(parseInt(instruction[1], 10));
                    break;
                case 'load':
                    vm.interpreter.loadInstruction(parseInt(instruction[1], 10));
                    break;
                case 'store':
                    vm.interpreter.storeInstruction(parseInt(instruction[1], 10));
                    break;
                case 'add':
                    vm.interpreter.addInstruction();
                    break;
                case 'subtract':
                    vm.interpreter.subtractInstruction();
                    break;
                case 'compare':
                    vm.interpreter.subtractInstruction();
                    break;
                case 'conditional_jump':
                    jump = vm.interpreter.conditionalJumpInstruction();
                    break;
                default :
                    throw new Error('unknown instruction: ' + instruction.join(" "))
            }
            // move to next instruction when not jumping
            if (!jump) {
                vm.instructionPointer++;
            }
        }
    };

    // ---- instructions
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

    vm.interpreter.conditionalJumpInstruction = function() {
        var condition = vm.stack.pop();
        var pointer = vm.stack.pop();
        if (condition != 0) {
            vm.instructionPointer = pointer;
            return true
        }
        return false
    };

    return vm;
})(undefined);

if (typeof module !== "undefined") {
    module.exports = vm;
}