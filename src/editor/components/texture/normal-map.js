import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Normal map')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        super.builder(node);

        const inp = new Input('image', 'Image', sockets.image);
        const inp2 = new Input('scale', 'Scale', sockets.image);

        inp2.addControl(new FieldControl(this.editor, 'scale', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        const texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        const scale = typeof inputs['scale'][0] === 'number'
            ? inputs['scale'][0]
            : node.data.scale;

        const result = Utils.createMockCanvas();

        result.normalMap(texture, scale);

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}