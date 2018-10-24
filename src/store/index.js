import Tour from '../guide-tour';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tour: new Tour(),
        textureSize: 1024,
        geometry: null,
        maps: [],
        texture: {
            el: null,
            src: null
        },
        previewControls: []
    },
    getters: {
        tour(state) {
            return state.tour;
        },
        geometry(state) {
            return state.geometry;
        },
        maps(state) {
            return state.maps;
        },
        texture(state) {
            return state.texture;
        },
        textureSize(state) {
            return state.textureSize;
        }
    },
    mutations: {
        registerPreviewControl(state, {id, control}) {
            state.previewControls[id] = control;
        },
        updatePreviewControl(state, { id, canvas }) {
            if (state.previewControls[id]) // check if control exist in editor
                state.previewControls[id].updatePreview(canvas);
        },
        setGeometry(state, geometry) {
            state.geometry = geometry;
        },
        setTextureSize(state, size) {
            state.textureSize = size;
        },
        updateMaterial(state, maps) {
            state.maps = maps;
        },
        updateTexture(state, texture) {
            state.texture = texture;
        }
    }
});