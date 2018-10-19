import { Component, Output } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class Number extends Component {
    constructor() {
        super('Input number');
        this.module = {
            nodeType: 'input',
            socket: sockets.num
        }
    }

    builder(node) {
        var out = new Output('output', 'Number', sockets.num);
        var ctrl = new FieldControl(this.editor, 'name', {value: ''});
        var ctrl2 = new FieldControl(this.editor, 'number', {type: 'number', value: 1});
        
        return node
            .addControl(ctrl)
            .addControl(ctrl2)
            .addOutput(out);
    }

    async worker(node, inputs, outputs) {
        if (!outputs['output'])
            outputs['output'] = node.data.number;
    }
};