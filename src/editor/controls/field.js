import { Control } from 'rete';
import VueNumControl from './NumInput.vue';

export default class FieldControl extends Control {
    constructor(emitter, key, params = {}) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, params, change: () => this.onChange() };
    }

    setValue(value) {
        const ctx = this.vueContext || this.props;

        ctx.value = value;
    }

    onChange() {}
}