import hclSelector from './util/hcl-selector';
import { generate } from './palette-gen';

const DefaultOpt = {
  quality: 50,
  useFV: false,
  ultraPrecision: false,
  colorblind: false,
};

const reduceToPalette = (_count, preset, _opt = {}) => {
  const opt = Object.assign({}, DefaultOpt, _opt);

  const config = {
    ...opt,
    distanceType: opt.colorblind ? 'Compromise' : 'Default',
    selector: color => hclSelector(preset, color.hcl()),
  };

  delete config['colorblind'];
  // Generate colors
  const colors = generate(_count, config);

  return colors.map(color => ({
    color: color,
    hex: color.hex(),
    hcl: color.hcl(),
    lab: color.lab(),
  }));
};

export default reduceToPalette;
