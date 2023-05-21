import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    x: number
    y: number
    repeat: number
}

export class Transform extends CommonTexture implements DataflowNode {
    allocation: string[]
    width = 180
    height = 380

    static ID = 'transform'

    constructor(di: DiContainer, data: Data) {
        super('Texture transform', di)
        this.allocation = ['Texture'];

        const inp = new ClassicPreset.Input(sockets.image, 'Image');
        const inpX = new ClassicPreset.Input(sockets.num, 'Translate X');
        const inpY = new ClassicPreset.Input(sockets.num, 'Translate Y');
        const inputRepeat = new ClassicPreset.Input(sockets.num, 'Repeat');

        inpX.addControl(new ClassicPreset.InputControl('number', { initial: data.x, change: di.process }));
        inpY.addControl(new ClassicPreset.InputControl('number', { initial: data.y, change: di.process }));
        inputRepeat.addControl(new ClassicPreset.InputControl('number', { initial: data.repeat, change: di.process }));

        this.addInput('image', inp)
        this.addInput('x', inpX)
        this.addInput('y', inpY)
        this.addInput('repeat', inputRepeat)
    }

    async data(inputs: any) {
        const xControl = (this.inputs['x']?.control as ClassicPreset.InputControl<'number'>).value
        const yControl = (this.inputs['y']?.control as ClassicPreset.InputControl<'number'>).value
        const repeatControl = (this.inputs['repeat']?.control as ClassicPreset.InputControl<'number'>).value

        const texture = inputs['image'] && inputs['image'][0] instanceof WebGLTexture
            ? inputs['image'][0]
            : Utils.createMockTexture('');
        const x = inputs['x'] && typeof inputs['x'][0] === 'number'
            ? inputs['x'][0]
            : xControl;
        const y = inputs['y'] && typeof inputs['y'][0] === 'number'
            ? inputs['y'][0]
            : yControl;
        const repeat = inputs['repeat'] && typeof inputs['repeat'][0] === 'number'
            ? inputs['repeat'][0]
            : repeatControl;

        const result = Utils.createMockCanvas();

        result.transform(texture, x, y, repeat);

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize(): Data {
        return {
            x: (this.inputs['x']?.control as ClassicPreset.InputControl<'number'>).value as number,
            y: (this.inputs['y']?.control as ClassicPreset.InputControl<'number'>).value as number,
            repeat: (this.inputs['repeat']?.control as ClassicPreset.InputControl<'number'>).value as number,
        }
    }
}
