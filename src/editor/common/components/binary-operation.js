import { Component, Input, Output } from 'rete';
import Color from 'color';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class BinaryMathComponent extends Component {

    builder(node) {
        const inp1 = new Input('value1', 'Value', sockets.value);
        const inp2 = new Input('value2', 'Value', sockets.value);
        const out = new Output('value', 'Value', sockets.value);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addOutput(out)
    }

    getFunction(expression) {
        const f = new Function('sqrt, abs, a, b', 'return '+expression);

        return f.bind(null, Math.sqrt, Math.abs);
    }

    order(a, b) {
        if (a instanceof WebGLTexture)
            return [a, b]

        if (b instanceof WebGLTexture)
            return [b, a]
        
        if (a instanceof Color)
            return [a, b]
        
        if (b instanceof Color)
            return [b, a]
        
        return [a, b]
    }

    async calculate (inputs, expression) {
        const [a, b] = this.order(inputs['value1'][0], inputs['value2'][0]);
        const f = this.getFunction(expression);

        if (typeof a === 'number')
            return f(a, b);
        
        if (a instanceof Color)
            return new Color(f(a.r, b), f(a.g, b), f(a.b, b));

        if (a instanceof WebGLTexture) {
            const result = Utils.createMockCanvas();
            const value = b instanceof Color ? b.array().map(v => v/255) : b;
    
            result.blend(a, value, expression);
    
            return result.toTexture();
        }
    }
}