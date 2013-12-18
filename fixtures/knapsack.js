function main() {
    var items = [];       // TODO load from file
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
        knapsack.addToKnapsack(capacity, newArray, items.slice(), startWith.w, startWith.p, solution);
        //add item back to end and try pop another
        items.push(startWith);
    }
    return solution.bestPrice;
}

function addToKnapsack(capacity, usedItems, notUsedItems, currentWeight, currentPrice, solution) {

    if (currentPrice > solution.bestPrice) {
        solution.bestPrice = currentPrice;
    }

    var maxRestPrice = knapsack.sumPrice(notUsedItems);
    if (currentPrice + maxRestPrice < solution.bestPrice) {
        return;
    }
    for(var i = 0; i < notUsedItems.length; i++) {
        var nextAdd = notUsedItems.shift();
        usedItems.push(nextAdd);
        if (currentWeight + nextAdd.w <= capacity) {
            addToKnapsack(capacity, usedItems.slice(), notUsedItems.slice(), currentWeight + nextAdd.w, currentPrice + nextAdd.p, solution);
        }
        usedItems.pop();
    }
}

var knapsack = {

    start: function(items, numberOfItems, capacity) {
        var solution = {
            bestPrice: 0
        };
        for (var i = 0; i < numberOfItems; i++) {
            //pop first item
            var startWith = items.shift();
            knapsack.addToKnapsack(capacity, [startWith], items.slice(), startWith.w, startWith.p, solution);
            //add item back to end and try pop another
            items.push(startWith);
        }
        return solution.bestPrice;
    },



    sumPrice: function (items) {
        var tmp = 0;
        for (var i = 0; i < items.length; i++) {
            tmp += items[i].p
        }
        return tmp;
    }

};