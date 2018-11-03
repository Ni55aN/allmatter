import { Control } from 'rete';
import Color from 'color';
import eventbus from '../../eventbus';

export default class ColorPicker extends Control {
    
    constructor(key, color) {
        super();
        color = this.getData(key) ? new Color(this.getData(key)) : new Color(color.array());
        this.putData(key, color.array());

        this.components = {
            template: '<input type="color" v-model="value" @change="change()"/>',
            data() {
                return {
                    value: color.hex()
                }
            },
            methods: {
                change() {
                    const c = new Color(this.value);
        
                    this.putData(key, c.array());
                    eventbus.$emit('process');
                }
            }
        }
    }
}