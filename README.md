# percep-uni *Perceptual Uniformity*

Generate and refine perceptual uniform colors. This library can be used in browser as well as on node server.

## Samples

### Stackoverflow network. [<>](https://github.com/BigFatDog/percep-uni/blob/master/demo/stack-overflow.html "Source")
5 distinct colors are generated from ``Purple`` preset. For each distinct color, sub colorspace has been generated containing 20 colors. 
Each topic node is rendered with a color from sub-colorspace

<img alt="Stackoverflow" height="300" src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/stackoverflow.png"/>

### A network of colors of [猪熊佳子 KEIKO INOKUMA](https://twitter.com/inokeko1) 's painting. [<>](https://github.com/BigFatDog/percep-uni/blob/master/demo/keiko.html "Source")
<img alt="Sining in the forest" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/singing-in-the-forset.jpg"/> <img alt="force layout of keiko" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/keiko.png" />

### Force Layout [<>](https://github.com/BigFatDog/percep-uni/blob/master/demo/force-layout.html "Source")
A force layout (Force Atlas 2 is used) of 10 colors as well as sub colorspaces. 

<img alt="Force Layout" height="300" src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/force-atlas-2.png"/>

### select colors with a preset and hcl selector [<>](https://github.com/BigFatDog/percep-uni/blob/master/demo/colorspace-select.html "Source")

<img alt="HCL selector" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/hcl-selector.png"/>

### sort sub colorspace by hue and display as rect tiles. [<>](https://github.com/BigFatDog/percep-uni/blob/master/demo/color-rects.html "Source")
<img alt="Color Tiles" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/color-rects.png" />


