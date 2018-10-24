import { Component } from 'rete';
import binaryOperation from '../../common/workers/binary-operation';
import modifyBinaryMath from '../../common/builders/binary-math';

export default class ColorComponent extends Component {
    constructor() {
        super('Distance');
    }
    
    builder(node) {
        modifyBinaryMath(node);

        return node;
    }

    worker(node, inputs, outputs) {
        outputs['value'] = binaryOperation(inputs, 'abs(a - b)');
    }
}