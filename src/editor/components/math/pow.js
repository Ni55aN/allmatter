import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('pow', {
    builder() {
        var node = _createMath();

        node.title = 'Pow';

        var inp = new D3NE.Input('Pow', sockets.num);

        var ctrl = numInput('pow', 'Value');

        inp.addControl(ctrl);

        return node.addInput(inp);
    },
    worker(node, inputs, outputs) {
        var pow = typeof inputs[1][0] === 'number'
            ? inputs[1][0]
            : node.data.pow;

        outputs[0] = unaryOperation(inputs, (a) => {
            return Math.pow(a, pow);
        });
    }
});