## Tutorials and Concepts
Please visit [IWantHue](http://tools.medialab.sciences-po.fr/iwanthue/)'s website for tutorial and concepts

## Installation

1. Install

```
npm install percep-uni --save
```

2. ES6 Usage

```
import { generateColorPalette } from 'percep-uni';

```

## Development
1. Clone repository
2. Run commands
```
npm install         // install dependencies
npm run dev         // view demos in web browser at localhost:3005
npm run build       // build
npm run test        // run tests only
npm run test:cover  // run tests and view coverage report
```
## Typical Usage with Comments
```javascript
import {
  reducePresetToHCLPalette,
  getSubColorSpace,
  hclPresetSelector,
  IceCube,
} from 'precep-uni';

const quickHandsOn = () => {
  // use IceCube preset and generate 6 distinct colors
  const palette = reducePresetToHCLPalette(6, IceCube);

  // use a hcl selector to get sub colorspace of the reduced color palette
  const subspaceSamples = getSubColorSpace(palette, c =>
    hclPresetSelector(IceCube, c.hcl)
  );
  /**
     color palette is now:
     { '#62e0d3':
        [ '#49b9b6',
          '#05bcb6',
          '#63c0af'
          ...
          ]
  *
  */

  // sort color palette with prime colorspace
  const primes = Objects.keys(subspaceSamples);

  // sort palette by difference
  const sortedByDiff = sortPalette(
    primes.map(d => chroma.hex(d)),
    'difference'
  );
  // or by hue:
  const sortedByHue = sortPalette(primes.map(d => chroma.hex(d)), 'hue');
};

```

## API

* [reducePresetToHCLPalette](#_reducePresetToHCLPalette)
* [reduceToPalette](#_reduceToPalette)
* [getSubColorSpace](#_getSubColorSpace)
* [selectColorSpace](#_selectColorSpace)
* [sortPalette](#_sortPalette)
* [hclPresetSelector](#_hclSelector)
* [getColorDistance](#_getColorDistance)
* [preset](#_preset)
* [generate](#_generate)


### Generate a color palette

<a name="_reducePresetToHCLPalette" href="#_reducePresetToHCLPalette">#</a> <i>reducePresetToHCLPalette</i>(<i>count, preset, [opt]</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/colorspace/reducer.js "Source")
<br/>
reduces a preset to a color palette with HCL selector. 
This method will grow expensive as count increases. An generated palette is an Array that contains:

```javascript 1.7
{ color: Color { _rgb: [Array] }, // chromajs object
    hex: '#6de2ce',
    hcl: [ 181.09121080324783, 37.506802392206424, 82.85714463619833 ],
    lab: [ 82.85714463619833, -37.50000035557483, -0.7142821710706571 ] },

```

*opt* is an optional parameter, settings are:
```javascript 1.7
const DefaultOpt = {
  quality: 50,
  useFV: false,
  ultraPrecision: false,
  colorblind: false,
};
```

<a name="_reduceToPalette" href="#_reduceToPalette">#</a> <i>reduceToPalette</i>(<i>count, selector, [opt]</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/colorspace/reducer.js "Source")
<br/>
reduces a preset to a color palette

*opt* is an optional parameter, settings are:
```javascript 1.7
const DefaultOpt = {
  quality: 50,
  useFV: false,
  ultraPrecision: false,
  colorblind: false,
};
```

<a name="_getSubColorSpace" href="#_getSubColorSpace">#</a> <i>getSubColorSpace</i>(<i>colors, [selector, distanceType]</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/colorspace/sub-colorspace.js "Source")
<br/>
gets a sub colorspace of a generated color palette. Available distantTypes are:
* 'Default'
* 'Euclidian'
* 'CMC'
* 'Compromise'

<a name="_selectColorSpace" href="#_selectColorSpace">#</a> <i>selectColorSpace</i>(<i>selector</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/colorspace/select.js "Source")
<br/>
sample and select color space with a selector. Due to the nature of sampling, this method returns value differently when called multiple times

<a name="_sortPalette" href="#_sortPalette">#</a> <i>sortPalette</i>(<i>colors, [mode, type]</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/util/sort-palette.js "Source")
Sort color palette. Available modes are:
* 'difference'
* 'hue'
* 'chroma'
* 'lightness'
* 'rgb'

<br/>
the *type* parameter takes effect only when mode is *difference* 
available types are:
* 'Default'
* 'Euclidian'
* 'CMC'
* 'Compromise'

<a name="_hclSelector" href="#_hclSelector">#</a> <i>hclPresetSelector</i>(<i>preset, hcl</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/selector/hcl.js "Source")
<br/>
HCL selector.  

<a name="_getColorDistance" href="#_getColorDistance">#</a> <i>getColorDistance</i>(<i>lab1, lab2, [type]</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/palette-gen/get-color-distance.js "Source")
<br/>
get color distance between *lab1* and *lab2*, *type* could be one of: 
* 'Default'
* 'Euclidian'
* 'CMC'
* 'Compromise'

<a name="_preset" href="#_preset">#</a> <i>presets</i> [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/preset/hcl.js "Source")
HCL presets:
* AllHcl
<img alt="All HCL" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/AllHcl.png"/> 

* DefaultColorSpace
<img alt="Default Color Space" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/DefaultColorSpace.png"/> 

* ColorBlind
<img alt="Color Blind" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/ColorBlind.png"/> 

* FancyLight
<img alt="Fancy Light" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/fancy-light.png"/> 

* FancyDark
<img alt="Fancy Dark" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/fancy-dark.png"/> 

* Tarnish
<img alt="Tarnish" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/Tarnish.png"/> 

* Pastel
<img alt="Pastel" height="300"  src="https://github.com/BigFatDog/BigFatDog.github.io/blob/master/img/precep-uni/preset/Pastel.png"/> 

* Purple
* Intense
* Fluo
* RedRoses
* OchreSand
* IndigoNight
* YellowLime
* GreenMint
* IceCube
* BlueOcean
* PurpleWine

<a name="_generate" href="#_generate">#</a> <i>generate</i>(<i>colorsCount, [config]</i>) [<>](https://github.com/BigFatDog/percep-uni/blob/master/src/palette-gen/generate.js "Source")
<br/>
Generates colors from color space. This is for internal use only for now

*config* is optional, settings are:
```javascript 1.7
  const {
    selector = () => true,
    forceMode = false, // true for force vector, false for kmeans
    quality = 50,
    ultraPrecision = false,
    distanceType = 'Default',
  } = config;
```

# Motivation
When we need to use categorical colors in data visualizations, [ColorBrewer](http://colorbrewer2.org/) are usually used to generate distinct/categorical colors and ensures the even distribution.
But what if we want to get sub color-space from each single color of the categorical color scheme?

It becomes an interesting idea to me as I draw a force graph with sigma.js to represent a network
of employees of a company. Categorical colors are used to represent departments, i.e, groups of people. For each group, a set of sub-colorspace is generated to 
represent employees' other attributes.

This is possible with [IWantHue](http://tools.medialab.sciences-po.fr/iwanthue/). IWantHue is a standalone application but not a library, I studied IWantHue
and made this library: percep-uni. 


ALL core algorithms come from [IWantHue](http://tools.medialab.sciences-po.fr/iwanthue/).
<br/>
Thanks to [medialab](http://tools.medialab.sciences-po.fr) team for creating the fun yet powerful IWantHue

## Credits
- [IWantHue by Medialab](http://tools.medialab.sciences-po.fr/iwanthue/) for the awesome application
- [OxFord InteractiveVis](https://github.com/oxfordinternetinstitute/InteractiveVis) for original twitter and stackoverflow visualizations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details



