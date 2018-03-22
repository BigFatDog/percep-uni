import sampleColorSpace from './sample-colorspace';

const selectColorSpace = _selector => {
  // Sample the color space (for monitoring)
  const colorSamples = sampleColorSpace();

  return colorSamples.filter(d => _selector(d) === true).map(e => e.color);
};

export default selectColorSpace;
