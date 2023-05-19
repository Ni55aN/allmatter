import BinaryMathComponent from '../../common/components/binary-operation';

export default class Add extends BinaryMathComponent {
    constructor() {
        super('Add');
        this.allocation = ['Math'];
    }

    builder(node) {
        super.builder(node);

        return node;
    }

    worker(node, inputs, outputs) {
        outputs['value'] = super.calculate(inputs, 'a + b');
    }
}