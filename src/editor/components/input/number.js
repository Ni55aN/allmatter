import {D3NE} from 'd3-node-editor';
import modifyIdInput from '../../common/builders/modificator/input-id';
import numInput from '../../controls/num-input';
import sockets from '../../sockets';

export default new D3NE.Component('input number', {
    builder() {
        var out = new D3NE.Output('Number', sockets.num);
        var ctrl = numInput('number', 'Value');

        return modifyIdInput(new D3NE.Node('Input number'))
            .addControl(ctrl)
            .addOutput(out);
    },
    async worker(node, inputs, outputs) {
        outputs[0] = node.data.number;
    }
});