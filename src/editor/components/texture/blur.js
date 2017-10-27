import {D3NE} from 'd3-node-editor';
import Utils from '../../utils';
import createTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('blur', {
    builder() {
        var node = createTextureNode();

        node.title = 'Blur';

        var inp = new D3NE.Input('Image', sockets.image);
        var inp2 = new D3NE.Input('Radius', sockets.image);

        inp2.addControl(numInput('radius', 'Radius'));

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    async worker(node, inputs, outputs) {
        var texture = inputs[0][0]instanceof WebGLTexture
            ? inputs[0][0]
            : Utils.createMockTexture();
        var radius = typeof inputs[1][0] === 'number'
            ? inputs[1][0]
            : node.data.radius;

        var result = Utils.createMockCanvas();

        result.blur(texture, radius);

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});