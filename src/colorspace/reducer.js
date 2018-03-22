import hclSelector from '../selector/hcl';
import { generate } from '../palette-gen';

const DefaultOpt = {
    quality: 50,
    useFV: false,
    ultraPrecision: false,
    colorblind: false,
};

const reduceToPalette = (count, selector, _opt = {})=> {
    const opt = Object.assign({}, DefaultOpt, _opt);

    const config = {
        ...opt,
        distanceType: opt.colorblind ? 'Compromise' : 'Default',
        selector,
    };

    delete config['colorblind'];
    // Generate colors
    const colors = generate(count, config);

    return colors.map(color => ({
        color: color,
        hex: color.hex(),
        hcl: color.hcl(),
        lab: color.lab(),
    }));
}

/**
 * preset => selector -> reduce => palette => sub Palette =>
 *
 * @param count
 * @param preset
 * @param _opt
 * @returns {void|*}
 */
const reducePresetToHCLPalette = (count, preset, _opt = {}) => {
    const selector = color => hclSelector(preset, color.hcl());
    return reduceToPalette(count, selector, _opt);
};

export default reduceToPalette;

export {
    reduceToPalette,
    reducePresetToHCLPalette
}
