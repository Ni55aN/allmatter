import { Input } from 'rete';
import FieldControl from '../../controls/field';
import TextureComponent from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';

export default class extends TextureComponent {
    constructor() {
        super('Texture transform')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        super.builder(node);

        const inp = new Input('image', 'Image', sockets.image);
        const inpX = new Input('x', 'Translate X', sockets.num);
        const inpY = new Input('y', 'Translate Y', sockets.num);
        const inputRepeat = new Input('repeat', 'Repeat', sockets.num);

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
        const texture = inputs['image'][0]instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture();
        const x = typeof inputs['x'][0] === 'number'
            ? inputs['x'][0]
            : node.data.x;
        const y = typeof inputs['y'][0] === 'number'
            ? inputs['y'][0]
            : node.data.y;
        const repeat = typeof inputs['repeat'][0] === 'number'
            ? inputs['repeat'][0]
            : node.data.repeat;

        const result = Utils.createMockCanvas();

        result.transform(texture, x, y, repeat);
        this.j = 565;
        outputs['image'] = result.toTexture();

        this.updatePreview(node, outputs['image']);
    }
}