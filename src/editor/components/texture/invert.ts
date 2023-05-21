import { ClassicPreset } from 'rete';
import { DataflowNode } from 'rete-engine';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DiContainer } from '../../index';

export class Invert extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 280

    static ID = 'invert'

    constructor(di: DiContainer) {
        super('Invert', di)
        this.allocation = ['Texture'];

        const inp = new ClassicPreset.Input(sockets.image, 'Image');

        this.addInput('image', inp);
    }

    data(inputs: any) {
        const texture = inputs['image'] && inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture('');

        const result = Utils.createMockCanvas();

        result.blend(texture, 1, 'b - a');

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize() {
        return {}
    }
}
