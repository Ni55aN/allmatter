import Utils from '../../utils';
import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('Lightness', {
    builder(node) {
        modifyTextureNode(node);

        var inp = new D3NE.Input('Image', sockets.image);
        var inp2 = new D3NE.Input('Scalar', sockets.num);

        inp2.addControl(numInput('scalar', 'Scalar', 0));

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    async worker(node, inputs, outputs) {
        var texture = inputs[0][0]instanceof WebGLTexture
            ? inputs[0][0]
            : Utils.createMockTexture();
        var scalar = typeof inputs[1][0] === 'number'
            ? inputs[1][0]
            : node.data.scalar;

        var result = Utils.createMockCanvas();

        result.blend(texture, scalar, 'a+b');

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});