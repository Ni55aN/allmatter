import { ClassicPreset, NodeEditor } from 'rete';
import { DataflowNode } from 'rete-engine';
import { DiContainer, Schemes } from '../../index';
import sockets from '../../sockets';
import { Module, Modules } from '../../modules';
import { removeConnections } from '../../utils';

type Data = {
    path: string
}

export class ModuleNode extends ClassicPreset.Node implements DataflowNode {
    width = 180
    height = 120

    static ID = 'Module'

    module: null | Module = null;
    path = ''

    constructor(private di: DiContainer, data: Data) {
        super('Module')
        this.path = data.path

        const ctrl = new ClassicPreset.InputControl('text', {
            initial: data.path,
            change: async (path) => {
                this.path = path
                if (await this.update()) {
                    di.updateNode(this.id)
                }
            },
        });

        this.addControl('module', ctrl);
    }

    async update() {
        const module = this.di.modules.findModule(this.path);

        if (this.module === module) return false
        this.module = module

        await removeConnections(this.di.editor, this.id)
        if (this.module) {
            const editor = new NodeEditor<Schemes>();
            await this.module.apply(editor);

            const { inputs, outputs } = Modules.getPorts(editor);
            this.syncPorts(inputs, outputs);
        } else this.syncPorts([], []);
        return true
    }

    syncPorts(inputs: string[], outputs: string[]) {
        Object.keys(this.inputs).forEach((key: keyof typeof this.inputs) =>
            this.removeInput(key)
        );
        Object.keys(this.outputs).forEach((key: keyof typeof this.outputs) =>
            this.removeOutput(key)
        );

        inputs.forEach((key) => {
            this.addInput(key, new ClassicPreset.Input(sockets.value, key));
        });
        outputs.forEach((key) => {
            this.addOutput(key, new ClassicPreset.Output(sockets.value, key));
        });
        this.height =
            110 +
            25 * (Object.keys(this.inputs).length + Object.keys(this.outputs).length);
    }


    async data(inputs: Record<string, any>) {
        const data = await this.module?.exec(inputs);

        return data || {};
    }

    serialize(): Data {
        return {
            path: (this.controls.module as ClassicPreset.InputControl<'text'>).value as string
        };
    }
}
