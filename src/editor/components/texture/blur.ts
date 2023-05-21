import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    radius: number
}

export class Blur extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'blur'

    constructor(di: DiContainer, data: Data) {
        super('Blur', di)
        this.allocation = ['Texture'];

        const inp = new ClassicPreset.Input(sockets.image, 'Image');
        const inp2 = new ClassicPreset.Input(sockets.image, 'Radius');

        inp2.addControl(new ClassicPreset.InputControl('number', { initial: data.radius, change: di.process }));

        this.addInput('image', inp)
        this.addInput('radius', inp2);
    }

    async data(inputs: any) {
        const controlRadius = (this.inputs['radius']?.control as ClassicPreset.InputControl<'number'>).value
        const texture = inputs['image'] && inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture('');
        const radius = inputs['radius'] && typeof inputs['radius'][0] === 'number'
            ? inputs['radius'][0]
            : controlRadius;

        const result = Utils.createMockCanvas();

        result.blur(texture, radius);

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize(): Data {
        return {
            radius: (this.inputs['radius']?.control as ClassicPreset.InputControl<'number'>).value as number
        }
    }
}
