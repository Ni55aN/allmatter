import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';
import Utils from '../../utils';

export default new D3NE.Component('Noise texture', {
    builder(node) {
        modifyTextureNode(node);

        var inp = new D3NE.Input('Level', sockets.num);

        inp.addControl(numInput('level', 'Level', 1));

        return node.addInput(inp);
    },
    async worker(node, inputs, outputs) {
        var level = typeof inputs[0][0] === 'number'
            ? inputs[1][0]
            : node.data.level;

        var result = Utils.createMockCanvas();

        result.noise();

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});