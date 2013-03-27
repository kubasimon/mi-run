
size = 300;
"[weight, price]";
items = [[2, 132], [1, 67], [4, 101], [35, 181], [10, 106], [3, 46], [22, 179], [19, 139], [48, 196], [15, 55], [31, 32], [28, 107], [14, 248], [7, 61], [27, 0], [6, 66], [36, 43], [8, 100], [46, 0], [13, 195], [41, 210], [30, 248], [9, 39], [39, 186], [32, 16]]
"best price = 2427"

bestPrice = 0;
bestSolution = [];
i = 0;
itemsWeight = (i) -> {
  if i.length > 0 {
    helper = i.map: (x) -> x<0>;
    helper.reduce: (x, y) -> x + y
  } else {
    0;
  }
};
itemsPrice = (i) -> {
  if i.length > 0 {
    helper = i.map: (x) -> x<1>;
    helper.reduce: (x, y) -> x + y
  } else {
    0;
  }
};


addToKnapsack = (used, unused, bestPrice) -> {

  if unused.length > 0 {
    currentPrice = itemsPrice used;
    if currentPrice > bestPrice {
      bestPrice = currentPrice;
      dbg bestPrice
    }

    item = unused.shift:;
    used.push: item;

    totalWeight = itemsWeight used;
    if totalWeight < size {
      addToKnapsack used, unused, bestPrice;
    }

    used.pop:;
    bestPrice;
  } else {
    bestPrice;
  }
}


foreach = (len, items, bestPrice) -> {
  if len isnt 0 {
    len = len - 1;
    first = items.shift:;
    itemByValue = items.clone:;
    bestPrice = addToKnapsack [first], itemByValue, bestPrice;
    items.push: first;
    foreach len, items, bestPrice;
  } else {
    bestPrice
  }
}


len = items.length;
foreach len, items, 0;

