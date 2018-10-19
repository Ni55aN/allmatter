import { Component, Input } from 'rete';
import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default class extends Component {
    constructor(){
        super('Blend')
    }

    builder(node) {
        modifyTextureNode(node);

        var inp1 = new Input('image1','Image', sockets.image);
        var inp2 = new Input('image2','Image', sockets.image);
        var inp3 = new Input('mask', 'Mask', sockets.image);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3);
    }
};