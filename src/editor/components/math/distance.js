import BinaryMathComponent from '../../common/components/binary-operation';

export default class ColorComponent extends BinaryMathComponent {
    constructor() {
        super('Distance');
        this.allocation = ['Math'];
    }
    
    builder(node) {
        super.builder(node);

        return node;
    }

    worker(node, inputs, outputs) {
        outputs['value'] = super.calculate(inputs, 'abs(a - b)');
    }
}