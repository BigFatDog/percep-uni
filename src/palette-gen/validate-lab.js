const LAB_CONSTANTS = {
  // Corresponds roughly to RGB brighter/darker
  Kn: 18,

  // D65 standard referent
  Xn: 0.95047,
  Yn: 1,
  Zn: 1.08883,

  t0: 0.137931034, // 4 / 29
  t1: 0.206896552, // 6 / 29
  t2: 0.12841855, // 3 * t1 * t1
  t3: 0.008856452, // t1 * t1 * t1
};

const xyz_rgb = r =>
  Math.round(
    255 * (r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055)
  );

const lab_xyz = (labConstants, t) => {
  return t > labConstants.t1
    ? t * t * t
    : labConstants.t2 * (t - labConstants.t0);
};

const validateLab = lab => {
  // Code from Chroma.js 2016

  let l = lab[0];
  let a = lab[1];
  let b = lab[2];

  let y = (l + 16) / 116;
  let x = isNaN(a) ? y : y + a / 500;
  let z = isNaN(b) ? y : y - b / 200;

  y = LAB_CONSTANTS.Yn * lab_xyz(LAB_CONSTANTS, y);
  x = LAB_CONSTANTS.Xn * lab_xyz(LAB_CONSTANTS, x);
  z = LAB_CONSTANTS.Zn * lab_xyz(LAB_CONSTANTS, z);

  let r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z); // D65 -> sRGB
  let g = xyz_rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z);
  b = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
};

export default validateLab;
