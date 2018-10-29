import { Component, Input } from 'rete';
import Utils from '../../utils';
import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Invert')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('image', 'Image', sockets.image);

        return node.addInput(inp);
    }

    async worker(node, inputs, outputs) {
        var texture = inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();

        var result = Utils.createMockCanvas();

        result.blend(texture, 1, 'b - a');

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(result);
        updatePreview(node, result);
    }
}