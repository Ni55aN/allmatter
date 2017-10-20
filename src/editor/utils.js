import store from '../store';

export default {
    createEmptyTexture(w, h, isNormalMap) {
        var gl = Texturity.getGL();

        var data = isNormalMap
            ? new Uint8Array([128, 255, 128, 255])
            : new Uint8Array([0, 0, 0, 255]);

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
    createMockTexture(isNormalMap) {
        var state = store.state;

        return this.createEmptyTexture(state.textureSize, state.textureSize, isNormalMap);
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