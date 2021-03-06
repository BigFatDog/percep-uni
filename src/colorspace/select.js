import sampleColorSpace from './sample';

const selectColorSpace = selector => {
  // Sample the color space (for monitoring)
  const colorSamples = sampleColorSpace();

  return colorSamples.filter(d => selector(d) === true).map(e => e.color);
};

export default selectColorSpace;
