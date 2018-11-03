import { Input } from 'rete';
import TextureComponent from '../../common/components/texture';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Blend')
        this.allocation = ['Texture'];
    }

    builder(node) {
        super.builder(node);

        const inp1 = new Input('image1', 'Image', sockets.image);
        const inp2 = new Input('image2', 'Image', sockets.image);
        const inp3 = new Input('mask', 'Mask', sockets.image);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3);
    }
}