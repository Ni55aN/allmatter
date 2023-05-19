import { Input } from 'rete';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Invert')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        super.builder(node);

        const inp = new Input('image', 'Image', sockets.image);

        return node.addInput(inp);
    }

    async worker(node, inputs, outputs) {
        const texture = inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();

        const result = Utils.createMockCanvas();

        result.blend(texture, 1, 'b - a');

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}