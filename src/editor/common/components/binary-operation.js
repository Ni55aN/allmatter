import { Component, Input } from 'rete';
import Color from 'color';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class BinaryMathComponent extends Component {

    builder(node) {
        const inp1 = new Input('value1', 'Value', sockets.value);
        const inp2 = new Input('value2', 'Value', sockets.value);
        const out = new Input('value', 'Value', sockets.value);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addOutput(out)
    }
    
    async calculate (inputs, expression) {
        let a = inputs['value1'][0];
        let b = inputs['value2'][0];

        // let sql = Math.sqrt,
        //     abs = Math.abs;

        if (typeof a === 'number' && typeof b === 'number') 
            return eval(expression);
        
        if (a instanceof WebGLTexture && b instanceof WebGLTexture) {
            const result = Utils.createMockCanvas();

            result.blend(a, b, expression);

            return result.toTexture();
        }

        if (a instanceof Color && b instanceof Color) {
            // var c1 = a;
            // var c2 = b;

            const color = new Color();

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

            const result = Utils.createMockCanvas();

            result.blend(a, b, expression);

            return result.toTexture();
        }

        if (a instanceof WebGLTexture && b instanceof Color || ([a, b] = [
            b, a
        ], a instanceof WebGLTexture && b instanceof Color)) {

            const result = Utils.createMockCanvas();

            result.blend(a, b.toArray(), expression);

            return result.toTexture();
        }

        if (typeof a === 'number' && b instanceof Color || ([a, b] = [
            b, a
        ], typeof a === 'number' && b instanceof Color)) {

            // const color = new Color(f(b.r, a), f(b.g, a), f(b.b, a));

            // return color;
        }
    }
}