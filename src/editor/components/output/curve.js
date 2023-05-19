import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Output curve')
        this.allocation = ['Output'];
    }
        
    builder(node) {
        const inp = new Input('input', 'Curve', sockets.curve);
        const ctrl = new FieldControl(this.editor, 'name', {value: ''});

        return node
            .addInput(inp)
            .addControl(ctrl);
    }
}