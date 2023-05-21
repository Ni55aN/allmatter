import { ClassicPreset } from 'rete';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';

type Data = {
    name: string
}

export class OutputColor extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 120

    static ID = 'Output color'

    constructor(data: Data) {
        super('Output color');
        this.allocation = ['Output'];

        const inp = new ClassicPreset.Input(sockets.color, 'Color');
        const ctrl = new ClassicPreset.InputControl('text', { initial: data.name });

        this.addInput('input', inp)
        this.addControl('name', ctrl)
    }

    data(inputs: any) {
        return {
            value: inputs['input'][0]
        }
    }

    serialize(): Data {
        return {
            name: (this.controls['name'] as ClassicPreset.InputControl<'text'>).value as string
        }
    }
}
