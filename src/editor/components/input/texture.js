import modifyTextureNode from '../../common/builders/texture';
import sockets from '../../sockets';
import textInput from '../../controls/text-input';
import { moduleManager } from '../../module';

export default new D3NE.Component('Input texture', {
    builder(node) {
        modifyTextureNode(node);

        var ctrl = textInput('name', 'Name');
        var ctrl2 = new D3NE.Control('<input type="file"/>', (el, control) => {
            el.addEventListener('change', () => {
                control
                    .getNode()
                    .controls[1]
                    .updatePreview();
            });
        });

        return node
            .addControl(ctrl, 0)
            //.addControl(ctrl2)
    },
    async worker(node, inputs, outputs) {
        moduleManager.workerInputs(...arguments);
    }
});