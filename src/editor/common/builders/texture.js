import {D3NE} from 'd3-node-editor';
import preview from '../../controls/preview'
import sockets from '../../sockets';
import eventbus from '../../../eventbus';

export function updatePreview(node, obj) {
    eventbus.$emit('updateNodePreview', node, obj);
}

export default function (node) {
    var out = new D3NE.Output('Image', sockets.image);
    var ctrl = preview();

    eventbus.$on('updateNodePreview', (nodeData, canvas) => {
        if (node.id === nodeData.id) 
            ctrl.updatePreview(canvas);
    }
    );

    return node
        .addControl(ctrl)
        .addOutput(out);
}
