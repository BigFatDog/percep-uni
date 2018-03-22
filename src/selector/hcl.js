/**
 * General condition for selecting the color space
 *
 * @param _schema {
 *      h: [min, max],
 *      c: [min, max],
 *      l: [min, max]
 * }
 * @return sub color space
 */
const withinRange = (min, max, d) => d >= min && d <= max;
const hcondition = (preset, hcl) =>
  withinRange(preset.hmin, preset.hmax, hcl[0]);
const ccondition = (preset, hcl) =>
  withinRange(preset.cmin, preset.cmax, hcl[1]);
const lcondition = (preset, hcl) =>
  withinRange(preset.lmin, preset.lmax, hcl[2]);

const hclSelector = (preset, hcl) =>
  hcondition(preset, hcl) && ccondition(preset, hcl) && lcondition(preset, hcl);

export default hclSelector;
