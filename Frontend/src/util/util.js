export function transform(priceList) {
    let min = Math.min(...priceList);
    let max = Math.max(...priceList);
    let normalizedList = [];
    for(let i = 0; i < priceList.length; i++) {
      normalizedList.push((priceList[i] - min) / (max - min));
    }
    return normalizedList;
}

export function inverse_transform(priceList, min, max) {
    let inversedList = [];
    for(let i = 0; i < priceList.length; i++) {
      inversedList.push(priceList[i] * (max - min) + min);
    }
    return inversedList;
}