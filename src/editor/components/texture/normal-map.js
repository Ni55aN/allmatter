import { Component, Input } from 'rete';
import Utils from '../../utils';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';
import FieldControl from '../../controls/field';

export default class extends Component {
    constructor() {
        super('Normal map')
    }
    
    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('image', 'Image', sockets.image);
        var inp2 = new Input('scale', 'Scale', sockets.image);

        inp2.addControl(new FieldControl(this.editor, 'scale', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        var texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        var scale = typeof inputs['scale'][0] === 'number'
            ? inputs['scale'][0]
            : node.data.scale;

        var result = Utils.createMockCanvas();

        result.normalMap(texture, scale);

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(result);
    }
}