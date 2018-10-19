import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class ColorComponent extends Component {
    constructor() {
        super('Input color');
        this.module = {
            nodeType: 'output',
            socket: sockets.color
        }
    }
    
    builder(node) {
        var inp = new Input('input', 'Color', sockets.color);
        var ctrl = new FieldControl(this.editor, 'name', {value: ''});

        return node
            .addInput(inp)
            .addControl(ctrl);
    }
};