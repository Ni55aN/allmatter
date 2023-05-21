import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture'
import Utils from '../../utils';
import sockets from '../../sockets';
import { DiContainer } from '../../index';

type Data = {
    size: number
}

export class Circle extends CommonTexture {
    allocation: string[]
    width = 180
    height = 275

    static ID = 'Circle texture'

    constructor(di: DiContainer, data: Data) {
        super('Circle texture', di)
        this.allocation = ['Generator'];

        const inp = new ClassicPreset.Input(sockets.num, 'Size');
        const ctrl = new ClassicPreset.InputControl('number', { initial: data.size, change: di.process })

        inp.addControl(ctrl);

        this.addInput('size', inp);
    }

    async data(inputs: any) {
        const sizeControl = (this.inputs['size']?.control as ClassicPreset.InputControl<'number'>).value
        const size = inputs['size'] && typeof inputs['size'][0] === 'number'
            ? inputs['size'][0]
            : sizeControl;

        const result = Utils.createMockCanvas();

        result.drawCircle(size);

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize(): Data {
        return {
            size: (this.inputs['size']?.control as ClassicPreset.InputControl<'number'>).value as number
        }
    }
}
