import Utils from '../../utils';
import createTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('normal map', {
    builder() {
        var node = createTextureNode();

        node.title = 'Normal map';

        var inp = new D3NE.Input('Image', sockets.image);
        var inp2 = new D3NE.Input('Scale', sockets.image);

        inp2.addControl(numInput('scale', 'Scale'));

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    async worker(node, inputs, outputs) {
        var texture = inputs[0][0]instanceof WebGLTexture
            ? inputs[0][0]
            : Utils.createMockTexture();
        var scale = typeof inputs[1][0] === 'number'
            ? inputs[1][0]
            : node.data.scale;

        var result = Utils.createMockCanvas();

        result.normalMap(texture, scale);

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});