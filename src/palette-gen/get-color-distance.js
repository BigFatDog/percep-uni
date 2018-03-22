import simulate from './simulate';

// http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
const _cmcDistance = (lab1, lab2, l, c) => {
  const L1 = lab1[0];
    const L2 = lab2[0];
    const a1 = lab1[1];
    const a2 = lab2[1];
    const b1 = lab1[2];
    const b2 = lab2[2];
    const C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    const C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
    const deltaC = C1 - C2;
    const deltaL = L1 - L2;
    const deltaa = a1 - a2;
    const deltab = b1 - b2;
    const deltaH = Math.sqrt(
    Math.pow(deltaa, 2) + Math.pow(deltab, 2) + Math.pow(deltaC, 2)
  );
  let H1 = Math.atan2(b1, a1) * (180 / Math.PI);
  while (H1 < 0) {
    H1 += 360;
  }
    const F = Math.sqrt(Math.pow(C1, 4) / (Math.pow(C1, 4) + 1900));
    const T =
    164 <= H1 && H1 <= 345
      ? 0.56 + Math.abs(0.2 * Math.cos(H1 + 168))
      : 0.36 + Math.abs(0.4 * Math.cos(H1 + 35));
    const S_L = lab1[0] < 16 ? 0.511 : 0.040975 * L1 / (1 + 0.01765 * L1);
    const S_C = 0.0638 * C1 / (1 + 0.0131 * C1) + 0.638;
    const S_H = S_C * (F * T + 1 - F);
    return Math.sqrt(
    Math.pow(deltaL / (l * S_L), 2) +
      Math.pow(deltaC / (c * S_C), 2) +
      Math.pow(deltaH / S_H, 2)
  );
};

const _euclidianDistance = (lab1, lab2) => {
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2)
  );
};

const compromiseDistance = (lab1, lab2) => {
  const distances = [];
    const coeffs = [];
  distances.push(_cmcDistance(lab1, lab2, 2, 1));
  coeffs.push(1000);
  const types = ['Protanope', 'Deuteranope', 'Tritanope'];

  for (let type of types) {
      const lab1_cb = simulate(lab1, type);
      const lab2_cb = simulate(lab2, type);
    if (!(lab1_cb.some(isNaN) || lab2_cb.some(isNaN))) {
      let c;
      switch (type) {
        case 'Protanope':
          c = 100;
          break;
        case 'Deuteranope':
          c = 500;
          break;
        case 'Tritanope':
          c = 1;
          break;
      }
      distances.push(_cmcDistance(lab1_cb, lab2_cb, 2, 1));
      coeffs.push(c);
    }
  }

  let total = 0;
  let count = 0;
  distances.forEach((d, i)=> {
    total += coeffs[i] * d;
    count += coeffs[i];
  });
  return total / count;
};

const distanceColorblind = (lab1, lab2, type) => {
    const lab1_cb = simulate(lab1, type);
    const lab2_cb = simulate(lab2, type);
  return _cmcDistance(lab1_cb, lab2_cb, 2, 1);
};

const getColorDistance = (lab1, lab2, _type = 'Default') => {
  switch (_type) {
    case 'Default':
      return _euclidianDistance(lab1, lab2);
    case 'Euclidian':
      return _euclidianDistance(lab1, lab2);
    case 'CMC':
      return _cmcDistance(lab1, lab2, 2, 1);
    case 'Compromise':
      return compromiseDistance(lab1, lab2);
    default:
      return distanceColorblind(lab1, lab2, _type);
  }
};

export default getColorDistance;
