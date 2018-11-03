import { Input } from 'rete';
import TextureComponent from '../../common/components/texture';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Texture gradient')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        super.builder(node);

        const inp = new Input('image', 'Image', sockets.image);
        const inp2 = new Input('curve', 'Curve', sockets.curve);

        return node
            .addInput(inp)
            .addInput(inp2);
    }
}