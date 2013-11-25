var vm = (function(undefined) {
    var vm = {};

    vm.start = function() {
        vm.stack = {
            _data: [],
            size: 0,
            maxStackSize: 1024,
            push: function(val) {
                this.size++;
                if (this.size > this.maxStackSize) {
                    throw new Error("StackOverflow, max stack level reached: " + this.maxStackSize);
                }
                return this._data.push(val)
            },
            pop: function() {
                this.size--;
                return this._data.pop()
            }
        };

        vm.heap = [];
        vm.localVariables = [];
        vm.instructions = [];
        vm.instructionPointer = 0;
        vm.constantPool = [];
    };

    vm.addInstruction = function(instruction) {
        return vm.instructions.push(instruction) - 1
    };

    vm.setConstantPool = function(constants) {
        vm.constantPool = constants
    };

    vm.getConstantValue = function(index) {
        if (index.indexOf('#') !== 0) {
            throw Error("Index [" + index + "] is not starting with '#'!");
        }
        var accessIndex = index.substr(1, index.length);
        var val = vm.constantPool[accessIndex];
        if (val) {
//            console.log("Index " + index + " value: " + val);
            return val;
        } else {
            throw Error("Index [" + index + "] not found in constant pool: " + JSON.stringify(vm.constantPool));
        }
    };



    vm.interpreter = {};

    vm.interpreter.process = function() {
        while(vm.instructionPointer < vm.instructions.length) {
            var instruction = vm.instructions[vm.instructionPointer].split(" ");
//            console.log("#" + vm.instructionPointer + ": " + instruction);
//            console.log(vm.stack);
//            console.log(vm.localVariables);
            var jump = false;
            switch (instruction[0]) {
                case 'push_c':
                    var constantValue = vm.getConstantValue(instruction[1]);
                    vm.interpreter.pushIntInstruction(constantValue);
                    break;
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
                    vm.interpreter.compareInstruction();
                    break;
                case 'conditional_jump':
                    jump = vm.interpreter.conditionalJumpInstruction();
                    break;
                case 'jump':
                    vm.interpreter.jumpInstruction(parseInt(instruction[1], 10));
                    jump = true;
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

    vm.interpreter.jumpInstruction = function(jumpTo) {
        vm.instructionPointer = jumpTo;
    };

    return vm;
})(undefined);

if (typeof module !== "undefined") {
    module.exports = vm;
}