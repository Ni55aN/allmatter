import createMath from './math';
import sockets from '../../sockets';

export default function () {
    var node = createMath();
    var inp = new D3NE.Input('Value', sockets.value);

    return node.addInput(inp);
}