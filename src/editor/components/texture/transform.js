import Utils from '../../utils';
import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('Texture transform', {
    builder(node) {
        modifyTextureNode(node);

        var inp = new D3NE.Input('Image', sockets.image);
        var inpX = new D3NE.Input('Translate X', sockets.num);
        var inpY = new D3NE.Input('Translate Y', sockets.num);
        var inputRepeat = new D3NE.Input('Repeat', sockets.num);

        inpX.addControl(numInput('x', 'Translate X', 0));
        inpY.addControl(numInput('y', 'Translate Y', 0));
        inputRepeat.addControl(numInput('repeat', 'Repeat', 0));

        return node
            .addInput(inp)
            .addInput(inpX)
            .addInput(inpY)
            .addInput(inputRepeat)
    },
    async worker(node, inputs, outputs) {
        var texture = inputs[0][0]instanceof WebGLTexture
            ? inputs[0][0]
            : Utils.createMockTexture();
        var x = typeof inputs[1][0] === 'number'
            ? inputs[1][0]
            : node.data.x;
        var y = typeof inputs[2][0] === 'number'
            ? inputs[2][0]
            : node.data.y;
        var repeat = typeof inputs[3][0] === 'number'
            ? inputs[3][0]
            : node.data.repeat;

        var result = Utils.createMockCanvas();

        result.transform(texture, x, y, repeat);

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});