import { Output } from 'rete';
import Preview from '../../controls/preview'
import sockets from '../../sockets';
import store from '../../../store';

//builder
export default function (node) {
    var out = new Output('image', 'Image', sockets.image);
    var ctrl = new Preview();

    // store.commit('registerPreviewControl', { id: node.id, control: ctrl });

    return node
        .addControl(ctrl)
        .addOutput(out);
}