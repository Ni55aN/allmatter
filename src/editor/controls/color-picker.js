import { Control } from 'rete';
import Color from '../../color';
import eventbus from '../../eventbus';

export default class ColorPicker extends Control {
    
    constructor(key, color) {
        super();
        color = this.getData(key) ? Color.fromArray(this.getData(key)) : color.clone();
        this.putData(key, color.toArray());

        this.components = {
            template: '<input type="color" v-model="value" @change="change()"/>',
            data() {
                return {
                    value: color.toHex()
                }
            },
            methods: {
                change() {
                    const c = Color.fromHex(this.value);
        
                    this.putData(key, c.toArray());
                    eventbus.$emit('process');
                }
            }
        }
    }
}