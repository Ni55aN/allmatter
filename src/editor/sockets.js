import {D3NE} from 'd3-node-editor';

var num = new D3NE.Socket('number', 'Number value', 'hint');
var image = new D3NE.Socket('image', 'Image', 'hint');
var value = new D3NE.Socket('value', 'Image', 'hint');
var curve = new D3NE.Socket('curve', 'Curve', 'hint');
var color = new D3NE.Socket('color', 'Color', 'hint');

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