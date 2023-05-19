import { Component, Output } from 'rete';
import Color from 'color';
import ColorPicker from '../../controls/color-picker';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class ColorComponent extends Component {
    constructor() {
        super('Input color');
        this.allocation = ['Input'];
        this.module = {
            nodeType: 'input',
            socket: sockets.color
        }
    }

    builder(node) {
        const out = new Output('output', 'Color', sockets.color);
        const ctrl = new FieldControl(this.editor, 'name', {type: 'text', value: ''});
        const ctrl2 = new ColorPicker('color', new Color(), () => this.editor.trigger('process'));

        return node
            .addOutput(out)
            .addControl(ctrl)
            .addControl(ctrl2);
    }

    worker(node, inputs, outputs) {
        if (!outputs['output'])
            outputs['output'] = new Color(node.data.color);
    }
}
