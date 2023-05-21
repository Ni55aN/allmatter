import { ClassicPreset } from 'rete';
import sockets from '../../sockets';

export default function (node: ClassicPreset.Node) {
    const inp = new ClassicPreset.Input(sockets.value, 'Value');
    const out = new ClassicPreset.Output(sockets.value, 'Value');

    node.addInput('value1', inp)
    node.addOutput('value', out);
}
