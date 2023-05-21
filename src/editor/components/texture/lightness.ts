import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    scalar: number
}

export class Lightness extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'lightness'

    constructor(di: DiContainer, data: Data) {
        super('Lightness', di)
        this.allocation = ['Texture'];

        const inp = new ClassicPreset.Input(sockets.image, 'Image');
        const inp2 = new ClassicPreset.Input(sockets.num, 'Scalar');

        inp2.addControl(new ClassicPreset.InputControl('number', { initial: data.scalar, change: di.process }))

        this.addInput('image', inp)
        this.addInput('scalar', inp2);
    }

    data(inputs: any) {
        const scalarControl = (this.inputs['scalar']?.control as ClassicPreset.InputControl<'number'>).value
        const texture = inputs['image'] && inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture('');
        const scalar = inputs['scalar'] && typeof inputs['scalar'][0] === 'number'
            ? inputs['scalar'][0]
            : scalarControl;

        const result = Utils.createMockCanvas();

        result.blend(texture, scalar, 'a+b');

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize(): Data {
        return {
            scalar: (this.inputs['scalar']?.control as ClassicPreset.InputControl<'number'>).value as number
        }
    }
}
