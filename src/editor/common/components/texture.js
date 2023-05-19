import { Component, Output } from 'rete';
import Preview from '../../controls/preview'
import sockets from '../../sockets';

export default class extends Component {

    texturePreview = null

    builder(node) {
        const out = new Output('image', 'Image', sockets.image);
        const ctrl = new Preview((fetch) => {
            const canvas = fetch(this.texturePreview.getSize())

            this.texturePreview.show(canvas)
        })

        return node
            .addControl(ctrl)
            .addOutput(out);
    }

    updatePreview(node, texture) {
        const inst = this.editor.nodes.find(n => n.id === node.id);

        if (inst)
            inst.controls.get('preview').updatePreview(texture);
    }
}
