import { ClassicPreset } from 'rete';
import modifyMath from '../../common/builders/math'
import sockets from '../../sockets';
import { DataflowNode } from 'rete-engine';
import { DiContainer } from '../../index';

type Data = {
    pow: number
}

export class Pow extends ClassicPreset.Node implements DataflowNode {
    allocation: string[]
    width = 180
    height = 180

    static ID = 'pow'

    constructor(di: DiContainer, data: Data) {
        super('Pow');
        this.allocation = ['Math'];

        modifyMath(this);

        const inp = new ClassicPreset.Input(sockets.num, 'Pow');

        inp.addControl(new ClassicPreset.InputControl('number', {
            initial: data.pow,
            change: di.process
        }));

        this.addInput('pow', inp);
    }

    data() {
        return {}
    }

    serialize(): Data {
        return {
            pow: (this.inputs['pow']?.control as ClassicPreset.InputControl<'number'>).value as number
        }
    }
}
