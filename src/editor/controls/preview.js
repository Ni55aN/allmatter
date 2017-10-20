import store from '../../store';

var width = 140;
var height = 140;

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

        control.updatePreview = function (obj) {
            if (obj instanceof Texturity.Canvas) 
                obj = obj.toSrc();
            
            el.src = obj;
            if (store.state.texture.el === el) 
                store.commit('updateTexture', {el, src: el.src});
        }
    });
}