<template lang="pug">
img(:width="width+'px'" :height="height+'px'", :src="src", @mousedown.stop="mousedown")
</template>

<script>
import * as Texturity from 'texturity.js';
import store from '../../store';

export default {
    props: ['emitter', 'store'],
    data() {
        return {
            width: 140,
            height: 140,
            texture: null
        }
    },
    computed: {
        src() {
            if (!this.texture) return '';

            return this.texture2src(this.texture, this.width, this.height)
        }
    },
    methods: {
        setTexture(texture) {
            this.texture = texture;
        },
        texture2src(texture, w, h) {
            var c = new Texturity.Canvas(w, h);

            c.drawTexture(texture, 0, 0, w, h);
            var src = c.toSrc();
      
            return src;
        },
        mousedown() {
            const size = store.state.textureSize;
        
            this.store.commit('updateTexture', { src: this.texture2src(this.texture, size, size) });
        }
    }
}
</script>

<style lang="sass" scoped>

</style>
