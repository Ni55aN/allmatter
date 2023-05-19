import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class Brick extends TextureComponent {
    
    constructor() {
        super('Brick texture');
        this.allocation = ['Generator'];
    }

    builder(node) {
        super.builder(node);

        const inp = new Input('count', 'Count', sockets.num);
        const inp2 = new Input('margin', 'Margin', sockets.num);

        const ctrl = new FieldControl(this.editor, 'count', {type: 'number', value: 12});
        const ctrl2 = new FieldControl(this.editor, 'margin', {type: 'number', value: 0.04})

        inp.addControl(ctrl);
        inp2.addControl(ctrl2);

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        const count = typeof inputs['count'][0] === 'number'
            ? inputs['count'][0]
            : node.data.count;
        const margin = typeof inputs['margin'][0] === 'number'
            ? inputs['margin'][0]
            : node.data.margin;

        const result = Utils.createMockCanvas();

        result.fillStyle([1, 1, 1, 1]);
        result.drawBricks(count, margin);

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}