import {D3NE} from 'd3-node-editor';
import modifyTextureNode from '../../common/builders/texture';
import modifyIdInput from '../../common/builders/modificator/input-id'

export default new D3NE.Component('input texture', {
    builder(node) {
        var node = modifyIdInput(modifyTextureNode(node));

        node.title = 'Input texture';

        var ctrl = new D3NE.Control('<input type="file"/>', (el, control) => {
            el.addEventListener('change', () => {
                control
                    .getNode()
                    .controls[1]
                    .updatePreview();
            });
        });

        return node.addControl(ctrl);
    },
    async worker(node, inputs, outputs) {}
});