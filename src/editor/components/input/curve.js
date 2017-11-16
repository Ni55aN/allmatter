import sockets from '../../sockets';
import textInput from '../../controls/text-input';
import { moduleManager } from '../../module';

export default new D3NE.Component('Input curve', {
    builder(node) {
        var out = new D3NE.Output('Curve', sockets.curve);
        var ctrl = textInput('name', 'Name');
        var ctrl2 = new D3NE.Control('<div style="width: 140px; height: 140px; border: 2px solid red"></div>');
        
        return node
            .addOutput(out)
            .addControl(ctrl)
            .addControl(ctrl2);
    },
    worker() {
        moduleManager.workerInputs(...arguments);
    }
});