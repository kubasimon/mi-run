var vm = (function(undefined) {
    var vm = {};

    vm.start = function() {
        vm.heap = [];
        vm.stackFrames = [];
        vm.currentStackFrame = 0;
        vm.stackFrames.push(vm.createNewStackFrame());
    };

    vm.currentFrame = function() {
        return vm.stackFrames[vm.currentStackFrame];
    };

    vm.createNewStackFrame = function() {
        return {
            localVariables: [],
            instructions: [],
            instructionPointer: 0,
            constantPool: [],
            stack: {
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
            }
        }
    };

    vm.addInstruction = function(instruction) {
        return vm.currentFrame().instructions.push(instruction) - 1
    };

    vm.setConstantPool = function(constants) {
        vm.currentFrame().constantPool = constants
    };

    vm.getConstantValue = function(index) {
        if (index.indexOf('#') !== 0) {
            throw Error("Index [" + index + "] is not starting with '#'!");
        }
        var accessIndex = index.substr(1, index.length);
        var val = vm.currentFrame().constantPool[accessIndex];
        if (val) {
//            console.log("Index " + index + " value: " + val);
            return val;
        } else {
            throw Error("Index [" + index + "] not found in constant pool: " + JSON.stringify(vm.currentFrame().constantPool));
        }
    };



    vm.interpreter = {};

    vm.interpreter.process = function() {
        while(vm.currentFrame().instructionPointer < vm.currentFrame().instructions.length) {
            var instruction = vm.currentFrame().instructions[vm.currentFrame().instructionPointer].split(" ");
//            console.log("#" + vm.currentFrame().instructionPointer + ": " + instruction);
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
                vm.currentFrame().instructionPointer++;
            }
        }
    };

    // ---- instructions
    vm.interpreter.pushIntInstruction = function(intValue) {
        vm.currentFrame().stack.push(intValue)
    };

    vm.interpreter.loadInstruction = function(localVariableIndex) {
        vm.currentFrame().stack.push(vm.currentFrame().localVariables[localVariableIndex])
    };

    vm.interpreter.storeInstruction = function(localVariableIndex) {
        vm.currentFrame().localVariables[localVariableIndex] = vm.currentFrame().stack.pop();
    };

    vm.interpreter.addInstruction = function() {
        var val1 = vm.currentFrame().stack.pop();
        var val2 = vm.currentFrame().stack.pop();
        vm.currentFrame().stack.push(val1 + val2)
    };

    vm.interpreter.subtractInstruction = function() {
        var val1 = vm.currentFrame().stack.pop();
        var val2 = vm.currentFrame().stack.pop();
        vm.currentFrame().stack.push(val1 - val2)
    };

    vm.interpreter.compareInstruction = function() {
        var val1 = vm.currentFrame().stack.pop();
        var val2 = vm.currentFrame().stack.pop();
        var res = 0; // FALSE
        if (val1 == val2) {
            res = 1; // TRUE
        }
        vm.currentFrame().stack.push(res)
    };

    vm.interpreter.conditionalJumpInstruction = function() {
        var condition = vm.currentFrame().stack.pop();
        var pointer = vm.currentFrame().stack.pop();
        if (condition != 0) {
            vm.currentFrame().instructionPointer = pointer;
            return true
        }
        return false
    };

    vm.interpreter.jumpInstruction = function(jumpTo) {
        vm.currentFrame().instructionPointer = jumpTo;
    };

    return vm;
})(undefined);

if (typeof module !== "undefined") {
    module.exports = vm;
}