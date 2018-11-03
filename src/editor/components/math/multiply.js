import BinaryMathComponent from '../../common/workers/binary-operation';

export default class ColorComponent extends BinaryMathComponent {
    constructor() {
        super('Multiply');
        this.allocation = ['Math'];
    }
    
    builder(node) {
        super.builder(node);
        
        return node;
    }

    worker(node, inputs, outputs) {
        outputs['value'] = super.calculate(inputs, 'a * b');
    }
}