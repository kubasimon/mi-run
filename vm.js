var vm = (function(undefined) {
    var vm = {};

    vm.start = function() {
        vm.stackFrames = [];
        vm.currentStackFrame = 0;
        vm.maximumStackFrames = 10;
        vm.instructions = [];
        vm.instructionPointer = 0;
        vm.table = [];
        vm.createNewStackFrame(null, []);
        vm.heap = []; //vm.initializeHeap();
    };

    vm.currentFrame = function() {
        return vm.stackFrames[vm.currentStackFrame];
    };

    vm.createNewStackFrame = function(returnAddress, arguments) {
        if (vm.stackFrames.length + 1 > vm.maximumStackFrames) {
            throw new Error("StackOverflow, max stack frames level reached: " + this.maximumStackFrames);
        }
        var localVariables = [];
        for (var i = 0; i <= arguments.length; i++) {
            localVariables.push(arguments.pop())
        }

        var frame = {
            returnAddress: returnAddress,
            localVariables: localVariables,
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
        };
        vm.currentStackFrame = vm.stackFrames.push(frame) - 1;
    };

    vm.deleteStackFrame = function() {
        // remove frame
        vm.stackFrames.pop();
//        console.log("deleting frame: " + vm.currentStackFrame);
        // set last as active
        vm.currentStackFrame = vm.currentStackFrame - 1;
//        console.log("current: " + vm.currentStackFrame);
    };

    vm.addFunction = function(name, funct) {
        var startAddress = -1;
        for(var i = 0; i <= funct.instructions.length; i++) {
            var address = vm.addInstruction(funct.instructions[i]);
            if (startAddress == -1) {
                startAddress = address
            }
        }
        vm.table[name] = {startAddress: startAddress, arguments: funct.arguments, localVariables: funct.localVariables}
    };

    vm.lookUpFunction = function(name) {
        if (name in vm.table) {
            return vm.table[name];
        }
        throw new Error ("Function '" + name + "' not found!" );
    };

    vm.addInstruction = function(instruction) {
        return vm.instructions.push(instruction) - 1
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

    vm.allocateArray = function(size) {
        // todo better allocation
        return vm.heap.push({type: 'array', size: size, data: []}) - 1
    };

    vm.interpreter = {};

    vm.interpreter.process = function() {
        while(vm.instructionPointer < vm.instructions.length) {
            var instruction = vm.instructions[vm.instructionPointer].split(" ");
//            console.log("frame "+ vm.currentStackFrame + " #" + vm.currentFrame().instructionPointer + ": " + instruction);
//            console.log(vm.currentFrame().stack);
            if (instruction[0] == 'terminate') {
                break;
            }
//            console.log(vm.stack);
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
                    jump = vm.interpreter.conditionalJumpInstruction(parseInt(instruction[1], 10));
                    break;
                case 'greater_jump':
                    jump = vm.interpreter.greaterJumpInstruction(parseInt(instruction[1], 10));
                    break;
                case 'greater_or_equal_jump':
                    jump = vm.interpreter.greaterOrEqualJumpInstruction(parseInt(instruction[1], 10));
                    break;
                case 'less_jump':
                    jump = vm.interpreter.lessJumpInstruction(parseInt(instruction[1], 10));
                    break;
                case 'less_or_equal_jump':
                    jump = vm.interpreter.lessOrEqualJumpInstruction(parseInt(instruction[1], 10));
                    break;
                case 'equal_jump':
                    jump = vm.interpreter.equalJumpInstruction(parseInt(instruction[1], 10));
                    break;
                case 'jump':
                    vm.interpreter.jumpInstruction(parseInt(instruction[1], 10));
                    jump = true;
                    break;
                case 'invoke':
                    vm.interpreter.invokeInstruction(instruction[1]);
                    jump = true;
                    break;
                case 'return':
                    vm.interpreter.returnInstruction();
                    jump = true;
                    break;
                case 'return_int':
                    vm.interpreter.returnIntInstruction();
                    jump = true;
                    break;
                case 'duplicate':
                    vm.interpreter.duplicateInstruction();
                    break;
                case 'new_array':
                    vm.interpreter.newArrayInstruction(parseInt(instruction[1], 10));
                    break;
                case 'array_store':
                    vm.interpreter.arrayStoreInstruction();
                    break;
                case 'array_load':
                    vm.interpreter.arrayLoadInstruction();
                    break;
                case 'array_length':
                    vm.interpreter.arrayLengthInstruction();
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

    vm.interpreter.conditionalJumpInstruction = function(relativeJump) {
        var condition = vm.currentFrame().stack.pop();
        if (condition != 0) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.greaterJumpInstruction = function(relativeJump) {
        var first = vm.currentFrame().stack.pop();
        var second = vm.currentFrame().stack.pop();
        if (first > second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.greaterOrEqualJumpInstruction = function(relativeJump) {
        var first = vm.currentFrame().stack.pop();
        var second = vm.currentFrame().stack.pop();
        if (first >= second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.lessJumpInstruction = function(relativeJump) {
        var first = vm.currentFrame().stack.pop();
        var second = vm.currentFrame().stack.pop();
        if (first < second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.lessOrEqualJumpInstruction = function(relativeJump) {
        var first = vm.currentFrame().stack.pop();
        var second = vm.currentFrame().stack.pop();
        if (first <= second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.equalJumpInstruction = function(relativeJump) {
        var first = vm.currentFrame().stack.pop();
        var second = vm.currentFrame().stack.pop();
        if (first == second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.jumpInstruction = function(relativeJumpTo) {
        vm.instructionPointer = vm.instructionPointer + relativeJumpTo;
    };

    vm.interpreter.invokeInstruction = function(functionName) {
        var fnc = vm.lookUpFunction(functionName);
        // jump to next instruction
        var returnAddress = vm.instructionPointer + 1;
        // load arguments
        var arguments = [];
        for (var i = 0; i < fnc.arguments; i++) {
            arguments.push(vm.currentFrame().stack.pop())
        }
        vm.createNewStackFrame(returnAddress, arguments);
        vm.instructionPointer = fnc.startAddress;

    };

    vm.interpreter.returnInstruction = function() {
        var returnAddress = vm.currentFrame().returnAddress;
        vm.deleteStackFrame();
        vm.instructionPointer = returnAddress;
    };

    vm.interpreter.returnIntInstruction = function() {
        var value = vm.currentFrame().stack.pop();
        var returnAddress = vm.currentFrame().returnAddress;
        vm.deleteStackFrame();
        vm.instructionPointer = returnAddress;
        vm.currentFrame().stack.push(value)
    };

    vm.interpreter.duplicateInstruction = function() {
        var value = vm.currentFrame().stack.pop();
        vm.currentFrame().stack.push(value);
        vm.currentFrame().stack.push(value);
    };

    vm.interpreter.newArrayInstruction = function(size) {
        var address = vm.allocateArray(size);
        vm.currentFrame().stack.push(address);
    };

    vm.interpreter.arrayStoreInstruction = function() {
        var value = vm.currentFrame().stack.pop();
        var index = vm.currentFrame().stack.pop();
        var address = vm.currentFrame().stack.pop();
        if (! address in vm.heap) {
            throw new Error('Address "' + address + '" not found on heap !');
        }
        var array = vm.heap[address];
        if (array.type != 'array') {
            throw new Error('No array on address "' + address + '"! Heap data: ' + array );
        }
        if (index > array.size || index < 0 ) {
            throw new Error('Array Index Out Of Bounds: requested index  "' + index + '" Array size: ' + array.size );
        }

        array.data[index] = value;
    };

    vm.interpreter.arrayLoadInstruction = function() {
        var index = vm.currentFrame().stack.pop();
        var address = vm.currentFrame().stack.pop();
        if (! address in vm.heap) {
            throw new Error('Address "' + address + '" not found on heap !');
        }
        var array = vm.heap[address];
        if (array.type != 'array') {
            throw new Error('No array on address "' + address + '"! Heap data: ' + array );
        }
        if (index > array.size || index < 0 ) {
            throw new Error('Array Index Out Of Bounds: requested index  "' + index + '" Array size: ' + array.size );
        }

        vm.currentFrame().stack.push(array.data[index]);
    };

    vm.interpreter.arrayLengthInstruction = function() {
        var address = vm.currentFrame().stack.pop();
        if (! address in vm.heap) {
            throw new Error('Address "' + address + '" not found on heap !');
        }
        var array = vm.heap[address];
        if (array.type != 'array') {
            throw new Error('No array on address "' + address + '"! Heap data: ' + array );
        }
        vm.currentFrame().stack.push(array.data.length);
    };

    return vm;
})(undefined);

if (typeof module !== "undefined") {
    module.exports = vm;
}