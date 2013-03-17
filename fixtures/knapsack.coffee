size = 5;
items = [[1, 2], [3, 2], [1, 4]];
bestPrice = 0;
bestSolution = [];
i = 0;
itemsWeight = (i) -> {
  if i.length > 0 {
    helper = i.map: (x) -> x<1>;
    helper.reduce: (x, y) -> x + y
  } else {
    0;
  }
};
itemsPrice = (i) -> {
  if i.length > 0 {
    helper = i.map: (x) -> x<0>;
    helper.reduce: (x, y) -> x + y
  } else {
    0;
  }
};


addToKnapsack = (used, unused, bestPrice) -> {
  if unused.length > 0 {
    totalWeight = itemsWeight used;

    if totalWeight < size {
      currentPrice = itemsPrice used;

      if currentPrice > bestPrice {
        bestPrice = currentPrice;
      }

      item = unused.pop:;
      used.push: item;

      addToKnapsack used, unused, bestPrice;
    } else {
      bestPrice;
    }
  } else {
    bestPrice;
  }
}

addToKnapsack [], items, 0
