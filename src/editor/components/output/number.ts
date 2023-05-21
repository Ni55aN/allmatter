import { ClassicPreset } from 'rete';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';

type Data = {
    name: string
}

export class OutputNumber extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    static ID = 'Output number'

    constructor(data: Data) {
        super('Output number');
        this.allocation = ['Output'];

        const inp = new ClassicPreset.Input(sockets.num, 'Number');
        const ctrl = new ClassicPreset.InputControl('text', { initial: data.name });

        this.addControl('name', ctrl)
        this.addInput('input', inp);
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
