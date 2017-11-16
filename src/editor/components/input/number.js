import numInput from '../../controls/num-input';
import sockets from '../../sockets';
import textInput from '../../controls/text-input';
import { moduleManager } from '../../module';

export default new D3NE.Component('Input number', {
    builder(node) {
        var out = new D3NE.Output('Number', sockets.num);
        var ctrl = textInput('name', 'Name');
        var ctrl2 = numInput('number', 'Value');
        
        return node
            .addControl(ctrl)
            .addControl(ctrl2)
            .addOutput(out);
    },
    async worker(node, inputs, outputs) {
        moduleManager.workerInputs(...arguments);
        if (!outputs[0])
            outputs[0] = node.data.number;
    }
});