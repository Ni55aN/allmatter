import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Blur')
        this.allocation = ['Texture'];
    }

    builder(node) {
        super.builder(node);

        const inp = new Input('image', 'Image', sockets.image);
        const inp2 = new Input('radius', 'Radius', sockets.image);

        inp2.addControl(new FieldControl(this.editor, 'radius', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        const texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        const radius = typeof inputs['radius'][0] === 'number'
            ? inputs['radius'][0]
            : node.data.radius;

        const result = Utils.createMockCanvas();

        result.blur(texture, radius);

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}