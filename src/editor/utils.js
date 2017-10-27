import * as Texturity from "texturity.js";
import store from '../store';

function getColor(type) {
    switch (type) {
        case 'normal':
            return [128, 255, 128, 255];

        case 'white':
            return [255, 255, 255, 255];

        default:
            return [0, 0, 0, 255];
    }
}

export default {
    createEmptyTexture(w, h, type) {
        var gl = Texturity.getGL();
        var data = new Uint8Array(getColor(type));
        var emptyTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return emptyTexture;
    },
    createMockCanvas() {
        var state = store.state;

        return new Texturity.Canvas(state.textureSize, state.textureSize);
    },
    createMockTexture(type) {
        var state = store.state;

        return this.createEmptyTexture(state.textureSize, state.textureSize, type);
    },
    textureToSrc(texture) {
        var state = store.state;
        var w = state.textureSize;
        var h = state.textureSize;
        var canvas = new Texturity.Canvas(w, h);

        return canvas
            .drawTexture(texture, 0, 0, w, h)
            .toSrc();
    }
}