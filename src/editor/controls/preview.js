import store from '../../store';

var width = 140;
var height = 140;

function optimizeCanvasSrc(canvas) {
    canvas.save();
    var texture = canvas.toTexture();
    var c = new Texturity.Canvas(width, height);

    c.drawTexture(texture, 0, 0, width, height);
    Texturity.disposeTexture(texture);
    var src = c.toSrc();

    canvas.restore();
    return src;
}

export default function () {
    return new D3NE.Control(`<img width="${width}px" height="${height}px"/>`, (el, control) => {
        el
            .addEventListener('mousedown', function (e) {
                store.commit('updateTexture', {el, src: el.src});
                e.stopPropagation();
            });

        control.getElement = function () {
            return el;
        }

        control.updatePreview = function (canvas) {
            if (!(canvas instanceof Texturity.Canvas)) 
                throw new Error('Need Canvas instance');
            
            el.src = optimizeCanvasSrc(canvas);
            if (store.state.texture.el === el) 
                store.commit('updateTexture', {
                    el,
                    src: canvas.toSrc()
                });

        }
    });
}