var fs = require("fs");
var vm = (function(undefined) {
    var vm = {};

    vm.start = function() {
        vm.stackFrames = [];
        vm.currentStackFrame = 0;
        vm.maximumStackFrames = 50;
        vm.instructions = [];
        vm.instructionPointer = 0;
        vm.table = [];
        vm.tableNative = [];
        vm.heap = []; //vm.initializeHeap();
        vm.createNewStackFrame(null, []);
        vm._output = [];
        vm.addNativeArrayFunctions();
    };

    vm.load = function(file) {
        vm.start();
        var dataJSON = require(file);
        //console.log(dataJSON);
        for(var i = 0; i < dataJSON.length; i++) {
            vm.addFunction(dataJSON[i])
        }

        var startInstruction = vm.addInstruction("invoke main");
        vm.addInstruction("terminate");
        vm.instructionPointer = startInstruction;
        for (i = 0; i < vm.instructions.length; i++) {
            console.log("#" + i + ": " + vm.instructions[i]);
        }
        vm.interpreter.process();
    };

    vm.currentFrame = function() {
        return vm.stackFrames[vm.currentStackFrame];
    };

    vm.createNewStackFrame = function(returnAddress, arguments, constantPool) {
        if (vm.stackFrames.length + 1 > vm.maximumStackFrames) {
            throw new Error("StackOverflow, max stack frames level reached: " + this.maximumStackFrames);
        }
        var localVariables = [];
        var len = arguments.length;
        for (var i = 0; i < len; i++) {
            localVariables.push(arguments.pop())
        }

        var constPool = constantPool || [];

        var frame = {
            returnAddress: returnAddress,
            localVariables: localVariables,
            constantPool: constPool,
            stack: {
                _data: [],
                size: 0,
                maxStackSize: 1024,
                push: function(val) {
                    this.size++;
                    if (this.size > this.maxStackSize) {
                        throw new Error("StackOverflow, max stack level reached: " + this.maxStackSize);
                    }
                    if (val == undefined) {
                        throw new Error("Trying to push undefined to stack!");
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

    vm.addNativeFunction = function(funct) {
        vm.tableNative[funct.name] = {
            fn: funct.fn,
            arguments: funct.arguments
        }
    };

    vm.addFunction = function(funct) {
        var startAddress = -1;
        for(var i = 0; i < funct.instructions.length; i++) {
            var address = vm.addInstruction(funct.instructions[i]);
            if (startAddress == -1) {
                startAddress = address
            }
        }
        vm.table[funct.name] = {
            startAddress: startAddress,
            arguments: funct.arguments,
            localVariables: funct.localVariables,
            constantPool: funct.constantPool}
    };

    vm.lookUpFunction = function(name) {
        if (name in vm.table) {
            return vm.table[name];
        }
        throw new Error ("Function '" + name + "' not found!" );
    };

    vm.lookUpNativeFunction = function(obj, name) {
        var fullName = obj+"."+name;
        if (fullName in vm.tableNative) {
            return vm.tableNative[fullName];
        }
        throw new Error ("Native Function '" + fullName + "' not found!");
    };

    vm.addNativeArrayFunctions = function() {
        vm.addNativeFunction({
            name: "array.length",
            fn: function(array) {
                vm.currentFrame().stack.push(array.data.length);
            },
            arguments: 1
        });
        vm.addNativeFunction({
            name: "array.pop",
            fn: function(array) {
                vm.currentFrame().stack.push(array.data.pop());
            },
            arguments: 1
        });
        vm.addNativeFunction({
            name: "array.push",
            fn: function(array, value) {
                array.data.push(value)
            },
            arguments: 2
        });
        vm.addNativeFunction({
            name: "array.shift",
            fn: function(array) {
                vm.currentFrame().stack.push(array.data.shift())
            },
            arguments: 1
        });
        vm.addNativeFunction({
            name: "array.slice",
            fn: function(array) {
                var address = vm.allocateArray();
                // copy data
                var arrayObject = vm.retrieveArray(address);
                arrayObject.data = array.data.slice();
                vm.currentFrame().stack.push(address);
            },
            arguments: 1
        });
        vm.addNativeFunction({
            name: "file.read_line",
            fn: function(file) {
                // simplified :)
                var data = fs.readFileSync(file.fileName, "utf-8").split("\n");
                if (data.length > file.currentLine) {
                    var line = data[file.currentLine];
                    file.currentLine++;
                    var lineAddress = vm.allocateString(line);
                    vm.currentFrame().stack.push(lineAddress)
                } else {
                    throw new Error("Unexpected EOF in file " + file.fileName + ", line: " + file.currentLine)
                }

            },
            arguments: 1
        });
        vm.addNativeFunction({
            name: "file.close",
            fn: function(file) {
                // todo ??
            },
            arguments: 1
        });
        vm.addNativeFunction({
            name: "file.write",
            fn: function(file, content) {
                //dereference string
                // TODO pointer?!?
                var data = content;
                if (vm.isPointer(content)) {
                     data = vm.retrieveHeapObject(content).data;
                }
                fs.writeFileSync(file.fileName, data, "utf-8")
            },
            arguments: 2
        });
    };

    vm.isPointer = function (address) {
        return typeof address == 'string' && address.indexOf("p") === 0;
    };

    vm.retrieveHeapObject = function(address) {
        if (!vm.isPointer(address)) {
            throw new Error('Address "' + address + '" is not a pointer !');
        }
        address = address.replace('p', '');

        if (! address in vm.heap) {
            throw new Error('Address "' + address + '" not found on heap !');
        }
        return vm.heap[address];
    };

    vm.retrieveArray = function(arrayAddress) {
        var array = vm.retrieveHeapObject(arrayAddress);
        if (array.type != 'array') {
            throw new Error('No array on address "' + arrayAddress + '"! Heap data: ' + array );
        }
        return array;
    };

    vm.retrieveString = function(stringAddress) {
        var string = vm.retrieveHeapObject(stringAddress);
        if (string.type != 'string') {
            throw new Error('No string on address "' + stringAddress + '"! Heap data: ' + string );
        }
        return string;
    };

    vm.addInstruction = function(instruction) {
        return vm.instructions.push(instruction) - 1
    };

    vm.setConstantPool = function(constants) {
        vm.currentFrame().constantPool = constants
    };

    vm.getConstantValue = function(index) {
        if (index.indexOf('#') !== 0) {
            throw Error("Getting constant value error: Index [" + index + "] is not starting with '#'!");
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
        var address = vm.heap.push({type: 'array', data: []}) - 1;
        address = "p" + address;
        return address;
    };

    vm.allocateString = function(string) {
        // todo better allocation
        string = string.replace(/^'|'$/gm, '');
        var address =  vm.heap.push({type: 'string', data: string}) - 1;
        address = "p" + address;
        return address;
    };

    vm.allocateFile = function(fileName) {
        // todo better allocation
        var address =  vm.heap.push({type: 'file', fileName: fileName, currentLine: 0}) - 1;
        address = "p" + address;
        return address;
    };

    vm.allocateObject = function() {
        // todo better allocation
        var address = vm.heap.push({type: 'object', data: []}) - 1;
        address = "p" + address;
        return address;
    };

    vm.interpreter = {};

    vm.interpreter.process = function() {
        while(vm.instructionPointer < vm.instructions.length) {
            var instruction = vm.instructions[vm.instructionPointer].replace(/\s+/, '\x01').split('\x01');
           // console.log(Array(vm.currentStackFrame*4).join(" ") + "frame " + vm.currentStackFrame + " #" + vm.instructionPointer + ": " + instruction);
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
                case 'times':
                    vm.interpreter.timesInstruction();
                    break;
                case 'compare':
                    vm.interpreter.equalInstruction();
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

                case 'greater':
                    jump = vm.interpreter.greaterInstruction();
                    break;
                case 'greater_or_equal':
                    jump = vm.interpreter.greaterOrEqualInstruction();
                    break;
                case 'less':
                    jump = vm.interpreter.lessInstruction();
                    break;
                case 'less_or_equal':
                    jump = vm.interpreter.lessOrEqualInstruction();
                    break;
                case 'equal':
                    jump = vm.interpreter.equalInstruction();
                    break;
                case 'jump':
                    vm.interpreter.jumpInstruction(parseInt(instruction[1], 10));
                    jump = true;
                    break;
                case 'invoke':
                    vm.interpreter.invokeInstruction(instruction[1]);
                    jump = true;
                    break;
                case 'invoke_native':
                    vm.interpreter.invokeNativeInstruction(instruction[1]);
                    break;
                case 'return':
                    vm.interpreter.returnInstruction();
                    jump = true;
                    break;
                case 'return_value':
                    vm.interpreter.returnValueInstruction();
                    jump = true;
                    break;
                case 'duplicate':
                    vm.interpreter.duplicateInstruction();
                    break;
                case 'negate':
                    vm.interpreter.negateInstruction();
                    break;
                case 'new_array':
                    vm.interpreter.newArrayInstruction(parseInt(instruction[1], 10));
                    break;
                case 'new_string':
                    vm.interpreter.newStringInstruction(instruction[1]);
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
                case 'new_object':
                    vm.interpreter.newObjectInstruction();
                    break;
                case 'object_store':
                    vm.interpreter.objectStoreInstruction(instruction[1]);
                    break;
                case 'object_load':
                    vm.interpreter.objectLoadInstruction(instruction[1]);
                    break;
                case 'built_in':
                    vm.interpreter.builtInInstruction(parseInt(instruction[1], 10));
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
        var val = vm.currentFrame().localVariables[localVariableIndex];
        vm.currentFrame().stack.push(val)
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

    vm.interpreter.timesInstruction = function() {
        var val1 = vm.currentFrame().stack.pop();
        var val2 = vm.currentFrame().stack.pop();
        vm.currentFrame().stack.push(val1 * val2)
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
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first > second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.greaterOrEqualJumpInstruction = function(relativeJump) {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first >= second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.lessJumpInstruction = function(relativeJump) {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first < second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.lessOrEqualJumpInstruction = function(relativeJump) {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first <= second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.equalJumpInstruction = function(relativeJump) {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first == second) {
            vm.instructionPointer = vm.instructionPointer + relativeJump;
            return true
        }
        return false
    };

    vm.interpreter.greaterInstruction = function() {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first > second) {
            vm.currentFrame().stack.push(1);
        } else {
            vm.currentFrame().stack.push(0);
        }
    };

    vm.interpreter.greaterOrEqualInstruction = function() {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first >= second) {
            vm.currentFrame().stack.push(1);
        } else {
            vm.currentFrame().stack.push(0);
        }
    };

    vm.interpreter.lessInstruction = function() {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first < second) {
            vm.currentFrame().stack.push(1);
        } else {
            vm.currentFrame().stack.push(0);
        }
    };

    vm.interpreter.lessOrEqualInstruction = function() {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first <= second) {
            vm.currentFrame().stack.push(1);
        } else {
            vm.currentFrame().stack.push(0);
        }
    };

    vm.interpreter.equalInstruction = function() {
        var second = vm.currentFrame().stack.pop();
        var first = vm.currentFrame().stack.pop();
        if (first == second) {
            vm.currentFrame().stack.push(1);
        } else {
            vm.currentFrame().stack.push(0);
        }
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
        vm.createNewStackFrame(returnAddress, arguments, fnc.constantPool);
        vm.instructionPointer = fnc.startAddress;

    };

    vm.interpreter.invokeNativeInstruction = function(functionName) {
        // jump to next instruction
        var nativeAddress = vm.currentFrame().stack.pop();
        var heapObject = vm.retrieveHeapObject(nativeAddress);

        var fnc = vm.lookUpNativeFunction(heapObject.type, functionName);
        // load arguments
        var arguments = [heapObject];
        for (var i = 1; i < fnc.arguments; i++) {
            arguments.push(vm.currentFrame().stack.pop())
        }


        fnc.fn.apply(undefined, arguments);
    };

    vm.interpreter.returnInstruction = function() {
        var returnAddress = vm.currentFrame().returnAddress;
        vm.deleteStackFrame();
        vm.instructionPointer = returnAddress;
    };

    vm.interpreter.returnValueInstruction = function() {
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

    vm.interpreter.negateInstruction = function() {
        var value = vm.currentFrame().stack.pop();
        if (value == 0) {
            vm.currentFrame().stack.push(1);
        } else {
            vm.currentFrame().stack.push(0);
        }
    };

    vm.interpreter.newArrayInstruction = function(size) {
        var address = vm.allocateArray(size);
        vm.currentFrame().stack.push(address);
    };

    vm.interpreter.newStringInstruction = function(string) {
        var address = vm.allocateString(string);
        vm.currentFrame().stack.push(address);
    };

    vm.interpreter.arrayStoreInstruction = function() {
        var value = vm.currentFrame().stack.pop();
        var index = vm.currentFrame().stack.pop();
        var address = vm.currentFrame().stack.pop();
        var array = vm.retrieveArray(address);
        if (index > array.size || index < 0 ) {
            throw new Error('Array Index Out Of Bounds: requested index  "' + index + '" Array size: ' + array.size );
        }

        array.data[index] = value;
    };

    vm.interpreter.arrayLoadInstruction = function() {
        var index = vm.currentFrame().stack.pop();
        var address = vm.currentFrame().stack.pop();
        var array = vm.retrieveArray(address);
        if (index > array.size || index < 0 ) {
            throw new Error('Array Index Out Of Bounds: requested index  "' + index + '" Array size: ' + array.size );
        }

        vm.currentFrame().stack.push(array.data[index]);
    };

    vm.interpreter.arrayLengthInstruction = function() {
        var address = vm.currentFrame().stack.pop();
        var array = vm.retrieveArray(address);
        vm.currentFrame().stack.push(array.data.length);
    };

    vm.interpreter.newObjectInstruction = function() {
        var address = vm.allocateObject();
        vm.currentFrame().stack.push(address);
    };

    vm.interpreter.objectStoreInstruction = function(fieldName) {
        var address = vm.currentFrame().stack.pop();
        var value = vm.currentFrame().stack.pop();
        var object = vm.retrieveHeapObject(address);
        if (object.type != 'object') {
            throw new Error('No object on address "' + object + '"! Heap data: ' + object );
        }

        var index = 0;
        var last;
        if (object.data[index] != null) {
            while(true) {
                last = index;
                if (object.data[index].name == fieldName) {
                    break;
                }
                index = object.data[index].next;
                if (index == null) {
                    break;
                }
            }
        }
        if ((index == 0 && last == null) || index == null) {
            // not found, add new field
            var dataObj = {name: fieldName, value: value, next: null};
            var nextAddress = object.data.push(dataObj) - 1;
            if (last != null) {
                // assign to last as next
                object.data[last].next = nextAddress;
            }
        } else {
            // found

            object.data[index].value = value;
        }

    };

    vm.interpreter.objectLoadInstruction = function(fieldName) {
        if (vm.currentFrame().stack.length == 0) {
            throw new Error('Empty stack, object address expected!');
        }
        var address = vm.currentFrame().stack.pop();
        var object = vm.retrieveHeapObject(address);
        if (object.type != 'object') {
            throw new Error('No object on address "' + object + '"! Heap data: ' + object );
        }

        var index = 0;
        var last;
        var debugFields = [];
        if (object.data[index] == null) {
                throw new Error("Field '" + fieldName + "' not found.  No fields defined");
        }
        while(true) {
            last = index;
            if (object.data[index].name == fieldName) {
                vm.currentFrame().stack.push(object.data[index].value);
                break;
            }
            debugFields.push(object.data[index].name);
            index = object.data[index].next;
            if (index == null) {
                // not found
                throw new Error("Field '" + fieldName + "' not found. Defined fields: " + debugFields);
            }
        }

    };

    vm.interpreter.builtInInstruction = function(index) {
        switch (index) {
            case 0:
                var output = vm.currentFrame().stack.pop();
                if (vm.isPointer(output)) {
                    var data = vm.retrieveHeapObject(output).data;
                    vm._output.push(data);
                    console.log("out: " + data)
                } else {
                    vm._output.push(output);
                    console.log("out: " +output)
                }
                break;
            case 1:
                var fileNameAddress = vm.currentFrame().stack.pop();
                var fileName = vm.retrieveString(fileNameAddress);
                // open file, allocate file
                var fileAddress = vm.allocateFile(fileName.data);
                vm.currentFrame().stack.push(fileAddress);
                break;

            case 3:
                var stringAddress = vm.currentFrame().stack.pop();
                var string = vm.retrieveString(stringAddress);

                // open file, allocate file
                var integer = parseInt(string.data, 10);
                vm.currentFrame().stack.push(integer);
                break;
            default:
                throw new Error("No built-in function on index [" + index + "]!")

        }
    };

    return vm;
})(undefined);

if (typeof module !== "undefined") {
    module.exports = vm;
}