import { Component, Input } from 'rete';
import Utils from '../../utils';
import sockets from '../../sockets';
import store from '../../../store';

export default class extends Component {
    constructor() {
        super('Output material')
        this.allocation = ['Output'];
    }

    builder(node) {
        const inp1 = new Input('diffuse', 'Diffuse', sockets.image);
        const inp2 = new Input('normal', 'Normal', sockets.image);
        const inp3 = new Input('rough', 'Roughness', sockets.image);
        const inp4 = new Input('metal', 'Metalness', sockets.image);
        const inp5 = new Input('emis', 'Emissive', sockets.image);
        const inp6 = new Input('disp', 'Displacement', sockets.image);
        const inp7 = new Input('alpha', 'Alpha', sockets.image);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3)
            .addInput(inp4)
            .addInput(inp5)
            .addInput(inp6)
            .addInput(inp7);
    }

    async worker(node, inputs) {
        
        const diffuse = inputs['diffuse'][0]instanceof WebGLTexture
            ? inputs['diffuse'][0]
            : Utils.createMockTexture();
        const normal = inputs['normal'][0]instanceof WebGLTexture
            ? inputs['normal'][0]
            : Utils.createMockTexture('normal');
        const roughness = inputs['rough'][0]instanceof WebGLTexture
            ? inputs['rough'][0]
            : Utils.createMockTexture();
        const metalness = inputs['metal'][0]instanceof WebGLTexture
            ? inputs['metal'][0]
            : Utils.createMockTexture();
        const emissive = inputs['emis'][0]instanceof WebGLTexture
            ? inputs['emis'][0]
            : Utils.createMockTexture();
        const displacement = inputs['disp'][0]instanceof WebGLTexture
            ? inputs['disp'][0]
            : Utils.createMockTexture();
        const alpha = inputs['alpha'][0]instanceof WebGLTexture
            ? inputs['alpha'][0]
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
}