import Color from '../../../color';
import Utils from '../../utils';

export default async function (inputs, expression) {
    var a = inputs['value1'][0];
    var b = inputs['value2'][0];

    // var sql = Math.sqrt,
    //     abs = Math.abs;

    if (typeof a === 'number' && typeof b === 'number') 
        return eval(expression);
    
    if (a instanceof WebGLTexture && b instanceof WebGLTexture) {
        var result = Utils.createMockCanvas();

        result.blend(a, b, expression);

        return result.toTexture();
    }

    if (a instanceof Color && b instanceof Color) {
        // var c1 = a;
        // var c2 = b;

        var color = new Color();

        [a, b] = [a.r, b.r];
        eval(expression);
        [a, b] = [a.g, b.g];
        eval(expression);
        [a, b] = [a.b, b.b];
        eval(expression);

        return color;
    }

    if (a instanceof WebGLTexture && typeof b === 'number' || ([a, b] = [
        b, a
    ], a instanceof WebGLTexture && typeof b === 'number')) {

        var result = Utils.createMockCanvas();

        result.blend(a, b, expression);

        return result.toTexture();
    }

    if (a instanceof WebGLTexture && b instanceof Color || ([a, b] = [
        b, a
    ], a instanceof WebGLTexture && b instanceof Color)) {

        var result = Utils.createMockCanvas();

        result.blend(a, b.toArray(), expression);

        return result.toTexture();
    }

    // if (typeof a === 'number' && b instanceof Color || ([a, b] = [
    //     b, a
    // ], typeof a === 'number' && b instanceof Color)) {

    //     var color = new Color(f(b.r, a), f(b.g, a), f(b.b, a));

    //     return color;
    // }
}