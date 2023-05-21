import { ClassicPreset } from 'rete';
import sockets from '../../sockets';

type Data = {
    name: string
}

export class OutputCurve extends ClassicPreset.Node {
    allocation: string[]
    width = 180
    height = 180

    outputValue: any

    static ID = 'Output curve'

    constructor(data: Data) {
        super('Output curve')
        this.allocation = ['Output'];

        const inp = new ClassicPreset.Input(sockets.curve, 'Curve');
        const ctrl = new ClassicPreset.InputControl('text', { initial: data.name });

        this.addInput('input', inp)
        this.addControl('name', ctrl);
    }

    data(inputs: any) {
        return {
            value: inputs['input']
        }
    }

    serialize(): Data {
        return {
            name: (this.controls['name'] as ClassicPreset.InputControl<'text'>).value as string
        }
    }
}
