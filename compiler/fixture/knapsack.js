function main() {
    var items = [{w:18, p:114},  {w:42, p:136},  {w:88, p:192},  {w:3, p:223}];       // TODO load from file
    start(items, 4, 100);
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
