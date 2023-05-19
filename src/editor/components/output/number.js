import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Output number');
        this.allocation = ['Output'];
        this.module = {
            nodeType: 'output',
            socket: sockets.num
        }
    }

    builder(node) {
        const inp = new Input('input', 'Number', sockets.num);
        const ctrl = new FieldControl(this.editor, 'name', {value: 'num'});

        return node
            .addControl(ctrl)
            .addInput(inp);
    }

    worker() { 1 }
}
