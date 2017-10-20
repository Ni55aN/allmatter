import createTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';

export default new D3NE.Component('texture gradient', {
    builder() {
        var node = createTextureNode();

        node.title = 'Texture gradient';

        var inp = new D3NE.Input('Image', sockets.image);
        var inp2 = new D3NE.Input('Curve', sockets.curve);

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    worker(node, inputs, outputs) {}
});