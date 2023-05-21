// import { Control } from 'rete';
// import Color from 'color';

import { ClassicPreset } from 'rete';

export class ColorPicker extends ClassicPreset.Control {
    constructor(public value: string, public change: () => void) {
        super()
    }

    setValue(value: string) {
        this.value = value
        this.change()
    }
}

// export default class ColorPicker extends Control {

//     constructor(key, color, change) {
//         super(key);
//         this.props = { color }
//         // eslint-disable-next-line @typescript-eslint/no-this-alias
//         const self = this
//         this.component = {
//             props: ['color', 'putData', 'getData'],
//             template: '<input type="color" v-model="value" @change="change()"/>',
//             data() {
//                 return {
//                     value: '#000'
//                 }
//             },
//             methods: {
//                 change() {
//                     const c = new Color(this.value);

//                     this.putData(key, c.array());
//                     change()
//                 }
//             },
//             mounted() {
//                 const c = this.getData(key) ? new Color(this.getData(key)) : new Color(this.color);

//                 this.value = c.hex();
//                 this.putData(key, c.array());
//             }
//         }
//     }
// }
