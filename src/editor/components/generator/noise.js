import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import Utils from '../../utils';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class Noise extends Component {
    constructor() {
        super('Noise texture')
        this.allocation = ['Generator'];
    }

    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('level', 'Level', sockets.num);
        var ctrl = new FieldControl(this.editor, 'level', {type: 'number', value: 1});

        inp.addControl(ctrl);

        return node.addInput(inp);
    }

    async worker(node, inputs, outputs) {
        // var level = typeof inputs['level'][0] === 'number'
        //     ? inputs['level'][0] /// ??? 1 or level
        //     : node.data.level;

        var result = Utils.createMockCanvas();

        result.noise();

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(result);
    }
}