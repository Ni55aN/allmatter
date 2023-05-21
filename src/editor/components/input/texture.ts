import { ClassicPreset } from 'rete';
import { DataflowNode } from 'rete-engine';
import { CommonTexture } from '../../common/components/texture'
import { DiContainer } from '../../index';

type Data = {
    name: string
}

export class InputTexture extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 280

    inputValue: any

    static ID = 'Input texture'

    constructor(di: DiContainer, data: Data) {
        super('Input texture', di);
        this.allocation = ['Input'];

        const ctrl = new ClassicPreset.InputControl('text', { initial: data.name })

        this.addControl('name', ctrl)
    }

    data() {
        return {
            image: this.inputValue
        }
    }

    serialize(): Data {
        return {
            name: (this.controls['name'] as ClassicPreset.InputControl<'text'>).value as string
        }
    }
}
