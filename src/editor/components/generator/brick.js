import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import Utils from '../../utils';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class Brick extends Component {
    
    constructor() {
        super('Brick texture')
    }

    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('count', 'Count', sockets.num);
        var inp2 = new Input('margin', 'Margin', sockets.num);

        var ctrl = new FieldControl(this.editor, 'count', {type: 'number', value: 12});
        var ctrl2 = new FieldControl(this.editor, 'margin', {type: 'number', value: 0.04})

        inp.addControl(ctrl);
        inp2.addControl(ctrl2);

        return node
            .addInput(inp)
            .addInput(inp2);
    }

    async worker(node, inputs, outputs) {
        console.log(inputs)
        var count = typeof inputs['count'][0] === 'number'
            ? inputs['count'][0]
            : node.data.count;
        var margin = typeof inputs['margin'][0] === 'number'
            ? inputs['margin'][0]
            : node.data.margin;

        console.log(node)
        var result = Utils.createMockCanvas();

        result.fillStyle([1, 1, 1, 1]);
        result.drawBricks(count, margin);

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(result);
    }
}