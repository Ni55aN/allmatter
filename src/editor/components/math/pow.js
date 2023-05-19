import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import modifyMath from '../../common/builders/math';
import sockets from '../../sockets';

export default class ColorComponent extends Component {
    constructor() {
        super('Pow');
        this.allocation = ['Math'];
    }
    
    builder(node) {
        modifyMath(node);

        const inp = new Input('pow', 'Pow', sockets.num);

        const ctrl = new FieldControl(this.editor, 'pow', {type: 'number', value: 2});

        inp.addControl(ctrl);

        return node.addInput(inp);
    }

    // worker(node, inputs) {
    //     var pow = typeof inputs['pow'][0] === 'number'
    //         ? inputs['pow'][0]
    //         : node.data.pow;

    //     outputs['value'] = unaryOperation(inputs, (a) => {
    //         return Math.pow(a, pow);
    //     });
    // }
}