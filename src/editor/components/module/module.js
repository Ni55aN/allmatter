import { D3NE } from 'd3-node-editor';
import { getSocket, moduleManager } from '../../module';
import store from '../../../store';
import moduleEdit from '../../controls/module-edit';

export default new D3NE.Component('Module', {
    builder(node) {
        if (!node.data.module)
            node.data.module = {
                name: 'module',
                data: {
                    id: store.state.editorIdentifier,
                    nodes: {}
                }
            };
        
        moduleManager.getInputs(node.data.module.data).forEach(i => {
            node.addInput(new D3NE.Input(i.name, getSocket(i.title)));
        });
    
        moduleManager.getOutputs(node.data.module.data).forEach(o => {
            node.addOutput(new D3NE.Output(o.name, getSocket(o.title)));
        });

        var moduleCtrl = moduleEdit(node.data.module);
        
        return node
            .addControl(moduleCtrl);
    },
    async worker(n, i, o) {
        await moduleManager.workerModule(...arguments);
    }
});