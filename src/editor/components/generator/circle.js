import { Component, Input } from 'rete';
import modifyTextureNode from '../../common/builders/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import FieldControl from '../../controls/field';

export default class Circle extends Component {
    
    constructor() {
        super('Circle texture')
    }

    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('size', 'Size', sockets.num);
        var ctrl = new FieldControl(this.editor, 'size', {type: 'number', value: 1});

        inp.addControl(ctrl);

        return node.addInput(inp);
    }

    async worker(node, inputs, outputs) {
        var size = typeof inputs['size'][0] === 'number'
            ? inputs['size'][0]
            : node.data.size;

        var result = Utils.createMockCanvas();

        result.drawCircle(size);

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(result);
    }
};