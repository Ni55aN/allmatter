import textInput from '../../controls/text-input';
import sockets from '../../sockets';
import { moduleManager } from '../../module';

export default new D3NE.Component('Output curve', {
    builder(node) {
        var inp = new D3NE.Input('Curve', sockets.curve);
        var ctrl = textInput('name', 'Name');

        return node
            .addInput(inp)
            .addControl(ctrl);
    },
    worker: moduleManager.workerOutputs.bind(moduleManager)
});