


var assert = require("assert");


var knapsack = {
    bestPrice: 0,
    bestSolution: [],
    numberOfItems: 4,
    capacity: 100,
    items: [],

    start: function(items) {
        knapsack.bestPrice = 0;
        knapsack.bestSolution = [];
        knapsack.items = items;
        for (var i = 0; i < knapsack.numberOfItems; i++) {
            //pop first item
            var startWith = knapsack.items.shift();
            knapsack.addToKnapsack(knapsack.capacity, [startWith], knapsack.items.slice(), startWith.w, startWith.p);
            //add item back to end and try pop another
            knapsack.items.push(startWith);
        }
        return knapsack.bestPrice;
    },

    addToKnapsack: function(capacity, usedItems, notUsedItems, currentWeight, currentPrice) {

        if (currentPrice > knapsack.bestPrice) {
            knapsack.bestPrice = currentPrice;
            knapsack.bestSolution = usedItems;
        }

        var maxRestPrice = knapsack.sumPrice(notUsedItems);
        if (currentPrice + maxRestPrice < knapsack.bestPrice) {
            return;
        }
        for(var i = 0; i < notUsedItems.length; i++) {
            var nextAdd = notUsedItems.shift();
            usedItems.push(nextAdd);
            if (currentWeight + nextAdd.w <= capacity) {
                knapsack.addToKnapsack(capacity, usedItems.slice(), notUsedItems.slice(), currentWeight + nextAdd.w, currentPrice + nextAdd.p);
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
    it('should work ', function(){
        assert.equal(knapsack.start([{w:18, p:114},  {w:42, p:136},  {w:88, p:192},  {w:3, p:223}]), 473);
    });

    it('should work ', function(){
        var price = 326;
        var tmp = "55 29 81 64 14 104 52 222".split(" ");
        var items = [];
        for (var i = 0; i < 4;i++) {
            items.push({w:parseInt(tmp[2*i]), p: parseInt(tmp[2*i+1])})
        }
        assert.equal(knapsack.start(items), price);
    });

    it('should work ', function(){
        var price = 196;
        var tmp = "89 196 18 62 57 34 69 112".split(" ");
        var items = [];
        for (var i = 0; i < 4;i++) {
            items.push({w:parseInt(tmp[2*i]), p: parseInt(tmp[2*i+1])})
        }
        assert.equal(knapsack.start(items), price);
    });

    it('should work ', function(){
        var price = 545;
        var tmp = "34 169 23 152 62 44 2 224".split(" ");
        var items = [];
        for (var i = 0; i < 4;i++) {
            items.push({w:parseInt(tmp[2*i]), p: parseInt(tmp[2*i+1])})
        }
        assert.equal(knapsack.start(items), price);
    });

    //
});

