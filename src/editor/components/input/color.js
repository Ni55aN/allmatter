import { Component, Output } from 'rete';
import Color from '../../../color';
import FieldControl from '../../controls/field';
import colorPicker from '../../controls/color-picker';
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
        var out = new Output('output', 'Color', sockets.color);
        var ctrl = new FieldControl(this.editor, 'name', {type: 'text', value: ''});
        var ctrl2 = colorPicker('color', new Color());

        return node
            .addOutput(out)
            .addControl(ctrl)
            .addControl(ctrl2);
    }

    worker(node, inputs, outputs) {
        if (!outputs['output'])
            outputs['output'] = Color.fromArray(node.data.color);
    }
}