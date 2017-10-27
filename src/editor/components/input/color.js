import {D3NE} from 'd3-node-editor';
import colorPicker from '../../controls/color-picker';
import modifyIdInput from '../../common/builders/modificator/input-id';
import sockets from '../../sockets';
import Color from '../../../color';

export default new D3NE.Component('input color', {
    builder() {
        var out = new D3NE.Output('Color', sockets.color);
        var ctrl = colorPicker('color', new Color());

        return modifyIdInput(new D3NE.Node('Input color'))
            .addOutput(out)
            .addControl(ctrl);
    },
    worker(node, inputs, outputs) {
        outputs[0] = Color.fromArray(node.data.color);
    }
});