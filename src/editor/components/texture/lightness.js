import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Lightness')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        super.builder(node);

        const inp = new Input('image', 'Image', sockets.image);
        const inp2 = new Input('scalar', 'Scalar', sockets.num);

        inp2.addControl(new FieldControl(this.editor, 'scalar', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        const texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        const scalar = typeof inputs['scalar'][0] === 'number'
            ? inputs['scalar'][0]
            : node.data.scalar;

        const result = Utils.createMockCanvas();

        result.blend(texture, scalar, 'a+b');

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}