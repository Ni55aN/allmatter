import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Output texture')
    }

    builder(node) {
        var inp = new Input('input', 'Texture', sockets.image);
        var ctrl = new FieldControl(this.editor, 'name');

        return node
            .addInput(inp)
            .addControl(ctrl);
    }
}