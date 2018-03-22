# DOCUMENTATION IS IN CONSTRUCTION


# percep-uni

Perceptual Uniformity. Generate and refine perceptual uniform colors. This library can be used in browser as well as on node server.

# Motivation
When we need to use categorical colors in data visualizations, [ColorBrewer](http://colorbrewer2.org/) helps to generate distinct/categorical colors and ensures the even distribution.
But what if we want to get sub color-space from each single color of the categorical color scheme?

It becomes an interesting idea to me as I draw a force graph with sigma.js or a ribbon chart to represent a network
of employees of a company. Categorical colors are used to represent departments, i.e, groups of people. For each group, a set of sub-colorspace is generated to 
represent employees' salary in a linear scale.

This is possible with [IWantHue](http://tools.medialab.sciences-po.fr/iwanthue/). IWantHue is a standalone application other than a library, I studied IWantHue
and made this library: percep-uni. 

Thanks to [medialab](http://tools.medialab.sciences-po.fr) team for creating the fun yet powerful IWantHue

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

## API
<a name="_generate" href="#_generate">#</a> <i>generate</i>(<i>colorsCount, [config]</i>) [<>](https://github.com/d3/d3-shape/blob/master/src/arc.js#L89 "Source")

## Credits
- [IWantHue by Medialab](http://tools.medialab.sciences-po.fr/iwanthue/) for the awesome application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details



