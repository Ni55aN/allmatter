import {D3NE} from 'd3-node-editor';
import sockets from '../../sockets';
import Utils from '../../utils';
import store from '../../../store';

export default new D3NE.Component('output material', {
    builder() {
        var inp1 = new D3NE.Input('Diffuse', sockets.image);
        var inp2 = new D3NE.Input('Normal', sockets.image);
        var inp3 = new D3NE.Input('Roughness', sockets.image);
        var inp4 = new D3NE.Input('Metalness', sockets.image);
        var inp5 = new D3NE.Input('Emissive', sockets.image);
        var inp6 = new D3NE.Input('Displacement', sockets.image);
        var inp7 = new D3NE.Input('Alpha', sockets.image);

        return new D3NE
            .Node('Output material')
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3)
            .addInput(inp4)
            .addInput(inp5)
            .addInput(inp6)
            .addInput(inp7);
    },
    async worker(node, inputs, outputs) {

        var diffuse = inputs[0][0]instanceof WebGLTexture
            ? inputs[0][0]
            : Utils.createMockTexture();
        var normal = inputs[1][0]instanceof WebGLTexture
            ? inputs[1][0]
            : Utils.createMockTexture('normal');
        var roughness = inputs[2][0]instanceof WebGLTexture
            ? inputs[2][0]
            : Utils.createMockTexture();
        var metalness = inputs[3][0]instanceof WebGLTexture
            ? inputs[3][0]
            : Utils.createMockTexture();
        var emissive = inputs[4][0]instanceof WebGLTexture
            ? inputs[4][0]
            : Utils.createMockTexture();
        var displacement = inputs[5][0]instanceof WebGLTexture
            ? inputs[5][0]
            : Utils.createMockTexture();
        var alpha = inputs[6][0]instanceof WebGLTexture
            ? inputs[6][0]
            : Utils.createMockTexture('white');

        store.commit('updateMaterial', {
            diffuse: Utils.textureToSrc(diffuse),
            normal: Utils.textureToSrc(normal),
            roughness: Utils.textureToSrc(roughness),
            metalness: Utils.textureToSrc(metalness),
            emissive: Utils.textureToSrc(emissive),
            displacement: Utils.textureToSrc(displacement),
            alpha: Utils.textureToSrc(alpha)
        });

    }
});