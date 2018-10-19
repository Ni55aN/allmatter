import { Component } from 'rete';
import FieldControl from '../../controls/field';

export default class ModuleComponent extends Component {

    constructor() {
        super("Module");
        this.module = {
            nodeType: 'module'
        }
    }

    builder(node) {
        var ctrl = new FieldControl(this.editor, 'module', {value: 'Module name..'});
        ctrl.onChange = () => {
            this.updateModuleSockets(node);
            node.update();
        }
        return node.addControl(ctrl);
    }

    change(node, item) {
        node.data.module = item;
        this.editor.trigger('process');
    }
}