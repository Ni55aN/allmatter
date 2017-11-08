import {D3NE} from 'd3-node-editor';
import modifyIdInput from '../../common/builders/modificator/input-id';

export default new D3NE.Component('Input curve', {
    builder(node) {
        var out = new D3NE.Output('Curve', curveSocket);
        var ctrl = new D3NE.Control('<div style="width: 140px; height: 140px; border: 2px solid red"></div>');

        return modifyIdInput(node)
            .addOutput(out)
            .addControl(ctrl);
    },
    worker() {}
});