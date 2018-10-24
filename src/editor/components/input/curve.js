import { Component, Output } from 'rete';
import FieldControl from '../../controls/field';
import sockets from '../../sockets';

export default class Curve extends Component {
    constructor() {
        super('Input curve');
        this.module = {
            nodeType: 'input',
            socket: sockets.curve
        }
    }
    
    builder(node) {
        var out = new Output('output', 'Curve', sockets.curve);
        var ctrl = new FieldControl(this.editor, 'name', {value: ''});
        // var ctrl2 = new Rete.Control('<div style="width: 140px; height: 140px; border: 2px solid red"></div>');
        
        return node
            .addOutput(out)
            .addControl(ctrl)
            // .addControl(ctrl2);
    }
}