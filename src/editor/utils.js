import * as Texturity from 'texturity.js';
// import store from '../store';
import { legacyStore } from '../store'

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
    createEmptyTexture(type) {
        const gl = Texturity.getGL();
        const data = new Uint8Array(getColor(type));
        const emptyTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return emptyTexture;
    },
    createMockCanvas() {
        return new Texturity.Canvas(legacyStore.textureSize, legacyStore.textureSize);
    },
    createMockTexture(type) {
        return this.createEmptyTexture(type);
    },
    textureToSrc(texture) {
        const w = legacyStore.textureSize;
        const h = legacyStore.textureSize;
        const canvas = new Texturity.Canvas(w, h);

        return canvas
            .drawTexture(texture, 0, 0, w, h)
            .toSrc();
    }
}
