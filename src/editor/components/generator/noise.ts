import { ClassicPreset } from 'rete';
import { CommonTexture } from '../../common/components/texture';
import Utils from '../../utils';
import sockets from '../../sockets';
import { DiContainer } from '../../index';

export class Noise extends CommonTexture {
    allocation: string[]
    width = 180
    height = 310

    static ID = 'Noise texture'

    constructor(di: DiContainer) {
        super('Noise texture', di)
        this.allocation = ['Generator'];

        const inp = new ClassicPreset.Input(sockets.num, 'Level');
        const ctrl = new ClassicPreset.InputControl('number', { initial: 1, change: di.process })

        inp.addControl(ctrl);

        this.addInput('level', inp);
    }

    async data() {
        // var level = typeof inputs['level'][0] === 'number'
        //     ? inputs['level'][0] /// ??? 1 or level
        //     : node.data.level;

        const result = Utils.createMockCanvas();

        result.noise();

        const image = result.toTexture();

        this.updatePreview(image);

        return {
            image
        }
    }

    serialize() {
        return {
            level: (this.inputs['level']?.control as ClassicPreset.InputControl<'number'>).value
        }
    }
}
