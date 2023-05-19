import { Input, Output } from 'rete';
import sockets from '../../sockets';

export default function (node) {
    const inp = new Input('value1', 'Value', sockets.value);
    const out = new Output('value', 'Value', sockets.value);

    return node
        .addInput(inp)
        .addOutput(out);
}
