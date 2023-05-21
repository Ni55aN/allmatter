import { ClassicPreset } from 'rete';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';

type Data = {
    name: string
}

export class OutputTexture extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    static ID = 'Output texture'

    constructor(data: Data) {
        super('Output texture')
        this.allocation = ['Output'];

        const inp = new ClassicPreset.Input(sockets.image, 'Texture');
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
