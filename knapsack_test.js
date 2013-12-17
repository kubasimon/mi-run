


var assert = require("assert");


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

    addToKnapsack: function(capacity, usedItems, notUsedItems, currentWeight, currentPrice, solution) {

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
                knapsack.addToKnapsack(capacity, usedItems.slice(), notUsedItems.slice(), currentWeight + nextAdd.w, currentPrice + nextAdd.p, solution);
            }
            usedItems.pop();
        }
    },

    sumPrice: function (items) {
        var tmp = 0;
        for (var i = 0; i < items.length; i++) {
            tmp += items[i].p
        }
        return tmp;
    }

};


describe('knapsack', function(){
    it('should work 0', function(){
        assert.equal(knapsack.start([{w:18, p:114},  {w:42, p:136},  {w:88, p:192},  {w:3, p:223}], 4, 100), 473);
    });

    it('should work 1', function(){
        var price = 326;
        var tmp = "55 29 81 64 14 104 52 222".split(" ");
        var items = [];
        for (var i = 0; i < 4;i++) {
            items.push({w:parseInt(tmp[2*i]), p: parseInt(tmp[2*i+1])})
        }
        assert.equal(knapsack.start(items, 4, 100), price);
    });

    it('should work 2', function(){
        var price = 196;
        var tmp = "89 196 18 62 57 34 69 112".split(" ");
        var items = [];
        for (var i = 0; i < 4;i++) {
            items.push({w:parseInt(tmp[2*i]), p: parseInt(tmp[2*i+1])})
        }
        assert.equal(knapsack.start(items, 4, 100), price);
    });

    it('should work 3', function(){
        var price = 545;
        var tmp = "34 169 23 152 62 44 2 224".split(" ");
        var items = [];
        for (var i = 0; i < 4;i++) {
            items.push({w:parseInt(tmp[2*i]), p: parseInt(tmp[2*i+1])})
        }
        assert.equal(knapsack.start(items, 4, 100), price);
    });

    //
});

