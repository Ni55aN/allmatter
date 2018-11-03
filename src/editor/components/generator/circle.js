import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class Circle extends TextureComponent {
    
    constructor() {
        super('Circle texture')
        this.allocation = ['Generator'];
    }

    builder(node) {
        super.builder(node);

        const inp = new Input('size', 'Size', sockets.num);
        const ctrl = new FieldControl(this.editor, 'size', {type: 'number', value: 1});

        inp.addControl(ctrl);

        return node.addInput(inp);
    }

    async worker(node, inputs, outputs) {
        const size = typeof inputs['size'][0] === 'number'
            ? inputs['size'][0]
            : node.data.size;

        const result = Utils.createMockCanvas();

        result.drawCircle(size);

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}