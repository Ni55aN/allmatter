import number from './input/number';
import texture from './input/texture';
import curve from './input/curve';
import color from './input/color';

import brick from './generator/brick';
import circle from './generator/circle';
import noise from './generator/noise';

import add from './math/add';
import distance from './math/distance';
import divide from './math/divide';
import multiply from './math/multiply';
import pow from './math/pow';
import subtract from './math/subtract';

import blend from './texture/blend';
import blur from './texture/blur';
import invert from './texture/invert';
import lightness from './texture/lightness';
import normalMap from './texture/normal-map';
import gradient from './texture/gradient';
import transform from './texture/transform';

import module from './module/module';

import output from './output/material';
import outputnumber from './output/number';
import outputtexture from './output/texture';
import outputcurve from './output/curve';
import outputcolor from './output/color';

export default {
    list : [
        new number,
        new texture,
        new curve,
        new color,
        new brick,
        new circle,
        new noise,
        new add,
        new distance,
        new divide,
        new multiply,
        new pow,
        new subtract,
        new blend,
        new blur,
        new invert,
        new lightness,
        new normalMap,
        new gradient,
        new transform,
        new module,
        new output,
        new outputnumber,
        new outputtexture,
        new outputcurve,
        new outputcolor
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