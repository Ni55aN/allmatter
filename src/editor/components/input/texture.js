import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import sockets from '../../sockets';

export default class ColorComponent extends TextureComponent {
    constructor() {
        super('Input texture');
        this.allocation = ['Input'];
        this.module = {
            nodeType: 'input',
            socket: sockets.color
        }
    }
    
    builder(node) {
        super.builder(node);

        const ctrl = new FieldControl(this.editor, 'name', {value: ''});
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