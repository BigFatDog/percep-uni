import chroma from 'chroma-js';
import { validateLab } from './palette-gen';

const lstep = 3;
const astep = 8;
const bstep = 8;

const sampleColorSpace = () => {
  console.log('Initializing color sampling...');
  let colorSamples = [];
  let colorsIndex = {};

  const sampleColor = lab => {
    // Test if color exists in lab space
    if (validateLab(lab)) {
      let color = chroma.lab(lab);
      // Test if the color does not exist already (there are weird boundaries to the CIE Labs space)
      if (colorsIndex[color.hex()]) {
        // Color already exists
      } else {
        colorSamples.push({
          color: color,
          hex: color.hex(),
          lab: color.lab(),
          hcl: color.hcl(),
          rgb: color.rgb(),
        });
        colorsIndex[color.hex()] = true;
      }
    }
  };

  for (let l = 0; l <= 100; l += lstep) {
    for (let a = 0; a <= 100; a += astep) {
      for (let b = 0; b <= 100; b += bstep) {
        sampleColor([l, +a, +b]);
        sampleColor([l, -a, +b]);
        sampleColor([l, +a, -b]);
        sampleColor([l, -a, -b]);
      }
    }
  }

  console.log('...done');

  return colorSamples;
};

export default sampleColorSpace;
