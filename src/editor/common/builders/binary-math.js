import { Input } from 'rete';
import modifyMath from './math';
import sockets from '../../sockets';

export default function (node) {
    modifyMath(node);
    const inp = new Input('value2', 'Value', sockets.value);

    return node.addInput(inp);
}