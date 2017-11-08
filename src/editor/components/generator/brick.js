import {D3NE} from 'd3-node-editor';
import modifyTextureNode, {updatePreview} from '../../common/builders/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import numInput from '../../controls/num-input';

export default new D3NE.Component('Brick texture', {
    builder(node) {
        modifyTextureNode(node);

        var inp = new D3NE.Input('Count', sockets.num);
        var inp2 = new D3NE.Input('Margin', sockets.num);

        var ctrl = numInput('count', 'Count', 1);
        var ctrl2 = numInput('margin', 'Margin', 0.02);

        inp.addControl(ctrl);
        inp2.addControl(ctrl2);

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    async worker(node, inputs, outputs) {
        var count = typeof inputs[0][0] === 'number'
            ? inputs[0][0]
            : node.data.count;
        var margin = typeof inputs[1][0] === 'number'
            ? inputs[1][0]
            : node.data.margin;

        var result = Utils.createMockCanvas();

        result.fillStyle([1, 1, 1, 1]);
        result.drawBricks(count, margin);

        outputs[0] = result.toTexture();
        updatePreview(node, result);
    }
});