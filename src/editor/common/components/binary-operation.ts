import { ClassicPreset } from 'rete';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Color from 'color';
import Utils from '../../utils'
import sockets from '../../sockets'

export default class BinaryMathComponent extends ClassicPreset.Node {

    constructor(label: string) {
        super(label)

        const inp1 = new ClassicPreset.Input(sockets.value, 'Value');
        const inp2 = new ClassicPreset.Input(sockets.value, 'Value');
        const out = new ClassicPreset.Output(sockets.value, 'Value');

        this.addInput('value1', inp1)
        this.addInput('value2', inp2)
        this.addOutput('value', out)
    }

    getFunction(expression: any) {
        const f = new Function('sqrt, abs, a, b', 'return ' + expression);

        return f.bind(null, Math.sqrt, Math.abs);
    }

    order(a: any, b: any) {
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

    calculate(inputs: any, expression: any) {
        const [a, b] = this.order(inputs['value1'] && inputs['value1'][0], inputs['value2'] && inputs['value2'][0]);
        const f = this.getFunction(expression);

        if (typeof a === 'number')
            return f(a, b);

        if (a instanceof Color)
            return new Color(f(a.r, b), f(a.g, b), f(a.b, b));

        if (a instanceof WebGLTexture) {
            const result = Utils.createMockCanvas();
            const value = b instanceof Color ? b.array().map((v: number) => v / 255) : b;

            result.blend(a, value, expression);

            return result.toTexture();
        }
    }
}
