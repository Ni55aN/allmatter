import preview from '../../controls/preview'
import sockets from '../../sockets';
import store from '../../../store';

export function updatePreview(node, obj) {

    var nodeInstance = store
        .state
        .nodeEditor
        .nodes
        .find(n => n.id === node.id);

    if (!nodeInstance) 
        console.warn('Node with a preview of the texture not found');
    
    var controls = nodeInstance
        .controls
        .filter(c => c.updatePreview)

    if (controls.length === 0) 
        console.warn('No controls found for the preview.');
    
    controls.forEach(c => {
        c.updatePreview(obj)
    });
}

export default function () {

    var out = new D3NE.Output('Image', sockets.image);
    var ctrl = preview();

    return new D3NE
        .Node('Texture')
        .addControl(ctrl)
        .addOutput(out);
}
