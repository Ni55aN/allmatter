import { Control } from 'rete';
import Preview from './Preview.vue';
// import eventbus from '../../eventbus';
// import store from '../../store';

export default class extends Control {
    constructor(pushTexture) {
        super('preview');
        this.component = Preview;
        this.props = { pushTexture };
    }

    updatePreview(texture) {
        if (!(texture instanceof WebGLTexture))
            throw new Error('Need Canvas instance');

        this.vueContext.setTexture(texture);
    }
}
