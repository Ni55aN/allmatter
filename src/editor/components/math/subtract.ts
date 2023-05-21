import { DataflowNode } from 'rete-engine';
import BinaryMathComponent from '../../common/components/binary-operation';

export class Subtract extends BinaryMathComponent implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    static ID = 'subtract'

    constructor() {
        super('Subtract');
        this.allocation = ['Math'];
    }

    data(inputs: any) {
        return {
            value: super.calculate(inputs, 'a - b')
        }
    }

    serialize() {
        return {}
    }
}
