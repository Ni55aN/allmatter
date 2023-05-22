import { ClassicPreset } from 'rete';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Inputs = {
    diffuse?: WebGLTexture[]
    normal?: WebGLTexture[]
    rough?: WebGLTexture[]
    metal?: WebGLTexture[]
    emis?: WebGLTexture[]
    disp?: WebGLTexture[]
    alpha?: WebGLTexture[]
}

export class OutputMaterial extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 295

    static ID = 'Output material'

    constructor(private di: DiContainer) {
        super('Output material')
        this.allocation = ['Output'];

        const inp1 = new ClassicPreset.Input(sockets.image, 'Diffuse');
        const inp2 = new ClassicPreset.Input(sockets.image, 'Normal');
        const inp3 = new ClassicPreset.Input(sockets.image, 'Roughness');
        const inp4 = new ClassicPreset.Input(sockets.image, 'Metalness');
        const inp5 = new ClassicPreset.Input(sockets.image, 'Emissive');
        const inp6 = new ClassicPreset.Input(sockets.image, 'Displacement');
        const inp7 = new ClassicPreset.Input(sockets.image, 'Alpha');

        this.addInput('diffuse', inp1)
        this.addInput('normal', inp2)
        this.addInput('rough', inp3)
        this.addInput('metal', inp4)
        this.addInput('emis', inp5)
        this.addInput('disp', inp6)
        this.addInput('alpha', inp7);
    }

    data(inputs: Inputs) {
        const diffuse = inputs['diffuse'] && inputs['diffuse'][0] instanceof WebGLTexture
            ? inputs['diffuse'][0]
            : Utils.createMockTexture('');
        const normal = inputs['normal'] && inputs['normal'][0] instanceof WebGLTexture
            ? inputs['normal'][0]
            : Utils.createMockTexture('normal');
        const roughness = inputs['rough'] && inputs['rough'][0] instanceof WebGLTexture
            ? inputs['rough'][0]
            : Utils.createMockTexture('');
        const metalness = inputs['metal'] && inputs['metal'][0] instanceof WebGLTexture
            ? inputs['metal'][0]
            : Utils.createMockTexture('');
        const emissive = inputs['emis'] && inputs['emis'][0] instanceof WebGLTexture
            ? inputs['emis'][0]
            : Utils.createMockTexture('');
        const displacement = inputs['disp'] && inputs['disp'][0] instanceof WebGLTexture
            ? inputs['disp'][0]
            : Utils.createMockTexture('');
        const alpha = inputs['alpha'] && inputs['alpha'][0] instanceof WebGLTexture
            ? inputs['alpha'][0]
            : Utils.createMockTexture('white');

        this.di.updateMaterial({
            diffuse: Utils.textureToCanvas(diffuse),
            normal: Utils.textureToCanvas(normal),
            roughness: Utils.textureToCanvas(roughness),
            metalness: Utils.textureToCanvas(metalness),
            emissive: Utils.textureToCanvas(emissive),
            displacement: Utils.textureToCanvas(displacement),
            alpha: Utils.textureToCanvas(alpha)
        });

        return {}
    }

    serialize() {
        return {}
    }
}
