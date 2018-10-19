import * as Texturity from 'texturity.js';
import { Control } from 'rete';
import store from '../../store';
import eventbus from '../../eventbus';
import Preview from './Preview.vue';


export default class extends Control {
    constructor() {
        super('preview');
        this.component = Preview;
        this.props = { emitter: eventbus, store };
    }


    updatePreview(canvas) {
        if (!(canvas instanceof Texturity.Canvas)) 
            throw new Error('Need Canvas instance');
        console.log('updatePreview')
        this.vueContext.setCanvas(canvas);
    }
}