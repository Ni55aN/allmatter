import {D3NE} from 'd3-node-editor';
import createTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default new D3NE.Component('blend', {
    builder() {
        var node = createTextureNode();

        node.title = 'Blend';

        var inp1 = new D3NE.Input('Image', sockets.image);
        var inp2 = new D3NE.Input('Image', sockets.image);
        var inp3 = new D3NE.Input('Mask', sockets.image);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3);
    },
    worker(node, inputs, outputs) {}
});