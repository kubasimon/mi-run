function main() {
    //var items = [{w:18, p:114},  {w:42, p:136},  {w:88, p:192},  {w:3, p:223}];       // TODO load from file
//    var items = [{w:55, p:29},  {w:81, p:64},  {w:14, p:104},  {w:52, p:222}];       // TODO load from file
//    var items = [{w:89, p:196},  {w:18, p:62},  {w:57, p:34},  {w:69, p:112}];       // TODO load from file
    var inputFile = fs_open_file("compiler/fixture/knapsack.in.1.dat");
    var numberOfItems = parseInt(inputFile.read_line());
    var capacity = parseInt(inputFile.read_line());
    var items2 = [];
    for(var i = 0; i < numberOfItems; i++) {
        var weight = inputFile.read_line();
        var price = inputFile.read_line();
        var obj = {w: parseInt(weight), p: parseInt(price)};
        items2.push(obj)
    }
    inputFile.close();

    //var items = [{w:34, p:169},  {w:23, p:152},  {w:62, p:44},  {w:2, p:224}];       // TODO load from file
    //
    var solution = start(items2, 4, 100);
    var outputFile = fs_open_file("compiler/fixture/knapsack.out.1.dat");
    outputFile.write(solution);
    outputFile.close();
}

function start(items, numberOfItems, capacity) {
    var solution = {
        bestPrice: 0
    };
    for (var i = 0; i < numberOfItems; i++) {
        //pop first item
        var startWith = items.shift();
        var newArray = [];
        newArray.push(startWith);
        var notUsed = items.slice();
        addToKnapsack(capacity, newArray, notUsed, startWith.w, startWith.p, solution);
        //add item back to end and try pop another
        items.push(startWith);
    }
    return solution.bestPrice;
}

function addToKnapsack(capacity, usedItems, notUsedItems, currentWeight, currentPrice, solution) {

    if (currentPrice > solution.bestPrice) {
        solution.bestPrice = currentPrice;
    }

//    optimalization
//    var maxRestPrice = sumPrice(notUsedItems);
//    if (currentPrice + maxRestPrice < solution.bestPrice) {
//        return;
//    }
    var len = notUsedItems.length();
    for(var i = 0; i < len; i++) {
        var nextAdd = notUsedItems.shift();
        usedItems.push(nextAdd);
        if (currentWeight + nextAdd.w <= capacity) {
            addToKnapsack(capacity, usedItems.slice(), notUsedItems.slice(), currentWeight + nextAdd.w, currentPrice + nextAdd.p, solution);
        }
        usedItems.pop();
    }
}

function sumPrice(items) {
    var lenArray = items.slice();
    var tmp = 0;
    for (var i = 0; i < items.length(); i++) {
        tmp += lenArray.pop()
    }
    return tmp;
}
