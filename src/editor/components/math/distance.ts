import { DataflowNode } from 'rete-engine';
import BinaryMathComponent from '../../common/components/binary-operation';

export class Distance extends BinaryMathComponent implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    static ID = 'distance'

    constructor() {
        super('Distance');
        this.allocation = ['Math'];
    }

    data(inputs: any) {
        return {
            value: super.calculate(inputs, 'abs(a - b)')
        }
    }

    serialize() {
        return {}
    }
}
