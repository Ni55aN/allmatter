import { ClassicPreset } from 'rete';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Color from 'color';
import { ColorPicker } from '../../controls/color-picker'
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';


type Data = {
    name: string
    defaultColor: string
}

export class InputColor extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 280

    inputValue: any

    static ID = 'Input color'

    constructor(di: DiContainer, data: Data) {
        super('Input color');
        this.allocation = ['Input'];

        const out = new ClassicPreset.Output(sockets.color, 'Color');
        const ctrl = new ClassicPreset.InputControl('text', { initial: data.name })
        const ctrl2 = new ColorPicker(data.defaultColor, di.process);

        this.addOutput('output', out)
        this.addControl('name', ctrl)
        this.addControl('color', ctrl2);
    }

    data() {
        const color = new Color((this.controls['color'] as ColorPicker).value)

        return {
            output: this.inputValue || color
        }
    }

    serialize(): Data {
        return {
            name: (this.controls['name'] as ClassicPreset.InputControl<'text'>).value as string,
            defaultColor: (this.controls['color'] as ColorPicker).value
        }
    }
}
