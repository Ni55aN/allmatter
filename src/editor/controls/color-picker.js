import { Control } from 'rete';
import Color from 'color';
import eventbus from '../../eventbus';

export default class ColorPicker extends Control {
    
    constructor(key, color) {
        super(key);
        this.props = { color }
        this.component = {
            props: ['color', 'putData', 'getData'],
            template: '<input type="color" v-model="value" @change="change()"/>',
            data() {
                return {
                    value: '#000'
                }
            },
            methods: {
                change() {
                    const c = new Color(this.value);
        
                    this.putData(key, c.array());
                    eventbus.$emit('process');
                }
            },
            mounted() {
                const c = this.getData(key) ? new Color(this.getData(key)) : new Color(this.color);

                this.value = c.hex();
                this.putData(key, c.array());
            }
        }
    }
}