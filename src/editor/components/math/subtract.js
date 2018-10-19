import { Component } from 'rete';
import modifyBinaryMath from '../../common/builders/binary-math';
import binaryOperation from '../../common/workers/binary-operation';

export default class ColorComponent extends Component {
    constructor() {
        super('Subtract');
    }
    
    builder(node) {
        modifyBinaryMath(node);

        return node;
    }

    worker(node, inputs, outputs) {
        outputs['value'] = binaryOperation(inputs, 'a - b');
    }
};