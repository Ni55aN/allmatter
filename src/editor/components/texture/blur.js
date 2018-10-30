import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import Utils from '../../utils';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Blur')
        this.allocation = ['Texture'];
    }

    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('image', 'Image', sockets.image);
        var inp2 = new Input('radius', 'Radius', sockets.image);

        inp2.addControl(new FieldControl(this.editor, 'radius', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        var texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        var radius = typeof inputs['radius'][0] === 'number'
            ? inputs['radius'][0]
            : node.data.radius;

        var result = Utils.createMockCanvas();

        result.blur(texture, radius);

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(outputs['image']);
    }
}