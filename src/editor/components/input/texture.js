import { Component } from 'rete';
import FieldControl from '../../controls/field';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class ColorComponent extends Component {
    constructor() {
        super('Input texture');
        this.allocation = ['Input'];
        this.module = {
            nodeType: 'input',
            socket: sockets.color
        }
    }
    
    builder(node) {
        modifyTextureNode(node);

        var ctrl = new FieldControl(this.editor, 'name', {value: ''});
        // var ctrl2 = new Rete.Control('<input type="file"/>', (el, control) => {
        //     el.addEventListener('change', () => {
        //         control
        //             .getNode()
        //             .controls[1]
        //             .updatePreview();
        //     });
        // });

        return node
            .addControl(ctrl, 0)
            //.addControl(ctrl2)
    }
}