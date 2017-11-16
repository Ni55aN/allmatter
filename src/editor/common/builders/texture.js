import preview from '../../controls/preview'
import sockets from '../../sockets';
import store from '../../../store';

//builder
export default function (node) {
    var out = new D3NE.Output('Image', sockets.image);
    var ctrl = preview();

    store.commit('registerPreviewControl', { id: node.id, control: ctrl });

    return node
        .addControl(ctrl)
        .addOutput(out);
}

// in worker
export function updatePreview(node, canvas) {
    store.commit('updatePreviewControl', {id: node.id, canvas: canvas})
}