import {D3NE} from 'd3-node-editor';
import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('Circle texture', {
    builder(node) {
        modifyTextureNode(node);

        var inp = new D3NE.Input('Size', sockets.num);
        var ctrl = numInput('size', 'Size', 1);

        inp.addControl(ctrl);

        return node.addInput(inp);
    },
    async worker(node, inputs, outputs) {
        var size = typeof inputs[0][0] === 'number'
            ? inputs[0][0]
            : node.data.size;

        var result = Utils.createMockCanvas();

        result.drawCircle(size);

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});