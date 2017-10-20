import Vue from 'vue';
import Vuex from 'vuex';
import Tour from '../guide-tour';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        editorIdentifier: 'allmatter@0.2.0',
        tour: new Tour(),
        showingAbout: false,
        textureSize: 1024,
        nodeEditor: null,
        geometry: null,
        process: false,
        maps: [],
        texture: {
            el: null,
            src: null
        }
    },
    getters: {
        showingAbout(state) {
            return state.showingAbout;
        },
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
        showAbout(state, val = true) {
            state.showingAbout = val;
        },
        allowProcess(state) {
            state.process = true;
        },
        denyProcess(state) {
            state.process = false;
        },
        setGeometry(state, geometry) {
            state.geometry = geometry;
        },
        setTextureSize(state, size) {
            state.textureSize = size;
        },
        setNodeEditor(state, nodeEditor) {
            if (state.nodeEditor !== null) 
                throw new Error('NodeEditor has already been specified');
            state.nodeEditor = nodeEditor;
        },
        updateMaterial(state, maps) {
            state.maps = maps;
        },
        updateTexture(state, texture) {
            state.texture = texture;
        }
    }
});