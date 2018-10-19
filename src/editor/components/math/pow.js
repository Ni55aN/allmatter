import { Component, Input } from 'rete';
import sockets from '../../sockets';
import FieldControl from '../../controls/field';
import modifyMath from '../../common/builders/math';

export default class ColorComponent extends Component {
    constructor() {
        super('Pow');
    }
    
    builder(node) {
        modifyMath(node);

        var inp = new Input('pow', 'Pow', sockets.num);

        var ctrl = new FieldControl(this.editor, 'pow', {type: 'number', value: 2});

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
};