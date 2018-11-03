import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Output texture')
        this.allocation = ['Output'];
        this.module = {
            nodeType: 'output',
            socket: sockets.image
        }
    }

    builder(node) {
        const inp = new Input('input', 'Texture', sockets.image);
        const ctrl = new FieldControl(this.editor, 'name');

        return node
            .addInput(inp)
            .addControl(ctrl);
    }
}