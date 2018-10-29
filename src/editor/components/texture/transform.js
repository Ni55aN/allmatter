import { Component, Input } from 'rete';
import FieldControl from '../../controls/field';
import Utils from '../../utils';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Texture transform')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('image', 'Image', sockets.image);
        var inpX = new Input('x', 'Translate X', sockets.num);
        var inpY = new Input('y', 'Translate Y', sockets.num);
        var inputRepeat = new Input('repeat', 'Repeat', sockets.num);

        inpX.addControl(new FieldControl(this.editor, 'x', {type: 'number', value: 0}));
        inpY.addControl(new FieldControl(this.editor, 'y', {type: 'number', value: 0}));
        inputRepeat.addControl(new FieldControl(this.editor, 'repeat', {type: 'number', value: 1}));

        return node
            .addInput(inp)
            .addInput(inpX)
            .addInput(inpY)
            .addInput(inputRepeat)
    }

    async worker(node, inputs, outputs) {
        var texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        var x = typeof inputs['x'][0] === 'number'
            ? inputs['x'][0]
            : node.data.x;
        var y = typeof inputs['y'][0] === 'number'
            ? inputs['y'][0]
            : node.data.y;
        var repeat = typeof inputs['repeat'][0] === 'number'
            ? inputs['repeat'][0]
            : node.data.repeat;

        var result = Utils.createMockCanvas();

        result.transform(texture, x, y, repeat);

        outputs['image'] = result.toTexture();
        this.editor.nodes.find(n => n.id === node.id).controls.get('preview').updatePreview(result);
    }
}