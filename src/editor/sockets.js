import { Socket } from 'rete';

const num = new Socket('Number value');
const image = new Socket('Image');
const value = new Socket('Image');
const curve = new Socket('Curve');
const color = new Socket('Color');

num.combineWith(value);
image.combineWith(value);
color.combineWith(value);
value.combineWith(num);
value.combineWith(image);
value.combineWith(color);

num.combineWith(image);
num.combineWith(color);
color.combineWith(image);

export default {
    num,
    image,
    value,
    curve,
    color
}