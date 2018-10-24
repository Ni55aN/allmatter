import Color from './input/color';
import Curve from './input/curve';
import Number from './input/number';
import Texture from './input/texture';

import Brick from './generator/brick';
import Circle from './generator/circle';
import Noise from './generator/noise';

import Add from './math/add';
import Distance from './math/distance';
import Divide from './math/divide';
import Multiply from './math/multiply';
import Pow from './math/pow';
import Subtract from './math/subtract';

import Blend from './texture/blend';
import Blur from './texture/blur';
import Gradient from './texture/gradient';
import Invert from './texture/invert';
import Lightness from './texture/lightness';
import NormalMap from './texture/normal-map';
import Transform from './texture/transform';

import Module from './module/module';

import Output from './output/material';
import Outputcolor from './output/color';
import Outputcurve from './output/curve';
import Outputnumber from './output/number';
import Outputtexture from './output/texture';

export default {
    list : [
        new Number,
        new Texture,
        new Curve,
        new Color,
        new Brick,
        new Circle,
        new Noise,
        new Add,
        new Distance,
        new Divide,
        new Multiply,
        new Pow,
        new Subtract,
        new Blend,
        new Blur,
        new Invert,
        new Lightness,
        new NormalMap,
        new Gradient,
        new Transform,
        new Module,
        new Output,
        new Outputnumber,
        new Outputtexture,
        new Outputcurve,
        new Outputcolor
    ],
    get(name) {
        var comp = this
            .list
            .find(item => item.name.toUpperCase() === name.toUpperCase());

        if (!comp) 
            throw new Error(`Component '${name}' not found`);
        return comp;
    }
};