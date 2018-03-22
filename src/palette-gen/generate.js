import chroma from 'chroma-js';
import validateLab from './validate-lab';
import getColorDistance from './get-color-distance';

const range = n => [...Array(n).keys()];

const generate = (colorsCount, config) => {
  const {
    selector = () => true,
    forceMode = false,
    quality = 50,
    ultraPrecision = false,
    distanceType = 'Default',
  } = config;

  console.log(
    'Generate palettes for ' +
      colorsCount +
      ' colors using color distance "' +
      distanceType +
      '"'
  );

  // It will be necessary to check if a Lab color exists in the rgb space.
  const checkLab = lab => {
    let color = chroma.lab(lab[0], lab[1], lab[2]);
    return validateLab(lab) && selector(color);
  };

  const initColorSpace = _num => {
    return range(_num).map(d => {
      let color = [
        100 * Math.random(),
        100 * (2 * Math.random() - 1),
        100 * (2 * Math.random() - 1),
      ];
      while (!checkLab(color)) {
        color = [
          100 * Math.random(),
          100 * (2 * Math.random() - 1),
          100 * (2 * Math.random() - 1),
        ];
      }

      return color;
    });
  };

  if (forceMode) {
    // Force Vector Mod

    // Init
    let vectors = {};

    let colors = initColorSpace(colorsCount);

    // Force vector: repulsion
    let repulsion = 100;
    let speed = 100;
    let steps = quality * 20;
    while (steps-- > 0) {
      // Init
      for (let i = 0; i < colors.length; i++) {
        vectors[i] = { dl: 0, da: 0, db: 0 };
      }
      // Compute Force
      for (let i = 0; i < colors.length; i++) {
        let colorA = colors[i];
        for (let j = 0; j < i; j++) {
          let colorB = colors[j];

          // repulsion force
          let dl = colorA[0] - colorB[0];
          let da = colorA[1] - colorB[1];
          let db = colorA[2] - colorB[2];
          let d = getColorDistance(colorA, colorB, distanceType);
          if (d > 0) {
            let force = repulsion / Math.pow(d, 2);

            vectors[i].dl += dl * force / d;
            vectors[i].da += da * force / d;
            vectors[i].db += db * force / d;

            vectors[j].dl -= dl * force / d;
            vectors[j].da -= da * force / d;
            vectors[j].db -= db * force / d;
          } else {
            // Jitter
            vectors[j].dl += 2 - 4 * Math.random();
            vectors[j].da += 2 - 4 * Math.random();
            vectors[j].db += 2 - 4 * Math.random();
          }
        }
      }
      // Apply Force
      for (let i = 0; i < colors.length; i++) {
        let color = colors[i];
        let displacement =
          speed *
          Math.sqrt(
            Math.pow(vectors[i].dl, 2) +
              Math.pow(vectors[i].da, 2) +
              Math.pow(vectors[i].db, 2)
          );
        if (displacement > 0) {
          let ratio = speed * Math.min(0.1, displacement) / displacement;
          candidateLab = [
            color[0] + vectors[i].dl * ratio,
            color[1] + vectors[i].da * ratio,
            color[2] + vectors[i].db * ratio,
          ];
          if (checkLab(candidateLab)) {
            colors[i] = candidateLab;
          }
        }
      }
    }
    return colors.map(lab => chroma.lab(lab[0], lab[1], lab[2]));
  } else {
    // K-Means Mode
    let kMeans = initColorSpace(colorsCount);

    let colorSamples = [];
    let samplesClosest = [];
    if (ultraPrecision) {
      for (let l = 0; l <= 100; l += 1) {
        for (let a = -100; a <= 100; a += 5) {
          for (let b = -100; b <= 100; b += 5) {
            if (checkLab([l, a, b])) {
              colorSamples.push([l, a, b]);
              samplesClosest.push(null);
            }
          }
        }
      }
    } else {
      for (let l = 0; l <= 100; l += 5) {
        for (let a = -100; a <= 100; a += 10) {
          for (let b = -100; b <= 100; b += 10) {
            if (checkLab([l, a, b])) {
              colorSamples.push([l, a, b]);
              samplesClosest.push(null);
            }
          }
        }
      }
    }

    // Steps
    let steps = quality;
    while (steps-- > 0) {
      // kMeans -> Samples Closest
      for (let i = 0; i < colorSamples.length; i++) {
        let lab = colorSamples[i];
        let minDistance = Infinity;
        for (let j = 0; j < kMeans.length; j++) {
          let kMean = kMeans[j];
          let distance = getColorDistance(lab, kMean, distanceType);
          if (distance < minDistance) {
            minDistance = distance;
            samplesClosest[i] = j;
          }
        }
      }

      // Samples -> kMeans
      let freeColorSamples = colorSamples.slice(0);
      for (let j = 0; j < kMeans.length; j++) {
        let count = 0;
        let candidateKMean = [0, 0, 0];
        for (let i = 0; i < colorSamples.length; i++) {
          if (samplesClosest[i] == j) {
            count++;
            candidateKMean[0] += colorSamples[i][0];
            candidateKMean[1] += colorSamples[i][1];
            candidateKMean[2] += colorSamples[i][2];
          }
        }
        if (count != 0) {
          candidateKMean[0] /= count;
          candidateKMean[1] /= count;
          candidateKMean[2] /= count;
        }

        if (
          count != 0 &&
          checkLab([candidateKMean[0], candidateKMean[1], candidateKMean[2]]) &&
          candidateKMean
        ) {
          kMeans[j] = candidateKMean;
        } else {
          // The candidate kMean is out of the boundaries of the color space, or unfound.
          if (freeColorSamples.length > 0) {
            // We just search for the closest FREE color of the candidate kMean
            let minDistance = Infinity;
            let closest = -1;
            for (let i = 0; i < freeColorSamples.length; i++) {
              let distance = getColorDistance(
                freeColorSamples[i],
                candidateKMean,
                distanceType
              );
              if (distance < minDistance) {
                minDistance = distance;
                closest = i;
              }
            }
            kMeans[j] = colorSamples[closest];
          } else {
            // Then we just search for the closest color of the candidate kMean
            let minDistance = Infinity;
            let closest = -1;
            for (let i = 0; i < colorSamples.length; i++) {
              let distance = getColorDistance(
                colorSamples[i],
                candidateKMean,
                distanceType
              );
              if (distance < minDistance) {
                minDistance = distance;
                closest = i;
              }
            }
            kMeans[j] = colorSamples[closest];
          }
        }
        freeColorSamples = freeColorSamples.filter(
          color =>
            color[0] != kMeans[j][0] ||
            color[1] != kMeans[j][1] ||
            color[2] != kMeans[j][2]
        );
      }
    }
    return kMeans.map(lab => chroma.lab(lab[0], lab[1], lab[2]));
  }
};

export default generate;
