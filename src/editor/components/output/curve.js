import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Output curve')
    }
        
    builder(node) {
        var inp = new Input('input', 'Curve', sockets.curve);
        var ctrl = new FieldControl(this.editor, 'name', {value: ''});

        return node
            .addInput(inp)
            .addControl(ctrl);
    }
}