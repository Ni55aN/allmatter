import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

export class Blend extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'blend'

    constructor(di: DiContainer) {
        super('Blend', di)
        this.allocation = ['Texture'];

        const inp1 = new ClassicPreset.Input(sockets.image, 'Image');
        const inp2 = new ClassicPreset.Input(sockets.image, 'Image');
        const inp3 = new ClassicPreset.Input(sockets.image, 'Mask')

        this.addInput('image1', inp1)
        this.addInput('image2', inp2)
        this.addInput('mask', inp3);
    }

    data() {
        return {
            image: null
        }
    }

    serialize() {
        return {}
    }
}
