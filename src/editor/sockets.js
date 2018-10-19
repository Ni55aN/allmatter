import { Socket } from 'rete';

var num = new Socket('Number value');
var image = new Socket('Image');
var value = new Socket('Image');
var curve = new Socket('Curve');
var color = new Socket('Color');

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