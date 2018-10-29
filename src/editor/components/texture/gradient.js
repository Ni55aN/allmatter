import { Component, Input } from 'rete';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class extends Component {
    constructor() {
        super('Texture gradient')
        this.allocation = ['Texture'];
    }
    
    builder(node) {
        modifyTextureNode(node);

        var inp = new Input('image', 'Image', sockets.image);
        var inp2 = new Input('curve', 'Curve', sockets.curve);

        return node
            .addInput(inp)
            .addInput(inp2);
    }
}