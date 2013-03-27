
size = 100;
"[weight, price]";
items = [[27, 38], [2, 86], [41, 112], [1, 0], [25, 66], [1, 97], [34, 195], [3, 85], [50, 42], [12, 223]];
"best price = 798"

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

