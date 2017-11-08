import {D3NE} from 'd3-node-editor';
import Utils from '../../utils';
import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';

export default new D3NE.Component('Invert', {
    builder(node) {
        modifyTextureNode(node);

        var inp = new D3NE.Input('Image', sockets.image);

        return node.addInput(inp);
    },
    async worker(node, inputs, outputs) {

        var texture = inputs[0][0]instanceof WebGLTexture
            ? inputs[0][0]
            : Utils.createMockTexture();

        var result = Utils.createMockCanvas();

        result.blend(texture, 1, 'b - a');

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});