import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DiContainer } from '../../index';

export class Brick extends CommonTexture {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'Brick'

    constructor(di: DiContainer) {
        super('Brick texture', di);
        this.allocation = ['Generator'];

        const inp = new ClassicPreset.Input(sockets.num, 'Count');
        const inp2 = new ClassicPreset.Input(sockets.num, 'Margin');

        const ctrl = new ClassicPreset.InputControl('number', { initial: 12, change: di.process });
        const ctrl2 = new ClassicPreset.InputControl('number', { initial: 0.04, change: di.process })

        inp.addControl(ctrl);
        inp2.addControl(ctrl2);

        this.addInput('count', inp)
        this.addInput('margin', inp2);
    }

    data(inputs: any) {
        const controlCount = (this.inputs['count']?.control as ClassicPreset.InputControl<'number'>).value
        const controlMargin = (this.inputs['margin']?.control as ClassicPreset.InputControl<'number'>).value

        const count = inputs['count'] && typeof inputs['count'][0] === 'number'
            ? inputs['count'][0]
            : controlCount;
        const margin = inputs['margin'] && typeof inputs['margin'][0] === 'number'
            ? inputs['margin'][0]
            : controlMargin;

        const result = Utils.createMockCanvas();

        result.fillStyle([1, 1, 1, 1]);
        result.drawBricks(count, margin);

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize() {
        return {
            count: (this.inputs['count']?.control as ClassicPreset.InputControl<'number'>).value,
            margin: (this.inputs['margin']?.control as ClassicPreset.InputControl<'number'>).value
        }
    }
}
