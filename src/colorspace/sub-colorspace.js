import { getColorDistance } from '../palette-gen';
import selectColorSpace from './select';

const getSubColorSpace = (
  colors,
  _selector = ()=> true,
  distanceType = 'Default'
) => {
  const subspaceSamples = selectColorSpace(_selector);

  const matchings = colors.reduce((match, d) => {
    match[d.hex] = [];
    return match;
  }, {});

  for (const color of subspaceSamples) {
    const lab = color.lab();
    let bestMatch;
    let minDistance = Infinity;

    for (let matchingCandidate of colors) {
      let lab2 = matchingCandidate.lab;

      let distance = getColorDistance(lab, lab2, distanceType);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = matchingCandidate;
      }
    }

    matchings[bestMatch.hex].push(color.hex());
  }

  return matchings;
};

export default getSubColorSpace;
