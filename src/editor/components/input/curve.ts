import { ClassicPreset } from 'rete';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    name: string
}

export class InputCurve extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    inputValue: any

    static ID = 'Input curve'

    constructor(di: DiContainer, data: Data) {
        super('Input curve');
        this.allocation = ['Input'];

        const out = new ClassicPreset.Output(sockets.curve, 'Curve');
        const ctrl = new ClassicPreset.InputControl('text', { initial: data.name, change: di.process });

        this.addOutput('output', out)
        this.addControl('name', ctrl)
    }

    data() {
        return {
            output: this.inputValue
        }
    }

    serialize(): Data {
        return {
            name: (this.controls['name'] as ClassicPreset.InputControl<'text'>).value as string
        }
    }
}
