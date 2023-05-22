import { ClassicPreset } from 'rete';
// import FieldControl from '../../controls/field';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    name: string
    number: number
}

export class InputNumber extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 160

    inputValue: any

    static ID = 'Input number'

    constructor(di: DiContainer, data: Data) {
        super('Input number');
        this.allocation = ['Input'];

        const out = new ClassicPreset.Output(sockets.num, 'Number');
        const outputControl = new ClassicPreset.InputControl('number', { initial: data.number, change: di.process })
        const nameControl = new ClassicPreset.InputControl('text', { initial: data.name, change: di.process })


        this.addControl('output', outputControl)
        this.addControl('name', nameControl)
        this.addOutput('number', out)
    }

    data() {
        return {
            number: this.inputValue || (this.controls['output'] as ClassicPreset.InputControl<'number'>).value
        }
    }

    serialize(): Data {
        return {
            name: (this.controls['name'] as ClassicPreset.InputControl<'text'>).value as string,
            number: (this.controls['output'] as ClassicPreset.InputControl<'number'>).value as number,
        }
    }
}
