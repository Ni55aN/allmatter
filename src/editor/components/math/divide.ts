import { DataflowNode } from 'rete-engine';
import BinaryMathComponent from '../../common/components/binary-operation';

export class Divide extends BinaryMathComponent implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    static ID = 'divide'

    constructor() {
        super('Divide');
        this.allocation = ['Math'];
    }


    data(inputs: any) {
        return {
            value: super.calculate(inputs, 'a/b')
        }
    }

    serialize() {
        return {}
    }
}
