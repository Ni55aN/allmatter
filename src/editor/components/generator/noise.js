import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class Noise extends TextureComponent {
    constructor() {
        super('Noise texture')
        this.allocation = ['Generator'];
    }

    builder(node) {
        super.builder(node);

        const inp = new Input('level', 'Level', sockets.num);
        const ctrl = new FieldControl(this.editor, 'level', {type: 'number', value: 1});

        inp.addControl(ctrl);

        return node.addInput(inp);
    }

    async worker(node, inputs, outputs) {
        // var level = typeof inputs['level'][0] === 'number'
        //     ? inputs['level'][0] /// ??? 1 or level
        //     : node.data.level;

        const result = Utils.createMockCanvas();

        result.noise();

        outputs['image'] = result.toTexture();
        this.updatePreview(node, outputs['image']);
    }
}