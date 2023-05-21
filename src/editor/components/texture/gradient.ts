import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

export class Gradient extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'gradient'

    constructor(di: DiContainer) {
        super('Texture gradient', di)
        this.allocation = ['Texture'];

        const inp = new ClassicPreset.Input(sockets.image, 'Image');
        const inp2 = new ClassicPreset.Input(sockets.curve, 'Curve');

        this.addInput('image', inp)
        this.addInput('curve', inp2);
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
