import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    scale: number
}

export class NormalMap extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'normal map'

    constructor(di: DiContainer, data: Data) {
        super('Normal map', di)
        this.allocation = ['Texture'];

        const inp = new ClassicPreset.Input(sockets.image, 'Image')
        const inp2 = new ClassicPreset.Input(sockets.num, 'Scale')

        inp2.addControl(new ClassicPreset.InputControl('number', { initial: data.scale, change: di.process }));

        this.addInput('image', inp)
        this.addInput('scale', inp2);
    }

    async data(inputs: any) {
        const scaleControl = (this.inputs['scale']?.control as ClassicPreset.InputControl<'number'>).value
        const texture = inputs['image'] && inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture('');
        const scale = inputs['scale'] && typeof inputs['scale'][0] === 'number'
            ? inputs['scale'][0]
            : scaleControl;

        const result = Utils.createMockCanvas();

        result.normalMap(texture, scale);

        const image = result.toTexture();
        this.updatePreview(image);

        return {
            image
        }
    }

    serialize(): Data {
        return {
            scale: (this.inputs['scale']?.control as ClassicPreset.InputControl<'number'>).value as number
        }
    }
}
