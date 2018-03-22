import { reducePresetToHCLPalette, getSubColorSpace, hclSelector, IceCube } from '../src';
import { strictEqual, ok } from 'assert';

describe('Color Precision', () => {
  it('Ice Cube sub colorspace', () => {
      const palette = reducePresetToHCLPalette(6, IceCube);
      strictEqual(palette.length, 6);
      const sub = getSubColorSpace(palette, c=> hclSelector(IceCube, c.hcl));

      const subKeys = Object.keys(sub);
      strictEqual(subKeys.length, 6);

      for (let d of subKeys) {
          ok(Array.isArray(sub[d]));
      }
  });
});
