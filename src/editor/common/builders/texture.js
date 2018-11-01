import { Output } from 'rete';
import Preview from '../../controls/preview'
import sockets from '../../sockets';

//builder
export default function (node) {
    var out = new Output('image', 'Image', sockets.image);
    var ctrl = new Preview();

    return node
        .addControl(ctrl)
        .addOutput(out);
}