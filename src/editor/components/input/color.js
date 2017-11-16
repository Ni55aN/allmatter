import colorPicker from '../../controls/color-picker';
import sockets from '../../sockets';
import textInput from '../../controls/text-input';
import Color from '../../../color';
import { moduleManager } from '../../module';

export default new D3NE.Component('Input color', {
    builder(node) {
        var out = new D3NE.Output('Color', sockets.color);
        var ctrl = textInput('name', 'Name');
        var ctrl2 = colorPicker('color', new Color());

        return node
            .addOutput(out)
            .addControl(ctrl)
            .addControl(ctrl2);
    },
    worker(node, inputs, outputs) {
        moduleManager.workerInputs(...arguments);
        if (!outputs[0])
            outputs[0] = Color.fromArray(node.data.color);
    }
});