import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import Utils from '../../utils';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Lightness')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('image', 'Image', sockets.image);
        var inp2 = new Input('scalar', 'Scalar', sockets.num);

        inp2.addControl(new FieldControl(this.editor, 'scalar', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        var texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        var scalar = typeof inputs['scalar'][0] === 'number'
            ? inputs['scalar'][0]
            : node.data.scalar;

        var result = Utils.createMockCanvas();

        result.blend(texture, scalar, 'a+b');

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(outputs['image']);
    }
}