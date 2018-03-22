import getColorDistance from './get-color-distance';

const diffSort = (colorsToSort, distanceType) => {
  // Sort
  const diffColors = [colorsToSort.shift()];
  while (colorsToSort.length > 0) {
    let index = -1;
    let maxDistance = -1;
    for (
      let candidate_index = 0;
      candidate_index < colorsToSort.length;
      candidate_index++
    ) {
      let d = Infinity;
      for (let i = 0; i < diffColors.length; i++) {
        let colorA = colorsToSort[candidate_index].lab();
        let colorB = diffColors[i].lab();
        d = getColorDistance(colorA, colorB, distanceType);
      }
      if (d > maxDistance) {
        maxDistance = d;
        index = candidate_index;
      }
    }
    let color = colorsToSort[index];
    diffColors.push(color);
    colorsToSort = colorsToSort.filter((c, i) => i != index);
  }
  return diffColors;
};

export default diffSort;
