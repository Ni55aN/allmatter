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

import output from './output/material';

export default {
    list : [
        number,
        texture,
        curve,
        color,
        brick,
        circle,
        noise,
        add,
        distance,
        divide,
        multiply,
        pow,
        subtract,
        blend,
        blur,
        invert,
        lightness,
        normalMap,
        gradient,
        transform,
        output
    ],
    getBuilder(name) {
        var comp = this
            .list
            .find(item => item.name === name);

        if (!comp) 
            throw new Error(`Component '${name}' not found`);
        return comp.builder;
    }
};